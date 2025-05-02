const express = require("express");
const Tour = require("../models/Tour");

const router = express.Router();

// Get all tours
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tours" });
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
