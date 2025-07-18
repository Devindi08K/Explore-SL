const express = require("express");
const router = express.Router();
const AffiliateLink = require('../models/affiliateLink');
const Payment = require('../models/Payment'); // Add this missing import
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('../config/cloudinaryConfig'); // Add this import

// Route order matters - place more specific routes first
// Get all listings (admin route)
router.get("/all", protect, authorize(["admin"]), async (req, res) => {
  try {
    const affiliates = await AffiliateLink.find()
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
    const affiliates = await AffiliateLink.find({ businessType: req.params.category });
    res.json(affiliates);
  } catch (error) {
    res.status(500).json({ error: "Error fetching affiliate links" });
  }
});

// Get affiliate links submitted by the current user
router.get("/user", protect, async (req, res) => {
  try {
    const userAffiliates = await AffiliateLink.find({ 
      submittedBy: req.user._id 
    }).sort({ submittedAt: -1 });
    res.json(userAffiliates);
  } catch (error) {
    console.error("Error fetching user's affiliate links:", error);
    res.status(500).json({ error: "Error fetching user's submissions" });
  }
});

// GET my premium status for business listings
router.get('/my-premium-status', protect, async (req, res) => {
  try {
    // The redundant 'const Payment = require(...)' has been removed.
    // The handler will now use the 'Payment' model required at the top of the file.
    const activePremiumPayment = await Payment.findOne({
      userId: req.user._id,
      serviceType: { $in: ['business_listing_monthly', 'business_listing_yearly'] },
      status: 'completed'
    }).sort({ createdAt: -1 });

    let activePlanType = null;
    if (activePremiumPayment) {
      if (activePremiumPayment.serviceType === 'business_listing_yearly') {
        activePlanType = 'yearly';
      } else if (activePremiumPayment.serviceType === 'business_listing_monthly') {
        activePlanType = 'monthly';
      }
    }

    res.json({
      hasActivePremiumSubscription: !!activePremiumPayment,
      activePlanType, // 'monthly', 'yearly', or null
      premiumExpiry: activePremiumPayment?.subscriptionDetails?.endDate || null
    });
  } catch (error) {
    // Fail gracefully by returning a default status, preventing frontend errors.
    console.error("Error fetching business premium status:", error);
    res.json({
      hasActivePremiumSubscription: false,
      activePlanType: null,
      premiumExpiry: null
    });
  }
});

// Get a single affiliate link by ID and track a view
router.get("/:id", async (req, res) => {
  try {
    const affiliate = await AffiliateLink.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } }, // Increment view count
      { new: true }
    );

    if (!affiliate) {
      return res.status(404).json({ error: "Business listing not found" });
    }
    res.json(affiliate);
  } catch (error) {
    console.error("Error fetching business listing:", error);
    res.status(500).json({ error: "Error fetching business listing details" });
  }
});

// Get all approved affiliate links (only verified and approved for public)
router.get("/", async (req, res) => {
  try {
    const affiliates = await AffiliateLink.find({ 
      isVerified: true,
      status: 'approved'
    })
    .sort({ isPremium: -1, submittedAt: -1 }); // Premium first
    res.json(affiliates);
  } catch (error) {
    res.status(500).json({ error: "Error fetching affiliate links" });
  }
});

// Create a new affiliate link
router.post("/", protect, upload.single('image'), async (req, res) => {
  try {
    const { businessName, businessType, description, isExternal, redirectUrl, imageUrl, ...otherFields } = req.body;
    let finalImageUrl = imageUrl;

    if (req.file) {
      // Upload to Cloudinary instead of using local path
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'business-listings' });
      finalImageUrl = result.secure_url;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ error: 'An image URL or uploaded image is required.' });
    }

    let listingData = {
      businessName,
      businessType,
      description,
      location,
      priceRange,
      specialties,
      openingHours,
      imageUrl: finalImageUrl,
      isExternal: isExternal === 'true',
      redirectUrl: isExternal === 'true' ? redirectUrl : '',
      submittedBy: req.user._id,
      status: 'pending',
      listingType: 'regular',
      ...otherFields
    };

    // Check for an active, unused premium payment OR an active subscription
    const activePremiumPayment = await Payment.findOne({
      userId: req.user._id,
      serviceType: { $in: ['business_listing_monthly', 'business_listing_yearly'] },
      status: 'completed',
      'subscriptionDetails.isActive': true
    }).sort({ createdAt: -1 });

    if (activePremiumPayment) {
      const expiryDate = new Date(activePremiumPayment.subscriptionDetails.endDate);
      listingData = {
        ...listingData,
        isPremium: true,
        premiumExpiry: expiryDate,
        analyticsEnabled: true,
        featuredStatus: 'destination',
        status: 'approved',
        isVerified: true,
        needsReview: true,
        verifiedAt: new Date()
      };
      // If this was a pending submission, mark it as used
      if (activePremiumPayment.subscriptionDetails.awaitingSubmission) {
        activePremiumPayment.subscriptionDetails.awaitingSubmission = false;
        await activePremiumPayment.save();
      }
    }

    const newLink = new AffiliateLink(listingData);
    await newLink.save();
    res.status(201).json(newLink);
  } catch (error) {
    console.error("Error creating affiliate link:", error);
    res.status(500).json({ error: "Error creating business listing" });
  }
});

// Update an existing affiliate link
router.put("/:id", protect, upload.single('image'), async (req, res) => {
  try {
    const listing = await AffiliateLink.findOne({
      _id: req.params.id,
      submittedBy: req.user._id
    });
    
    if (!listing) {
      return res.status(404).json({ error: "Business listing not found or you don't have permission to update it" });
    }

    const updateData = { ...req.body };
    
    // Handle Cloudinary upload for new image
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'business-listings' });
      updateData.imageUrl = result.secure_url;
    }
    
    updateData.isExternal = updateData.isExternal === 'true' || updateData.isExternal === true;
    updateData.isPremium = listing.isPremium;
    updateData.premiumExpiry = listing.premiumExpiry;
    updateData.isVerified = listing.isVerified;
    updateData.status = listing.status;
    
    const updatedListing = await AffiliateLink.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (error) {
    console.error("Error updating business listing:", error);
    res.status(400).json({ 
      error: "Error updating business listing",
      details: error.message
    });
  }
});

// Delete an affiliate link
router.delete("/:id", async (req, res) => {
  try {
    const deletedAffiliate = await AffiliateLink.findByIdAndDelete(req.params.id);

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
    
    const affiliate = await AffiliateLink.findById(id);
    if (!affiliate) {
      return res.status(404).json({ error: "Business listing not found" });
    }

    const updatedAffiliate = await AffiliateLink.findByIdAndUpdate(
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

// Mark a listing as reviewed by an admin
router.patch('/:id/reviewed', protect, authorize(['admin']), async (req, res) => {
  try {
    const listing = await AffiliateLink.findByIdAndUpdate(
      req.params.id,
      { needsReview: false, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    );
    if (!listing) {
      return res.status(404).json({ error: 'Business listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Error marking listing as reviewed' });
  }
});

// Refresh premium status for an existing listing
router.post('/refresh-premium/:listingId', protect, async (req, res) => {
  try {
    const listing = await AffiliateLink.findOne({ _id: req.params.listingId, submittedBy: req.user._id });
    if (!listing) {
      return res.status(404).json({ error: 'Business listing not found' });
    }

    const activePremiumPayment = await Payment.findOne({
      userId: req.user._id,
      serviceType: { $in: ['business_listing_monthly', 'business_listing_yearly'] },
      status: 'completed',
      'subscriptionDetails.isActive': true
    });

    if (activePremiumPayment) {
      listing.isPremium = true;
      listing.premiumExpiry = activePremiumPayment.subscriptionDetails.endDate;
      listing.analyticsEnabled = true;
      listing.featuredStatus = 'destination';
      if (listing.status === 'pending') {
        listing.status = 'approved';
        listing.isVerified = true;
        listing.verifiedAt = new Date();
        listing.needsReview = true;
      }
      await listing.save();
      res.json({ message: 'Premium features refreshed', listing });
    } else {
      res.status(400).json({ error: 'No active premium subscription found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error refreshing premium features' });
  }
});

module.exports = router;
