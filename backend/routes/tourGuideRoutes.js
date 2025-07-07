const express = require("express");
const router = express.Router();
const TourGuide = require("../models/TourGuide");
const TourGuideView = require('../models/TourGuideView');
const { protect, authorize } = require("../middleware/authMiddleware");
const Payment = require('../models/Payment');

// --- Specific GET routes first ---

// Get all tour guides (public, verified only)
router.get("/", async (req, res) => {
  try {
    const guides = await TourGuide.find({ isVerified: true })
      .select('name languages specialization yearsOfExperience isPremium featuredStatus bio contactEmail contactPhone ratePerDay licenseNumber image viewCount averageRating totalReviews')
      .sort({ isPremium: -1, viewCount: -1, createdAt: -1 })
      .lean();
    res.json(guides);
  } catch (error) {
    console.error("Error fetching tour guides:", error);
    res.status(500).json({ error: "Error fetching tour guides" });
  }
});

// Get all guides for admin (including unverified)
router.get("/all", protect, authorize(["admin"]), async (req, res) => {
  try {
    const guides = await TourGuide.find().sort({ createdAt: -1 });
    res.json(guides);
  } catch (error) {
    console.error("Error fetching all tour guides for admin:", error);
    res.status(500).json({ error: "Error fetching tour guides" });
  }
});

// Get tour guide submissions for the current user
router.get("/my-submissions", protect, async (req, res) => {
  try {
    const guides = await TourGuide.find({ submittedBy: req.user._id }).sort({ submittedAt: -1 });
    res.json(guides);
  } catch (error) {
    console.error("Error fetching user's tour guide submissions:", error);
    res.status(500).json({ error: "Error fetching submissions" });
  }
});

// Check premium status for user's tour guides
router.get('/my-premium-status', protect, async (req, res) => {
  try {
    const activePremiumPayment = await Payment.findOne({
      userId: req.user._id,
      serviceType: { $in: ['guide_premium_monthly', 'guide_premium_yearly'] },
      status: 'completed',
      'subscriptionDetails.isActive': true
    }).sort({ createdAt: -1 });

    let activePlanType = null;
    if (activePremiumPayment) {
      activePlanType = activePremiumPayment.serviceType === 'guide_premium_yearly' ? 'yearly' : 'monthly';
    }

    res.json({
      hasActivePremiumSubscription: !!activePremiumPayment,
      activePlanType,
    });
  } catch (error) {
    console.error("Error checking tour guide premium status:", error);
    res.status(500).json({ error: "Error checking premium status" });
  }
});

// Get premium guides for featured display
router.get('/featured/homepage', async (req, res) => {
  try {
    const guides = await TourGuide.find({
      isPremium: true,
      isVerified: true,
      $or: [{ featuredStatus: 'homepage' }, { featuredStatus: 'destination' }]
    }).limit(6);
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching featured guides' });
  }
});

// Get guides that need review (auto-approved premium guides)
router.get('/needs-review', protect, authorize(['admin']), async (req, res) => {
  try {
    const guidesNeedingReview = await TourGuide.find({ needsReview: true, isVerified: true });
    res.json(guidesNeedingReview);
  } catch (error) {
    console.error('Error fetching guides needing review:', error);
    res.status(500).json({ error: 'Error fetching guides needing review' });
  }
});

// --- Dynamic GET route must be last among GETs ---

// Get a single tour guide by ID
router.get("/:id", async (req, res) => {
  try {
    const guide = await TourGuide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    res.json(guide);
  } catch (error) {
    console.error("Error fetching tour guide details:", error);
    res.status(500).json({ error: "Error fetching tour guide details" });
  }
});

// --- POST, PUT, PATCH, DELETE routes ---

// Submit new tour guide registration
router.post("/", protect, async (req, res) => {
  try {
    // Check if the user has already submitted a guide profile
    const existingGuide = await TourGuide.findOne({ submittedBy: req.user._id });
    if (existingGuide) {
      return res.status(409).json({ error: "You have already submitted a tour guide registration." });
    }

    let tourGuideData = { ...req.body, submittedBy: req.user._id, submittedAt: new Date(), status: 'pending', isVerified: false };
    const activePremiumPayment = await Payment.findOne({ userId: req.user._id, serviceType: { $in: ['guide_premium_monthly', 'guide_premium_yearly'] }, status: 'completed', 'subscriptionDetails.awaitingGuideRegistration': true }).sort({ createdAt: -1 });
    if (activePremiumPayment) {
      const expiryDate = new Date(activePremiumPayment.subscriptionDetails.endDate);
      tourGuideData = { ...tourGuideData, isPremium: true, premiumExpiry: expiryDate, analyticsEnabled: true, featuredStatus: 'destination', status: 'approved', isVerified: true, needsReview: true, verifiedAt: new Date() };
      activePremiumPayment.subscriptionDetails.awaitingGuideRegistration = false;
      await activePremiumPayment.save();
    }
    const tourGuide = new TourGuide(tourGuideData);
    await tourGuide.save();
    res.status(201).json(tourGuide);
  } catch (error) {
    console.error("Error creating tour guide:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.message });
    }
    res.status(500).json({ error: "Error creating tour guide" });
  }
});

// Update a tour guide
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedGuide = await TourGuide.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const guide = await TourGuide.findByIdAndUpdate(req.params.id, { isVerified: req.body.isVerified, status: req.body.status || (req.body.isVerified ? 'approved' : 'rejected'), verifiedAt: new Date(), verifiedBy: req.user._id }, { new: true });
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

// Track guide view
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    const userId = req.user?._id;
    if (!sessionId && !userId) {
      await TourGuide.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
      return res.status(200).send();
    }
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);
    const recentView = await TourGuideView.findOne({ 
      guideId: id, 
      $or: [{ userId: userId || null }, { sessionId: sessionId || null }], 
      viewedAt: { $gt: fourHoursAgo } 
    });
    if (!recentView) {
      await TourGuide.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
      await new TourGuideView({ guideId: id, userId: userId || null, sessionId: sessionId || null, viewedAt: new Date() }).save();
    }
    res.status(200).send();
  } catch (error) {
    if (error.code === 'ECONNRESET') {
      // Optionally log as a warning, not an error
      console.warn('Connection reset by peer during view tracking');
      return;
    }
    console.error('Error tracking view:', error);
    res.status(500).send();
  }
});

// Refresh premium status for existing guides
router.post('/refresh-premium/:guideId', protect, async (req, res) => {
  try {
    const guide = await TourGuide.findOne({ _id: req.params.guideId, submittedBy: req.user._id });
    if (!guide) {
      return res.status(404).json({ error: 'Tour guide not found' });
    }
    const activePremiumPayment = await Payment.findOne({ userId: req.user._id, serviceType: { $in: ['guide_premium_monthly', 'guide_premium_yearly'] }, status: 'completed', 'subscriptionDetails.isActive': true });
    if (activePremiumPayment) {
      guide.isPremium = true;
      guide.premiumExpiry = activePremiumPayment.subscriptionDetails.endDate;
      guide.analyticsEnabled = true;
      guide.featuredStatus = 'destination';
      if (guide.status === 'pending') {
        guide.status = 'approved';
        guide.isVerified = true;
        guide.verifiedAt = new Date();
      }
      await guide.save();
      res.json({ message: 'Premium features refreshed', guide: { id: guide._id, name: guide.name, isPremium: guide.isPremium, premiumExpiry: guide.premiumExpiry } });
    } else {
      res.status(400).json({ error: 'No active premium subscription found' });
    }
  } catch (error) {
    console.error('Error refreshing premium features:', error);
    res.status(500).json({ error: 'Error refreshing premium features' });
  }
});

// Mark a guide as reviewed by admin
router.patch('/:id/reviewed', protect, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await TourGuide.findByIdAndUpdate(id, { needsReview: false, reviewedBy: req.user._id, reviewedAt: new Date() }, { new: true });
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    res.json(guide);
  } catch (error) {
    res.status(400).json({ error: 'Error marking guide as reviewed' });
  }
});

// Manually restore premium status (admin only)
router.patch('/:id/restore-premium', protect, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { durationDays = 30 } = req.body;
    const guide = await TourGuide.findById(id);
    if (!guide) {
      return res.status(404).json({ error: 'Tour guide not found' });
    }
    const premiumExpiry = new Date();
    premiumExpiry.setDate(premiumExpiry.getDate() + durationDays);
    guide.isPremium = true;
    guide.premiumExpiry = premiumExpiry;
    guide.analyticsEnabled = true;
    guide.featuredStatus = 'destination';
    await guide.save();
    res.json({ message: `Premium status restored for ${durationDays} days`, guide: { id: guide._id, name: guide.name, isPremium: guide.isPremium, premiumExpiry: guide.premiumExpiry, featuredStatus: guide.featuredStatus } });
  } catch (error) {
    console.error('Error restoring premium status:', error);
    res.status(500).json({ error: 'Error restoring premium status' });
  }
});

module.exports = router;