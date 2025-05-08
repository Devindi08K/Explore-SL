const express = require("express");
const router = express.Router();
const Affiliate = require("../models/affiliateLink");
const { protect, authorize } = require("../middleware/authMiddleware"); // Add this import

// Route order matters - place more specific routes first
// Get all listings (admin route)
router.get("/all", protect, authorize(["admin"]), async (req, res) => {
  try {
    const affiliates = await Affiliate.find()
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude version key
    
    console.log(`Found ${affiliates.length} affiliate links`); // Debug log
    res.json(affiliates);
  } catch (error) {
    console.error("Error fetching all affiliate links:", error);
    res.status(500).json({ 
      error: "Error fetching affiliate links",
      details: error.message 
    });
  }
});

// Get affiliate links by category
router.get("/category/:category", async (req, res) => {
  try {
    const affiliates = await Affiliate.find({ category: req.params.category });
    res.json(affiliates);
  } catch (error) {
    res.status(500).json({ error: "Error fetching affiliate links" });
  }
});

// Get a single affiliate link by ID
router.get("/:id", protect, authorize(["admin"]), async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) {
      return res.status(404).json({ error: "Business listing not found" });
    }
    res.json(affiliate);
  } catch (error) {
    console.error("Error fetching business listing:", error);
    res.status(500).json({ error: "Error fetching business listing details" });
  }
});

// Get all affiliate links (only verified and approved for public)
router.get("/", async (req, res) => {
  try {
    const affiliates = await Affiliate.find({ 
      isVerified: true,
      status: 'approved'
    });
    res.json(affiliates);
  } catch (error) {
    res.status(500).json({ error: "Error fetching affiliate links" });
  }
});

// Create a new affiliate link
router.post("/", async (req, res) => {
  try {
    const newAffiliate = new Affiliate(req.body);
    await newAffiliate.save();
    res.status(201).json(newAffiliate);
  } catch (error) {
    res.status(400).json({ 
      error: "Error creating affiliate link",
      details: error.message 
    });
  }
});

// Update an existing affiliate link
router.put("/:id", async (req, res) => {
  try {
    const updatedAffiliate = await Affiliate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAffiliate) {
      return res.status(404).json({ error: "Affiliate link not found" });
    }

    res.json(updatedAffiliate);
  } catch (error) {
    res.status(400).json({ 
      error: "Error updating affiliate link",
      details: error.message 
    });
  }
});

// Delete an affiliate link
router.delete("/:id", async (req, res) => {
  try {
    const deletedAffiliate = await Affiliate.findByIdAndDelete(req.params.id);

    if (!deletedAffiliate) {
      return res.status(404).json({ error: "Affiliate link not found" });
    }

    res.json({ message: "Affiliate link deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting affiliate link" });
  }
});

// Add verification endpoint
router.patch("/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isVerified } = req.body;
    
    const affiliate = await Affiliate.findById(id);
    if (!affiliate) {
      return res.status(404).json({ error: "Business listing not found" });
    }

    const updatedAffiliate = await Affiliate.findByIdAndUpdate(
      id,
      {
        status,
        isVerified,
        verifiedAt: new Date(),
        verifiedBy: req.user._id
      },
      { new: true }
    );

    res.json(updatedAffiliate);
  } catch (error) {
    res.status(400).json({ error: "Error updating verification status" });
  }
});

module.exports = router;
