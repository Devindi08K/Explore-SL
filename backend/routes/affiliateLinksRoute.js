const express = require("express");
const router = express.Router();
const Affiliate = require("../models/affiliateLink");

// Get all affiliate links
router.get("/", async (req, res) => {
  try {
    const affiliates = await Affiliate.find();
    res.json(affiliates);
  } catch (error) {
    res.status(500).json({ error: "Error fetching affiliate links" });
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

module.exports = router;
