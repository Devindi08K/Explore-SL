const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const TourGuide = require("../models/TourGuide");
const Vehicle = require("../models/Vehicle");
const Blog = require("../models/blog");
const Tour = require("../models/Tour");
const Destination = require("../models/Destination");
const AffiliateLink = require("../models/affiliateLink");

const router = express.Router();

// Example of an admin route
router.get("/dashboard", protect, authorize(["admin"]), (req, res) => {
    res.send("Welcome to the Admin Dashboard");
});

// Get all users
router.get("/users", protect, authorize(["admin"]), async (req, res) => {
  try {
    const users = await User.find()
      .select('userName email role createdAt')  // Make sure to select createdAt
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Update user role
router.patch("/users/:id/role", protect, authorize(["admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating user role" });
  }
});

// Get dashboard statistics
router.get("/dashboard-stats", protect, authorize(["admin"]), async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      destinations: await Destination.countDocuments(),
      vehicles: await Vehicle.countDocuments({ isVerified: true }),
      tourGuides: await TourGuide.countDocuments({ isVerified: true }),
      blogs: await Blog.countDocuments(),
      affiliates: await AffiliateLink.countDocuments(),
      tours: await Tour.countDocuments(),
      pendingSubmissions: {
        tourGuides: await TourGuide.countDocuments({ status: 'pending' }),
        vehicles: await Vehicle.countDocuments({ status: 'pending' }),
        blogs: await Blog.countDocuments({ status: 'pending' }),
        businessListings: await AffiliateLink.countDocuments({ status: 'pending' }),
        tours: await Tour.countDocuments({ status: 'pending' })
      }
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
});

// Get all pending submissions by type
router.get("/pending/:type", protect, authorize(["admin"]), async (req, res) => {
  try {
    let pendingItems = [];
    const { type } = req.params;

    switch (type) {
      case 'tourGuides':
        pendingItems = await TourGuide.find({ 
          $or: [
            { status: 'pending' }, 
            { status: { $exists: false } },
            { isVerified: false }
          ] 
        }).select('name yearsOfExperience languages contactEmail status _id');
        break;

      case 'vehicles':
        pendingItems = await Vehicle.find({ 
          $or: [
            { status: 'pending' }, 
            { status: { $exists: false } },
            { isVerified: false }
          ] 
        }).select('ownerName vehicleType vehicleModel contactPhone status _id');
        break;

      case 'blogs':
        pendingItems = await Blog.find({ 
          $or: [
            { status: 'pending' }, 
            { status: { $exists: false } },
            { isVerified: false }
          ] 
        }).select('authorName title submittedAt status _id');
        break;

      case 'businessListings':
        pendingItems = await AffiliateLink.find({ 
          $or: [
            { status: 'pending' }, 
            { status: { $exists: false } },
            { isVerified: false }
          ] 
        }).select('businessName businessType location contactEmail status _id');
        break;

      case 'tours':
        pendingItems = await Tour.find({ 
          $or: [
            { status: 'pending' }, 
            { status: { $exists: false } },
            { isVerified: false }
          ] 
        }).select('name type duration contactEmail status _id');
        break;

      default:
        return res.status(400).json({ error: 'Invalid submission type' });
    }

    console.log(`Found ${pendingItems.length} pending ${type}`);
    res.json(pendingItems);
  } catch (error) {
    console.error('Error fetching pending submissions:', error);
    res.status(500).json({ error: 'Error fetching pending submissions' });
  }
});

// Update submission status
router.patch("/:type/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    const updateData = {
      status,
      isVerified: status === 'approved',
      verifiedAt: new Date(),
      verifiedBy: req.user._id
    };

    let updatedItem;

    switch (type) {
      case 'tourGuides':
        // Existing tour guide logic - already correct
        const existingGuide = await TourGuide.findById(id);
        if (!existingGuide) {
          return res.status(404).json({ error: 'Tour guide not found' });
        }
        updatedItem = await TourGuide.findByIdAndUpdate(
          id,
          { 
            ...existingGuide.toObject(),
            ...updateData,
            languages: existingGuide.languages || [],
            specialization: existingGuide.specialization || [],
            preferredAreas: existingGuide.preferredAreas || [],
            certifications: existingGuide.certifications || []
          },
          { new: true }
        );
        break;

      case 'vehicles':
        const existingVehicle = await Vehicle.findById(id);
        if (!existingVehicle) {
          return res.status(404).json({ error: 'Vehicle not found' });
        }
        updatedItem = await Vehicle.findByIdAndUpdate(
          id,
          {
            ...existingVehicle.toObject(),
            ...updateData,
            features: existingVehicle.features || [],
            servingAreas: existingVehicle.servingAreas || [],
            vehicleImages: existingVehicle.vehicleImages || []
          },
          { new: true }
        );
        break;

      case 'blogs':
        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
          return res.status(404).json({ error: 'Blog not found' });
        }
        updatedItem = await Blog.findByIdAndUpdate(
          id,
          {
            ...existingBlog.toObject(),
            ...updateData,
            status: status,
            isVerified: status === 'approved'
          },
          { new: true }
        );
        break;

      case 'businessListings':
        const existingBusiness = await AffiliateLink.findById(id);
        if (!existingBusiness) {
          return res.status(404).json({ error: 'Business listing not found' });
        }
        updatedItem = await AffiliateLink.findByIdAndUpdate(
          id,
          {
            ...existingBusiness.toObject(),
            ...updateData
          },
          { new: true }
        );
        break;

      case 'tours':
        const existingTour = await Tour.findById(id);
        if (!existingTour) {
          return res.status(404).json({ error: 'Tour not found' });
        }
        updatedItem = await Tour.findByIdAndUpdate(
          id,
          {
            ...existingTour.toObject(),
            ...updateData,
            itinerary: existingTour.itinerary || []
          },
          { new: true }
        );
        break;

      default:
        return res.status(400).json({ error: 'Invalid submission type' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ error: 'Error updating submission status' });
  }
});

module.exports = router;
