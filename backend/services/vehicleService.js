const Vehicle = require('../models/Vehicle');

// Update vehicle premium status
exports.updatePremiumStatus = async (vehicleId, isPremium, expiryDate) => {
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    
    vehicle.isPremium = isPremium;
    vehicle.premiumExpiry = expiryDate;
    
    // If becoming premium, update premium features
    if (isPremium) {
      vehicle.maxPhotos = 10;
      vehicle.analyticsEnabled = true;
      vehicle.bookingNotifications = true;
    } else {
      // Reset to free tier if premium expires
      vehicle.maxPhotos = 3;
      vehicle.analyticsEnabled = false;
      vehicle.bookingNotifications = false;
      vehicle.featuredStatus = 'none';
    }
    
    await vehicle.save();
    return vehicle;
  } catch (error) {
    throw error;
  }
};

// Track vehicle views for analytics
exports.incrementViewCount = async (vehicleId) => {
  try {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      $inc: { viewCount: 1 }
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
};

// Track inquiry count for analytics
exports.incrementInquiryCount = async (vehicleId) => {
  try {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      $inc: { inquiryCount: 1 }
    });
  } catch (error) {
    console.error('Error incrementing inquiry count:', error);
  }
};

// Update vehicle availability calendar
exports.updateAvailabilityCalendar = async (vehicleId, dateKey, status) => {
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    
    // Only allow premium vehicles to use the calendar
    if (!vehicle.isPremium) {
      throw new Error('Premium subscription required to use availability calendar');
    }
    
    if (!vehicle.availabilityCalendar) {
      vehicle.availabilityCalendar = new Map();
    }
    
    vehicle.availabilityCalendar.set(dateKey, status);
    await vehicle.save();
    return vehicle;
  } catch (error) {
    throw error;
  }
};