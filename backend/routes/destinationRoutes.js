const express = require("express");
const router = express.Router();
const Destination = require("../models/Destination");

// Get all destinations
router.get("/", async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new destination
router.post("/", async (req, res) => {
    const { name, image, description, source } = req.body;

    const destination = new Destination({
        name,
        image,
        description,
        source,
    });

    try {
        const newDestination = await destination.save();
        res.status(201).json(newDestination);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ message: "Destination not found" });
        res.json(destination); // Ensure 'source' is included in this response
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update a destination
router.put("/:id", async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ message: "Destination not found" });

        const updatedDestination = await Destination.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                district: req.body.district || destination.district // Fallback to existing district
            },
            { new: true, runValidators: true }
        );

        res.json(updatedDestination);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a destination
router.delete("/:id", async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ message: "Destination not found" });

        await destination.remove();
        res.json({ message: "Destination deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
