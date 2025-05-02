const express = require("express");
const router = express.Router();
const TourGuide = require("../models/TourGuide");

// Get all tour guides
router.get("/", async (req, res) => {
  try {
    const guides = await TourGuide.find();
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tour guides" });
  }
});

// Add a new tour guide
router.post("/", async (req, res) => {
  try {
    const newGuide = new TourGuide(req.body);
    await newGuide.save();
    res.status(201).json(newGuide);
  } catch (error) {
    res.status(400).json({ error: "Error creating tour guide" });
  }
});

// Update a tour guide
router.put("/:id", async (req, res) => {
  try {
    const updatedGuide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGuide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    res.json(updatedGuide);
  } catch (error) {
    res.status(400).json({ error: "Error updating tour guide" });
  }
});

// Delete a tour guide
router.delete("/:id", async (req, res) => {
  try {
    const deletedGuide = await TourGuide.findByIdAndDelete(req.params.id);
    if (!deletedGuide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    res.json({ message: "Tour guide deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting tour guide" });
  }
});

// Update verification status
router.patch("/:id/verify", async (req, res) => {
  try {
    const guide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.isVerified },
      { new: true }
    );
    if (!guide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    res.json(guide);
  } catch (error) {
    res.status(400).json({ error: "Error updating verification status" });
  }
});

module.exports = router;