const express = require("express");
const Tour = require("../models/Tour");
const { protect, authorize } = require("../middleware/authMiddleware");
const Payment = require('../models/Payment');
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig'); // <-- Add this line

// Configure multer for image uploads
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Get all tours (public - only verified)
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find({
      isVerified: true,
      status: 'approved'
    });

    // Add location field to tours that don't have it
    const processedTours = tours.map(tour => {
      if (!tour.location) {
        tour.location = tour.startingPoint || 'Sri Lanka';
      }
      return tour;
    });

    res.json(processedTours);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tours" });
  }
});

// Get all tours (admin)
router.get("/all", protect, authorize(["admin"]), async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tours" });
  }
});

// Get tour submissions for current user
// IMPORTANT: This route must come BEFORE the general '/:id' route.
router.get('/my-submissions', protect, async (req, res) => {
  try {
    const tours = await Tour.find({ submittedBy: req.user._id });
    res.json(tours);
  } catch (error) {
    console.error('Error fetching user tour submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single tour by ID
// This dynamic route must come after more specific GET routes.
router.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate('submittedBy', 'userName email')
      .populate('reviews.user', 'userName');

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Logic to prevent access to unapproved tours by the public
    if (tour.status !== 'approved') {
      // A simple check to see if a user is logged in and is either an admin or the owner.
      // Note: This requires the `protect` middleware to be effective on this route or a similar check.
      // For now, we assume a basic protection check.
      return res.status(403).json({ error: "This tour is not yet available for viewing." });
    }

    res.json(tour);
  } catch (error) {
    console.error("Error fetching tour details:", error);
    res.status(500).json({ error: "Error fetching tour details" });
  }
});

// Add a new tour
router.post("/", protect, upload.single('image'), async (req, res) => {
  try {
    const { name, description, type, location, isExternal, imageUrl, ...rest } = req.body;

    if (!name || !description || !type || !location) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    let imagePath = imageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'tours' });
      imagePath = result.secure_url;
    }
    if (!imagePath) {
      imagePath = "https://placehold.co/600x400?text=Tour+Image";
    }

    const tour = new Tour({
      name,
      description,
      type,
      location,
      isExternal: isExternal === 'true',
      image: imagePath,
      ...rest,
      submittedBy: req.user._id,
      status: 'pending',
      isVerified: false,
      submittedAt: new Date(),
    });

    await tour.save();
    res.status(201).json(tour);
  } catch (error) {
    res.status(400).json({ error: "Error creating tour" });
  }
});

// Update a tour
router.put("/:id", protect, upload.single('image'), async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    if (!tour.location && !req.body.location) {
      req.body.location = tour.startingPoint || 'Sri Lanka';
    }

    let updateData = {
      ...req.body,
      location: req.body.location || tour.location || 'Sri Lanka'
    };

    // Handle Cloudinary upload if a new image is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'tours' });
      updateData.image = result.secure_url;
    } else if (req.body.imageUrl) {
      updateData.image = req.body.imageUrl;
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedTour);
  } catch (error) {
    res.status(400).json({ error: "Error updating tour" });
  }
});

// Verify tour
router.patch("/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        isVerified: req.body.status === 'approved',
        verifiedAt: new Date(),
        verifiedBy: req.user._id
      },
      { new: true }
    );
    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }
    res.json(tour);
  } catch (error) {
    res.status(400).json({ error: "Error updating verification status" });
  }
});

// Delete a tour
router.delete("/:id", async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return res.status(404).json({ error: "Tour not found" });
    }
    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Tour deletion error:", error);
    res.status(400).json({ error: "Error deleting tour" });
  }
});

// Submit a tour partnership
router.post('/partnership', protect, upload.single('image'), async (req, res) => {
  try {
    const { paymentId, imageUrl, ...tourDataFromRequest } = req.body;

    // 1. Verify the payment voucher
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.userId.toString() !== req.user._id.toString() || payment.serviceType !== 'tour_partnership' || !payment.subscriptionDetails.awaitingSubmission) {
      return res.status(403).json({ error: 'Invalid or used payment voucher.' });
    }

    // 2. Create the tour
    const premiumExpiryDate = new Date();
    premiumExpiryDate.setFullYear(premiumExpiryDate.getFullYear() + 1);

    let imagePath = imageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'tours' });
      imagePath = result.secure_url;
    }
    if (!imagePath) {
      imagePath = "https://placehold.co/600x400?text=Tour+Image";
    }

    const tourData = {
      ...tourDataFromRequest,
      isExternal: tourDataFromRequest.isExternal === 'true',
      itinerary: tourDataFromRequest.itinerary || [{ day: "Day 1", description: "Itinerary will be provided upon request." }]
    };

    const newTour = new Tour({
      ...tourData,
      image: imagePath,
      submittedBy: req.user._id,
      isPremium: true,
      premiumExpiry: premiumExpiryDate,
      status: 'pending',
      isVerified: false,
      submittedAt: new Date(),
    });

    const savedTour = await newTour.save();

    // 3. Mark the payment voucher as used
    payment.subscriptionDetails.awaitingSubmission = false;
    payment.subscriptionDetails.itemId = savedTour._id;
    payment.description = `Tour Partnership: ${savedTour.name}`;
    await payment.save();

    res.status(201).json(savedTour);
  } catch (error) {
    console.error('Error submitting tour partnership:', error);
    res.status(500).json({ error: 'Failed to submit tour partnership. Please ensure all required fields are filled correctly.' });
  }
});

module.exports = router;
