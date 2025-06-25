const express = require("express");
const router = express.Router();
const TourGuide = require("../models/TourGuide");
const { protect, authorize } = require("../middleware/authMiddleware");

// Get all tour guides (verified only for public)
router.get("/", async (req, res) => {
  try {
    const guides = await TourGuide.find({ isVerified: true });
    res.json(guides);
  } catch (error) {
    console.error("Error fetching tour guides:", error);
    res.status(500).json({ error: "Error fetching tour guides" });
  }
});

// Get all guides for admin (including unverified)
router.get("/all", protect, authorize(["admin"]), async (req, res) => {
  try {
    const guides = await TourGuide.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(guides);
  } catch (error) {
    console.error("Error fetching tour guides:", error);
    res.status(500).json({ error: "Error fetching tour guides" });
  }
});

// Get a single tour guide by ID
router.get("/:id", async (req, res) => {
  // Skip auth check for viewing public guide profiles
  try {
    const guide = await TourGuide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    res.json(guide);
  } catch (error) {
    console.error("Error fetching tour guide:", error);
    res.status(500).json({ error: "Error fetching tour guide details" });
  }
});

// Submit new tour guide registration
router.post("/", async (req, res) => {
  try {
    const tourGuide = new TourGuide({
      ...req.body,
      status: "pending",
      isVerified: false,
      submittedAt: new Date(),
      // Ensure optional arrays are initialized
      languages: req.body.languages || [],
      specialization: req.body.specialization || [],
      certifications: req.body.certifications || [],
      preferredAreas: req.body.preferredAreas || []
    });

    const savedTourGuide = await tourGuide.save();
    res.status(201).json(savedTourGuide);
  } catch (error) {
    console.error("Tour guide registration error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Update a tour guide
router.put("/:id", protect, authorize(["admin"]), async (req, res) => {
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

// Update verification status
router.patch("/:id/verify", protect, authorize(["admin"]), async (req, res) => {
  try {
    const guide = await TourGuide.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: req.body.isVerified,
        status: req.body.status || (req.body.isVerified ? 'approved' : 'rejected'),
        verifiedAt: new Date(),
        verifiedBy: req.user._id
      },
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

// Delete a tour guide
router.delete("/:id", protect, authorize(["admin"]), async (req, res) => {
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

// Get tour guide submissions for the current user - CRITICAL BUG FIX
// This route must be defined BEFORE the /:id route to avoid conflicts
router.get("/my-submissions", protect, async (req, res) => {
  try {
    const guides = await TourGuide.find({ 
      submittedBy: req.user._id 
    }).sort({ submittedAt: -1 });
    res.json(guides);
  } catch (error) {
    console.error("Error fetching user's tour guide submissions:", error);
    res.status(500).json({ error: "Error fetching submissions" });
  }
});

const AdminTourGuidePage = () => {
  // ...existing state declarations...

  const fetchGuides = async () => {
    try {
      // Change from "/admin/tour-guides/all" to "/tour-guides/all"
      const response = await api.get("/tour-guides/all");
      console.log("Fetched guides:", response.data);
      setGuides(response.data);
    } catch (error) {
      console.error("Error fetching guides:", error);
    }
  };

  const fetchGuideDetails = async (id) => {
    try {
      // Change from "/tour-guides/${id}" to use the same base path
      const response = await api.get(`/tour-guides/${id}`);
      const guide = response.data;
      setEditingGuide(guide);
      setFormData({
        name: guide.name || '',
        image: guide.image || '',
        languages: guide.languages || [],
        specialization: guide.specialization || [],
        yearsOfExperience: guide.yearsOfExperience || '',
        certifications: guide.certifications || [{ name: '', issuedBy: '', year: '' }],
        licenseNumber: guide.licenseNumber || '',
        contactEmail: guide.contactEmail || '',
        contactPhone: guide.contactPhone || '',
        bio: guide.bio || '',
        availability: guide.availability || '',
        ratePerDay: guide.ratePerDay || '',
        tourAreas: guide.tourAreas || [],
        isVerified: guide.isVerified || false,
        status: guide.status || 'pending'
      });
    } catch (error) {
      console.error('Error fetching guide details:', error);
    }
  };

  const handleVerification = async (id, isVerified) => {
    try {
      await api.patch(`/tour-guides/${id}/verify`, { 
        isVerified,
        status: isVerified ? 'approved' : 'rejected'
      });
      fetchGuides();
    } catch (error) {
      console.error("Error updating verification status:", error);
    }
  };

  // ...rest of the component code
};

module.exports = router;