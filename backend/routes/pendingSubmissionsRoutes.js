const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const TourGuide = require("../models/TourGuide");
const Vehicle = require("../models/Vehicle");
const Blog = require("../models/blog");
const Affiliate = require("../models/affiliateLink");
const Tour = require("../models/Tour");

// Get pending tour guides
router.get("/tour-guides", protect, authorize(["admin"]), async (req, res) => {
  try {
    const pendingGuides = await TourGuide.find({ 
      status: 'pending',
      isVerified: false 
    });
    res.json(pendingGuides);
  } catch (error) {
    console.error("Error fetching pending guides:", error);
    res.status(500).json({ error: "Error fetching pending tour guides" });
  }
});

// Get all pending vehicles
router.get("/vehicles", protect, authorize(["admin"]), async (req, res) => {
  try {
    const pendingVehicles = await Vehicle.find({ isVerified: false });
    res.json(pendingVehicles);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending vehicles" });
  }
});

// Get all pending blogs
router.get("/blogs", protect, authorize(["admin"]), async (req, res) => {
  try {
    const pendingBlogs = await Blog.find({ status: 'pending' });
    res.json(pendingBlogs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending blogs" });
  }
});

// Get all pending business listings
router.get("/business-listings", protect, authorize(["admin"]), async (req, res) => {
  try {
    const pendingListings = await Affiliate.find({ isVerified: false });
    res.json(pendingListings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending business listings" });
  }
});

// Get all pending tours
router.get("/tours", protect, authorize(["admin"]), async (req, res) => {
  try {
    const pendingTours = await Tour.find({ isVerified: false });
    res.json(pendingTours);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending tours" });
  }
});

// Approve/reject tour guide
router.patch("/tour-guides/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { status, isVerified } = req.body;
    const guide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      {
        status,
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
        verifiedBy: req.user._id
      },
      { new: true }
    );
    
    if (!guide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    
    res.json(guide);
  } catch (error) {
    console.error("Error updating guide status:", error);
    res.status(500).json({ error: "Error updating tour guide status" });
  }
});

// Approve/reject vehicle
router.patch("/vehicles/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        status,
        isVerified: status === 'approved',
        verifiedAt: status === 'approved' ? new Date() : null,
        verifiedBy: req.user._id
      },
      { new: true }
    );
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Error updating vehicle status" });
  }
});

// Similar routes for blogs, business listings, and tours
router.patch("/blogs/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        status,
        isVerified: status === 'approved',
        verifiedAt: status === 'approved' ? new Date() : null,
        verifiedBy: req.user._id
      },
      { new: true }
    );
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Error updating blog status" });
  }
});

router.patch("/business-listings/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const listing = await Affiliate.findByIdAndUpdate(
      req.params.id,
      {
        status,
        isVerified: status === 'approved',
        verifiedAt: status === 'approved' ? new Date() : null,
        verifiedBy: req.user._id
      },
      { new: true }
    );
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Error updating business listing status" });
  }
});

router.patch("/tours/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      {
        status,
        isVerified: status === 'approved',
        verifiedAt: status === 'approved' ? new Date() : null,
        verifiedBy: req.user._id
      },
      { new: true }
    );
    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: "Error updating tour status" });
  }
});

module.exports = router;