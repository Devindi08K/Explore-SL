const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect, authorize } = require('../middleware/authMiddleware');
const vehicleService = require('../services/vehicleService');
const Destination = require("../models/Destination");
const VehicleView = require('../models/VehicleView');
const VehicleInquiry = require('../models/VehicleInquiry'); // Import VehicleInquiry model

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all vehicles...');
    const vehicles = await Vehicle.find();
    console.log(`✅ Found ${vehicles.length} vehicles`);
    res.json(vehicles);
  } catch (error) {
    console.error('❌ Error fetching vehicles:', error);
    res.status(500).json({ 
      error: 'Error fetching vehicles',
      details: error.message 
    });
  }
});

// Submit new vehicle
router.post('/', async (req, res) => {
  try {
    console.log('🚗 Starting vehicle registration...');
    console.log('📝 Request body submittedBy:', req.body.submittedBy);
    console.log('📝 Vehicle type received:', req.body.vehicleType); 
    
    // Filter out empty image URLs before creating vehicle
    const filteredImages = req.body.vehicleImages ? 
      req.body.vehicleImages.filter(img => img && img.trim() !== '') : [];
    
    let vehicleData = {
      ...req.body,
      vehicleType: String(req.body.vehicleType), // Explicitly convert to string
      vehicleImages: filteredImages,
      status: 'pending', // Default status for free users
      isVerified: false, // Default verification status
      submittedAt: new Date(),
      isPremium: false,
      maxPhotos: 1 // Default for free accounts
    };
    
    // Check for premium subscription BEFORE creating vehicle
    let hasPremiumSubscription = false;
    if (req.body.submittedBy) {
      const Payment = require('../models/Payment');
      
      const activePremiumPayment = await Payment.findOne({
        userId: req.body.submittedBy,
        serviceType: { $in: ['vehicle_premium_monthly', 'vehicle_premium_yearly'] },
        status: 'completed'
      }).sort({ createdAt: -1 });
      
      if (activePremiumPayment) {
        console.log('🎉 Found premium subscription! Setting vehicle as premium...');
        hasPremiumSubscription = true;
        
        // Calculate premium expiry
        let premiumExpiry;
        if (activePremiumPayment.subscriptionDetails?.endDate) {
          premiumExpiry = new Date(activePremiumPayment.subscriptionDetails.endDate);
        } else {
          premiumExpiry = new Date();
          if (activePremiumPayment.serviceType === 'vehicle_premium_yearly') {
            premiumExpiry.setMonth(premiumExpiry.getMonth() + 14);
          } else {
            premiumExpiry.setMonth(premiumExpiry.getMonth() + 3);
          }
        }
        
        // Update vehicle data for premium - AUTO APPROVE for premium users
        vehicleData = {
          ...vehicleData,
          isPremium: true,
          premiumExpiry: premiumExpiry,
          maxPhotos: 3,
          analyticsEnabled: true,
          bookingNotifications: true,
          featuredStatus: 'homepage',
          viewCount: Math.floor(Math.random() * 20) + 5,
          inquiryCount: Math.floor(Math.random() * 3) + 1,
          status: 'approved', // Auto-approve for premium users
          isVerified: true,   // Auto-verify for premium users
          needsReview: true,  // Flag for admin review even though it's approved
          verifiedAt: new Date()
        };
      }
    }
    
    // Validate image count based on premium status
    if (filteredImages.length === 0) {
      return res.status(400).json({
        error: 'At least one vehicle image is required'
      });
    }
    
    const maxAllowedImages = hasPremiumSubscription ? 3 : 1;
    if (filteredImages.length > maxAllowedImages) {
      return res.status(400).json({
        error: `Maximum ${maxAllowedImages} images allowed. ${hasPremiumSubscription ? 'Premium' : 'Free'} account detected.`
      });
    }
    
    // Make sure vehicleType is included in the data being saved to the database
    const vehicle = new Vehicle({
      ...vehicleData // Use vehicleData which already has the converted vehicleType
    });
    const savedVehicle = await vehicle.save();
    
    console.log('✅ Vehicle saved with ID:', savedVehicle._id);
    console.log('🔍 Vehicle type saved as:', savedVehicle.vehicleType);
    console.log('🔍 Vehicle isPremium:', savedVehicle.isPremium);
    console.log('🔍 Vehicle status:', savedVehicle.status);
    console.log('🔍 Vehicle isVerified:', savedVehicle.isVerified);
    console.log('🔍 Vehicle maxPhotos:', savedVehicle.maxPhotos);
    console.log('🔍 Image count:', savedVehicle.vehicleImages.length);
    
    // Update payment record if premium
    if (hasPremiumSubscription) {
      const Payment = require('../models/Payment');
      const activePremiumPayment = await Payment.findOne({
        userId: req.body.submittedBy,
        serviceType: { $in: ['vehicle_premium_monthly', 'vehicle_premium_yearly'] },
        status: 'completed'
      }).sort({ createdAt: -1 });
      
      if (activePremiumPayment) {
        if (!activePremiumPayment.subscriptionDetails) {
          activePremiumPayment.subscriptionDetails = {};
        }
        if (!activePremiumPayment.subscriptionDetails.vehicleIds) {
          activePremiumPayment.subscriptionDetails.vehicleIds = [];
        }
        activePremiumPayment.subscriptionDetails.vehicleIds.push(savedVehicle._id);
        activePremiumPayment.subscriptionDetails.awaitingVehicleRegistration = false;
        await activePremiumPayment.save();
        
        return res.status(201).json({
          ...savedVehicle.toObject(),
          message: 'Vehicle registered and automatically approved! Your listing is now live.',
          premiumUpgraded: true,
          autoApproved: true
        });
      }
    }
    
    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error('❌ Vehicle registration error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    if (error.code === 11000 && error.keyPattern && error.keyPattern.plateNumber) {
      res.status(400).json({
        error: 'A vehicle with this plate number is already registered',
        details: 'Please check if you have already registered this vehicle or use a different plate number'
      });
    } else {
      res.status(400).json({
        error: 'Error registering vehicle',
        details: error.message
      });
    }
  }
});

// Get pending vehicles
router.get('/pending', protect, authorize(['admin']), async (req, res) => {
  try {
    const pendingVehicles = await Vehicle.find({ status: 'pending' });
    res.json(pendingVehicles);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending vehicles' });
  }
});

// Get vehicle submissions for current user
router.get('/my-submissions', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ 
      submittedBy: req.user._id 
    }).sort({ submittedAt: -1 });
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching user vehicles:', error);
    res.status(500).json({ error: 'Error fetching vehicles' });
  }
});

// Get user's vehicle submissions
router.get('/user', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching user vehicles:', error);
    res.status(500).json({ error: 'Error fetching vehicle submissions' });
  }
});

// Update vehicle status
router.patch('/:id/verify', protect, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        status,
        isVerified: status === 'approved',
        verifiedAt: new Date(),
        verifiedBy: req.user._id
      },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: 'Error updating vehicle status' });
  }
});

// Get premium vehicles for homepage feature
router.get('/featured/homepage', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      isPremium: true,
      featuredStatus: 'homepage',
      isVerified: true
    }).limit(6); // Limit to 6 featured vehicles
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching featured vehicles' });
  }
});

// Get premium vehicles for a specific destination
router.get('/featured/destination/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;

    // Fetch the destination to get its district
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    // Clean up the district name for matching (trim, normalize case)
    const districtName = destination.district ? 
      destination.district.trim() : '';
    
    // Log the exact district name for debugging
    console.log(`Raw district name from database: "${destination.district}"`);
    
    // Map the district to its province with more flexible matching
    const districtToProvinceMap = {
      'colombo': 'Western Province',
      'gampaha': 'Western Province',
      'kalutara': 'Western Province',
      'kandy': 'Central Province',
      'matale': 'Central Province',
      'nuwara eliya': 'Central Province',
      'galle': 'Southern Province',
      'matara': 'Southern Province',
      'hambantota': 'Southern Province',
      'jaffna': 'Northern Province',
      'kilinochchi': 'Northern Province',
      'mannar': 'Northern Province',
      'vavuniya': 'Northern Province',
      'mullaitivu': 'Northern Province',
      'batticaloa': 'Eastern Province',
      'ampara': 'Eastern Province',
      'trincomalee': 'Eastern Province',
      'kurunegala': 'North Western Province',
      'puttalam': 'North Western Province',
      'anuradhapura': 'North Central Province',
      'polonnaruwa': 'North Central Province',
      'badulla': 'Uva Province',
      'monaragala': 'Uva Province',
      'ratnapura': 'Sabaragamuwa Province',
      'kegalle': 'Sabaragamuwa Province'
    };
    
    // Use case-insensitive matching
    const lowercaseDistrict = districtName.toLowerCase();
    const province = districtToProvinceMap[lowercaseDistrict] || '';
    
    console.log(`Matching vehicles for destination: ${destination.name}, district: "${districtName}", normalized: "${lowercaseDistrict}", mapped province: "${province}"`);

    // If province is empty, try to find a partial match
    let matchedProvince = province;
    if (!province) {
      // Try to find a partial match
      const possibleMatch = Object.keys(districtToProvinceMap).find(key => 
        lowercaseDistrict.includes(key) || key.includes(lowercaseDistrict)
      );
      
      if (possibleMatch) {
        matchedProvince = districtToProvinceMap[possibleMatch];
        console.log(`No exact match found. Using partial match: "${possibleMatch}" -> "${matchedProvince}"`);
      }
    }

    // Match vehicles that serve this province
    let vehicles = await Vehicle.find({
      isPremium: true,
      isVerified: true,
      servingAreas: matchedProvince
    }).limit(4);

    console.log(`Found ${vehicles.length} vehicles serving "${matchedProvince}"`);
    
    // Also try searching with just the district name if province matching fails
    if (vehicles.length === 0 && destination.district) {
      console.log(`Trying to match vehicles directly with district: "${destination.district}"`);
      vehicles = await Vehicle.find({
        isPremium: true,
        isVerified: true,
        servingAreas: destination.district
      }).limit(4);
      
      console.log(`Found ${vehicles.length} vehicles serving district "${destination.district}"`);
    }
    
    // Return the results, we won't fall back to general premium vehicles anymore
    // Instead, we'll include metadata indicating we found no matches
    res.json({
      vehicles: vehicles,
      meta: {
        destinationName: destination.name,
        districtName: destination.district,
        provinceName: matchedProvince,
        hasMatches: vehicles.length > 0,
        matchType: vehicles.length > 0 ? 
          (vehicles[0].servingAreas.includes(matchedProvince) ? 'province' : 'district') : 
          'none'
      }
    });
  } catch (error) {
    console.error('Error fetching destination vehicles:', error);
    res.status(500).json({ error: 'Error fetching destination vehicles' });
  }
});

// Get analytics for a vehicle (premium only)
router.get('/:id/analytics', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      submittedBy: req.user._id
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // For testing purposes, you could temporarily remove this check
    // to ensure the analytics component displays
    /*
    if (!vehicle.isPremium) {
      return res.status(403).json({ error: 'Premium subscription required for analytics' });
    }
    */
    
    res.json({
      viewCount: vehicle.viewCount || 0,
      inquiryCount: vehicle.inquiryCount || 0,
      // Add more analytics data as needed
    });
  } catch (error) {
    console.error('Error fetching vehicle analytics:', error);
    res.status(500).json({ error: 'Error fetching vehicle analytics' });
  }
});

// Get vehicle availability calendar
router.get('/:id/availability', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      submittedBy: req.user._id
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // For testing, temporarily allow all vehicles to have a calendar
    /*
    if (!vehicle.isPremium) {
      return res.status(403).json({ error: 'Premium subscription required for availability calendar' });
    }
    */
    
    const calendar = vehicle.availabilityCalendar 
      ? Object.fromEntries(vehicle.availabilityCalendar) 
      : {};
      
    res.json({
      calendar
    });
  } catch (error) {
    console.error('Error fetching vehicle availability:', error);
    res.status(500).json({ error: 'Error fetching vehicle availability' });
  }
});

// Update vehicle availability (premium only)
router.post('/:id/availability', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      submittedBy: req.user._id
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    if (!vehicle.isPremium) {
      return res.status(403).json({ error: 'Premium subscription required for availability calendar' });
    }
    
    const { dateKey, status } = req.body; // Format: "YYYY-MM-DD"
    
    const updatedVehicle = await vehicleService.updateAvailabilityCalendar(
      req.params.id, 
      dateKey, 
      status
    );
    
    res.json({
      message: 'Availability updated successfully',
      calendar: Object.fromEntries(updatedVehicle.availabilityCalendar)
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error updating vehicle availability' });
  }
});

// Track vehicle view with session/user tracking to prevent duplicate counts
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    const userId = req.user?._id;
    
    // Check if we have a unique identifier
    if (!sessionId && !userId) {
      // If no way to track, just increment the view
      await Vehicle.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
      return res.status(200).send();
    }
    
    // Check for recent view from same user/session (last 4 hours)
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);
    
    const recentView = await VehicleView.findOne({
      vehicleId: id,
      $or: [
        { userId: userId || null },
        { sessionId: sessionId || null }
      ],
      viewedAt: { $gt: fourHoursAgo }
    });
    
    if (!recentView) {
      // No recent view found, increment the counter
      await Vehicle.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
      
      // Record this view
      await new VehicleView({
        vehicleId: id,
        userId: userId || null,
        sessionId: sessionId || null,
        viewedAt: new Date()
      }).save();
    }
    
    res.status(200).send();
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).send();
  }
});

// Track vehicle inquiry
router.post('/:id/inquiry', async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    const userId = req.user?._id;
    
    // Increment inquiry count
    await Vehicle.findByIdAndUpdate(id, { $inc: { inquiryCount: 1 } });
    
    // Optional: Record inquiry details for more advanced analytics
    await new VehicleInquiry({
      vehicleId: id,
      userId: userId || null,
      sessionId: sessionId || null,
      inquiryType: req.body.inquiryType || 'general',
      contactDetails: req.body.contactDetails || {}
    }).save();
    
    res.status(200).send();
  } catch (error) {
    console.error('Error tracking inquiry:', error);
    res.status(500).send();
  }
});

// Check premium status for user's vehicles - FULL IMPLEMENTATION
router.get('/my-premium-status', protect, async (req, res) => {
  try {
    const Payment = require('../models/Payment');
    const activePremiumPayment = await Payment.findOne({
      userId: req.user._id,
      serviceType: { $in: ['vehicle_premium_monthly', 'vehicle_premium_yearly'] },
      status: 'completed'
    }).sort({ createdAt: -1 });

    let activePlanType = null;
    if (activePremiumPayment) {
      if (activePremiumPayment.serviceType === 'vehicle_premium_yearly') {
        activePlanType = 'yearly';
      } else if (activePremiumPayment.serviceType === 'vehicle_premium_monthly') {
        activePlanType = 'monthly';
      }
    }

    res.json({
      hasActivePremiumSubscription: !!activePremiumPayment,
      activePlanType, // 'monthly', 'yearly', or null
      maxImages: !!activePremiumPayment ? 3 : 1,
      premiumExpiry: activePremiumPayment?.subscriptionDetails?.endDate || null
    });
  } catch (error) {
    res.json({
      hasActivePremiumSubscription: false,
      activePlanType: null,
      maxImages: 1,
      premiumExpiry: null
    });
  }
});

// Force refresh premium features (for testing)
router.post('/refresh-premium/:vehicleId', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.vehicleId,
      submittedBy: req.user._id
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // Check if user has any active premium payments
    const Payment = require('../models/Payment');
    const activePremiumPayment = await Payment.findOne({
      userId: req.user._id,
      serviceType: { $in: ['vehicle_premium_monthly', 'vehicle_premium_yearly'] },
      status: 'completed',
      'subscriptionDetails.isActive': true
    });
    
    if (activePremiumPayment) {
      // Ensure premium features are active
      vehicle.isPremium = true;
      vehicle.premiumExpiry = activePremiumPayment.subscriptionDetails.endDate;
      vehicle.maxPhotos = 10;
      vehicle.analyticsEnabled = true;
      vehicle.bookingNotifications = true;
      
      await vehicle.save();
      
      res.json({
        message: 'Premium features refreshed',
        vehicle: {
          id: vehicle._id,
          model: vehicle.vehicleModel,
          isPremium: vehicle.isPremium,
          premiumExpiry: vehicle.premiumExpiry
        }
      });
    } else {
      res.status(400).json({ error: 'No active premium subscription found' });
    }
    
  } catch (error) {
    console.error('Error refreshing premium features:', error);
    res.status(500).json({ error: 'Error refreshing premium features' });
  }
});

// Check if user has vehicles and their premium status
router.get('/my-status', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ submittedBy: req.user._id });
    
    // Also check for active premium payments
    const Payment = require('../models/Payment');
    const activePremiumPayment = await Payment.findOne({
      userId: req.user._id,
      serviceType: { $in: ['vehicle_premium_monthly', 'vehicle_premium_yearly'] },
      status: 'completed',
      'subscriptionDetails.isActive': true
    });

    const response = {
      hasVehicles: vehicles.length > 0,
      totalVehicles: vehicles.length,
      premiumVehicles: vehicles.filter(v => v.isPremium).length,
      hasActivePremiumSubscription: !!activePremiumPayment,
      vehicles: vehicles.map(v => ({
        id: v._id,
        model: v.vehicleModel,
        isPremium: v.isPremium,
        premiumExpiry: v.premiumExpiry,
        featuredStatus: v.featuredStatus,
        analyticsEnabled: v.analyticsEnabled,
        maxPhotos: v.maxPhotos,
        viewCount: v.viewCount || 0,
        inquiryCount: v.inquiryCount || 0
      }))
    };

    console.log('Vehicle status check for user:', req.user._id);
    console.log('Response:', response);

    res.json(response);
  } catch (error) {
    console.error('Error checking vehicle status:', error);
    res.status(500).json({ error: 'Error checking vehicle status' });
  }
});

// Get single vehicle by ID (place this AFTER other specific routes)
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching vehicle details' });
  }
});

// Update vehicle
router.put('/:id', protect, authorize(['admin']), async (req, res) => {
  try {
    console.log('🔄 Updating vehicle with ID:', req.params.id);
    console.log('📝 Update data:', req.body);
    
    // Make sure vehicleType is included in the update
    const updateData = {
      ...req.body,
      vehicleType: req.body.vehicleType, // Ensure this is explicitly included
    };
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    console.log('✅ Vehicle updated successfully with type:', vehicle.vehicleType);
    res.json(vehicle);
  } catch (error) {
    console.error('❌ Error updating vehicle:', error);
    res.status(500).json({ error: 'Error updating vehicle' });
  }
});

// Update vehicle by owner
router.put('/owner/:id', protect, async (req, res) => {
  try {
    console.log('🔄 Owner updating vehicle with ID:', req.params.id);
    
    // Find the vehicle and make sure it belongs to the current user
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      submittedBy: req.user._id
    });
    
    if (!vehicle) {
      return res.status(404).json({ 
        error: 'Vehicle not found or you do not have permission to update it'
      });
    }
    
    // Filter out empty image URLs
    const filteredImages = req.body.vehicleImages ? 
      req.body.vehicleImages.filter(img => img && img.trim() !== '') : [];
      
    const maxAllowedImages = vehicle.isPremium ? 3 : 1;
    if (filteredImages.length > maxAllowedImages) {
      return res.status(400).json({
        error: `Maximum ${maxAllowedImages} images allowed for ${vehicle.isPremium ? 'premium' : 'free'} accounts.`
      });
    }
    
    if (filteredImages.length === 0) {
      return res.status(400).json({
        error: 'At least one vehicle image is required'
      });
    }

    // Don't allow changing the plate number
    if (req.body.plateNumber && req.body.plateNumber !== vehicle.plateNumber) {
      return res.status(400).json({
        error: 'Vehicle plate number cannot be changed'
      });
    }
    
    // Create update data
    const updateData = {
      ...req.body,
      vehicleType: vehicle.vehicleType, // Don't allow changing vehicle type
      plateNumber: vehicle.plateNumber, // Don't allow changing plate number
      vehicleImages: filteredImages,
      isPremium: vehicle.isPremium, // Preserve premium status
      premiumExpiry: vehicle.premiumExpiry,
      maxPhotos: vehicle.maxPhotos,
      isVerified: vehicle.isVerified, // Preserve verification status
      status: vehicle.status, // Preserve approval status
      submittedBy: req.user._id,
      needsReview: true // Flag that this vehicle needs review again
    };
    
    // Update the vehicle
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    console.log('✅ Vehicle updated successfully by owner');
    res.json(updatedVehicle);
  } catch (error) {
    console.error('❌ Error updating vehicle:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    res.status(500).json({ 
      error: 'Error updating vehicle',
      details: error.message 
    });
  }
});

// Get vehicles that need review (auto-approved premium vehicles)
router.get('/needs-review', protect, authorize(['admin']), async (req, res) => {
  try {
    const vehiclesNeedingReview = await Vehicle.find({ 
      needsReview: true,
      isVerified: true // These are already approved but need review
    });
    res.json(vehiclesNeedingReview);
  } catch (error) {
    console.error('Error fetching vehicles needing review:', error);
    res.status(500).json({ error: 'Error fetching vehicles needing review' });
  }
});

// Mark a vehicle as reviewed by admin
router.patch('/:id/reviewed', protect, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        needsReview: false,
        reviewedBy: req.user._id,
        reviewedAt: new Date()
      },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: 'Error marking vehicle as reviewed' });
  }
});

module.exports = router;