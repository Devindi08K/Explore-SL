const express = require("express");
const Tour = require("../models/Tour");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all tours (public - only verified)
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find({ 
      isVerified: true,
      status: 'approved'
    });
    res.json(tours);
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

// Get single tour
router.get("/:id", protect, authorize(["admin"]), async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tour details" });
  }
});

// Add a new tour
router.post("/", async (req, res) => {
  try {
    const tourData = req.body;
    const newTour = new Tour(tourData);
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    console.error("Tour creation error:", error);
    res.status(400).json({ error: "Error creating tour" });
  }
});

// Update a tour
router.put("/:id", async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTour) {
      return res.status(404).json({ error: "Tour not found" });
    }
    res.json(updatedTour);
  } catch (error) {
    console.error("Tour update error:", error);
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

// Get tour submissions for current user
router.get('/my-submissions', protect, async (req, res) => {
  try {
    const tours = await Tour.find({ 
      submittedBy: req.user._id 
    }).sort({ submittedAt: -1 });
    res.json(tours);
  } catch (error) {
    console.error('Error fetching user tours:', error);
    res.status(500).json({ error: 'Error fetching tours' });
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

module.exports = router;
