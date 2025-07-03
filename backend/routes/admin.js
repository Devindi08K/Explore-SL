const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const TourGuide = require("../models/TourGuide");
const Vehicle = require("../models/Vehicle");
const Blog = require("../models/blog");
const Tour = require("../models/Tour");
const Destination = require("../models/Destination");
const AffiliateLink = require("../models/affiliateLink");
const Review = require("../models/Review"); // Add this line to fix the review deletion issue
const Payment = require("../models/Payment"); // Import Payment model
const mongoose = require("mongoose"); // Import mongoose for database status check

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
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Add this new route
// Get a single tour by ID (for admin view/edit)
router.get("/tours/:id", protect, authorize(["admin"]), async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate('submittedBy', 'userName email')
      .populate('reviews.user', 'userName');
      
    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }
    
    res.json(tour);
  } catch (error) {
    console.error("Error fetching tour details for admin:", error);
    res.status(500).json({ error: "Error fetching tour details" });
  }
});


// Get dashboard statistics
router.get("/dashboard-stats", protect, authorize(["admin"]), async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      destinations: await Destination.countDocuments(),
      vehicles: await Vehicle.countDocuments({ isVerified: true }),
      premiumVehicles: await Vehicle.countDocuments({ isPremium: true }),
      tourGuides: await TourGuide.countDocuments({ isVerified: true }),
      premiumGuides: await TourGuide.countDocuments({ isPremium: true }),
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

// Delete a review (admin only)
router.delete("/reviews/:id", protect, authorize(["admin"]), async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Get the reference to the item that was reviewed
    const { itemId, itemType, rating } = review;
    
    // Find the right model based on itemType
    let Model;
    switch (itemType) {
      case 'blog':
        Model = Blog;  // Use the already imported Blog model
        break;
      case 'tourGuide':
        Model = TourGuide;  // Use the already imported TourGuide model
        break;
      case 'vehicle':
        Model = Vehicle;  // Use the already imported Vehicle model
        break;
      case 'tour':
        Model = Tour;  // Use the already imported Tour model
        break;
      default:
        return res.status(400).json({ error: 'Invalid item type' });
    }
    
    // Find the item and update it without triggering validation
    const item = await Model.findById(itemId);
    if (item) {
      // Calculate new values for the update
      let updatedReviews = [];
      if (Array.isArray(item.reviews)) {
        updatedReviews = item.reviews.filter(r => r.toString() !== reviewId);
      }
      
      let newAvgRating = 0;
      let newTotalReviews = 0;
      
      // Recalculate rating if this item has other reviews
      if ((item.totalReviews || 0) > 1) {
        // Get the total rating without this review
        const totalRatingPoints = (item.averageRating || 0) * (item.totalReviews || 0);
        const newTotalPoints = totalRatingPoints - rating;
        newTotalReviews = (item.totalReviews || 0) - 1;
        newAvgRating = newTotalPoints / newTotalReviews;
      }
      
      // Update the item WITHOUT triggering validation
      await Model.findByIdAndUpdate(itemId, {
        $set: {
          reviews: updatedReviews,
          totalReviews: newTotalReviews,
          averageRating: newAvgRating
        }
      }, { runValidators: false });
    }
    
    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Error deleting review: ' + error.message });
  }
});

// Get all premium vehicles
router.get("/vehicles/premium", protect, authorize(["admin"]), async (req, res) => {
  try {
    const premiumVehicles = await Vehicle.find({
      isPremium: true,
      premiumExpiry: { $gt: new Date() }
    }).sort({ premiumExpiry: 1 }); // Sort by expiry date ascending
    
    res.json(premiumVehicles);
  } catch (error) {
    console.error('Error fetching premium vehicles:', error);
    res.status(500).json({ error: 'Error fetching premium vehicles' });
  }
});

// Update vehicle premium status
router.patch("/vehicles/:id/feature", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    if (!vehicle.isPremium) {
      return res.status(400).json({ error: 'Only premium vehicles can be featured' });
    }
    
    vehicle.featuredStatus = status;
    await vehicle.save();
    
    res.json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle feature status:', error);
    res.status(500).json({ error: 'Error updating feature status' });
  }
});

// Extend vehicle premium subscription
router.post("/vehicles/:id/extend-premium", protect, authorize(["admin"]), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // Add 30 days to current expiry or from today if expired
    const currentExpiry = vehicle.premiumExpiry && vehicle.premiumExpiry > new Date() 
      ? new Date(vehicle.premiumExpiry) 
      : new Date();
    
    currentExpiry.setDate(currentExpiry.getDate() + 30);
    vehicle.premiumExpiry = currentExpiry;
    vehicle.isPremium = true;
    
    await vehicle.save();
    
    res.json(vehicle);
  } catch (error) {
    console.error('Error extending vehicle premium:', error);
    res.status(500).json({ error: 'Error extending premium subscription' });
  }
});

// Cancel vehicle premium subscription
router.delete("/vehicles/:id/premium", protect, authorize(["admin"]), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    vehicle.isPremium = false;
    vehicle.featuredStatus = 'none';
    vehicle.premiumExpiry = null;
    
    await vehicle.save();
    
    res.json({ message: 'Premium subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling vehicle premium:', error);
    res.status(500).json({ error: 'Error cancelling premium subscription' });
  }
});

// Get all payments (admin only)
router.get("/payments", protect, authorize(["admin"]), async (req, res) => {
  try {
    console.log('🔍 Admin requesting payments data...');
    
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    console.log(`📊 Found ${payments.length} payments`);
    console.log('💰 Payment details:', payments.map(p => ({
      id: p._id,
      amount: p.amount,
      status: p.status,
      date: p.createdAt
    })));
    
    res.json(payments);
  } catch (error) {
    console.error('❌ Error fetching payments:', error);
    res.status(500).json({ error: 'Error fetching payments' });
  }
});

// Get all premium tour guides
router.get("/tour-guides/premium", protect, authorize(["admin"]), async (req, res) => {
  try {
    const premiumGuides = await TourGuide.find({
      isPremium: true,
      premiumExpiry: { $gt: new Date() }
    }).sort({ premiumExpiry: 1 });
    
    res.json(premiumGuides);
  } catch (error) {
    console.error('Error fetching premium tour guides:', error);
    res.status(500).json({ error: 'Error fetching premium tour guides' });
  }
});

// Update tour guide featured status
router.patch("/tour-guides/:id/feature", protect, authorize(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const guide = await TourGuide.findById(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ error: 'Tour guide not found' });
    }
    
    if (!guide.isPremium) {
      return res.status(400).json({ error: 'Only premium guides can be featured' });
    }
    
    guide.featuredStatus = status;
    await guide.save();
    
    res.json(guide);
  } catch (error) {
    console.error('Error updating guide feature status:', error);
    res.status(500).json({ error: 'Error updating feature status' });
  }
});

// Extend tour guide premium subscription
router.post("/tour-guides/:id/extend-premium", protect, authorize(["admin"]), async (req, res) => {
  try {
    const guide = await TourGuide.findById(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ error: 'Tour guide not found' });
    }
    
    // Add 30 days to current expiry or from today if expired
    const currentExpiry = guide.premiumExpiry && guide.premiumExpiry > new Date() 
      ? new Date(guide.premiumExpiry) 
      : new Date();
    
    currentExpiry.setDate(currentExpiry.getDate() + 30);
    guide.premiumExpiry = currentExpiry;
    guide.isPremium = true;
    
    await guide.save();
    
    res.json(guide);
  } catch (error) {
    console.error('Error extending guide premium:', error);
    res.status(500).json({ error: 'Error extending premium subscription' });
  }
});

// Cancel tour guide premium subscription
router.delete("/tour-guides/:id/premium", protect, authorize(["admin"]), async (req, res) => {
  try {
    const guide = await TourGuide.findById(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ error: 'Tour guide not found' });
    }
    
    guide.isPremium = false;
    guide.featuredStatus = 'none';
    guide.premiumExpiry = null;
    guide.hadPremiumBefore = true; // Mark that this guide had premium before
    
    await guide.save();
    
    res.json({ message: 'Premium subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling guide premium:', error);
    res.status(500).json({ error: 'Error cancelling premium subscription' });
  }
});

module.exports = router;
