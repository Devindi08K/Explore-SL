const Payment = require('../models/Payment');
const { processSuccessfulPayment } = require('./payhereController');
const Vehicle = require('../models/Vehicle');
const TourGuide = require('../models/TourGuide');

// Get all payments for current user
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};

// Create a new payment (direct payment, not through PayHere)
exports.createPayment = async (req, res) => {
  try {
    const { serviceType, amount, description, itemId, customerName, customerEmail, customerPhone } = req.body;
    
    const orderId = `SLX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    const payment = new Payment({
      userId: req.user._id,
      amount,
      currency: 'LKR',
      orderId,
      serviceType,
      description,
      status: 'pending',
      paymentMethod: 'manual',
      itemId: itemId || null,
      customerDetails: {
        name: customerName || req.user.userName,
        email: customerEmail || req.user.email,
        phone: customerPhone || ''
      }
    });
    
    await payment.save();
    
    res.json({ 
      message: 'Payment created successfully', 
      payment,
      orderId
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Check if payment belongs to user or user is admin
    if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this payment' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
};

// Process payment completion (manually)
exports.completePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { paymentMethod, transactionId } = req.body;
    
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Only admin can manually complete payments
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    payment.status = 'completed';
    payment.paymentMethod = paymentMethod || 'manual';
    payment.paymentId = transactionId || '';
    payment.updatedAt = new Date();
    
    await payment.save();
    
    // Process the successful payment
    await processSuccessfulPayment(payment);
    
    res.json({
      message: 'Payment completed successfully',
      payment
    });
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ error: 'Failed to complete payment' });
  }
};

// For testing: Make a vehicle premium
exports.makePremiumForTesting = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // Make premium for 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    vehicle.isPremium = true;
    vehicle.premiumExpiry = expiryDate;
    vehicle.maxPhotos = 3;
    vehicle.analyticsEnabled = true;
    vehicle.bookingNotifications = true;
    
    // Add some test availability data
    if (!vehicle.availabilityCalendar) {
      vehicle.availabilityCalendar = new Map();
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    vehicle.availabilityCalendar.set(tomorrow.toISOString().split('T')[0], 'available');
    vehicle.availabilityCalendar.set(dayAfter.toISOString().split('T')[0], 'booked');
    
    await vehicle.save();
    
    res.json({
      message: 'Vehicle made premium for testing',
      vehicle
    });
  } catch (error) {
    console.error('Error making vehicle premium:', error);
    res.status(500).json({ error: 'Error making vehicle premium' });
  }
};

// Test endpoint to manually complete a payment
exports.testCompletePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log('🧪 Manual payment completion for orderId:', orderId);
    
    const payment = await Payment.findOne({ orderId });
    
    if (!payment) {
      console.error('❌ Payment not found:', orderId);
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    if (payment.status === 'completed') {
      console.log('✅ Payment already completed:', orderId);
      return res.json({
        message: 'Payment already completed',
        payment
      });
    }
    
    // Update payment status
    payment.status = 'completed';
    payment.paymentMethod = 'manual_test';
    payment.paymentId = `test_${Date.now()}`;
    payment.updatedAt = new Date();
    
    await payment.save();
    console.log('✅ Payment status updated to completed');
    
    // Process the successful payment
    const { processSuccessfulPayment } = require('./payhereController');
    await processSuccessfulPayment(payment);
    
    console.log('✅ Manual payment completion successful');
    
    res.json({
      message: 'Payment manually completed for testing',
      payment
    });
  } catch (error) {
    console.error('❌ Error completing payment:', error);
    res.status(500).json({ error: 'Failed to complete payment: ' + error.message });
  }
};

// Add this function to handle immediate premium activation
exports.activatePremiumFeatures = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all vehicles for this user
    const vehicles = await Vehicle.find({ submittedBy: userId });
    
    if (vehicles.length === 0) {
      return res.status(404).json({ error: 'No vehicles found for this user' });
    }
    
    // Set premium expiry (30 days)
    const premiumExpiry = new Date();
    premiumExpiry.setDate(premiumExpiry.getDate() + 30);
    
    // Update all vehicles to premium
    const updatePromises = vehicles.map(async (vehicle) => {
      vehicle.isPremium = true;
      vehicle.premiumExpiry = premiumExpiry;
      vehicle.maxPhotos = 10;
      vehicle.analyticsEnabled = true;
      vehicle.bookingNotifications = true;
      vehicle.featuredStatus = 'homepage';
      
      // Add some analytics data for demonstration
      if (vehicle.viewCount === 0) {
        vehicle.viewCount = Math.floor(Math.random() * 50) + 10;
      }
      if (vehicle.inquiryCount === 0) {
        vehicle.inquiryCount = Math.floor(Math.random() * 5) + 1;
      }
      
      return vehicle.save();
    });
    
    await Promise.all(updatePromises);
    
    res.json({
      message: `Successfully activated premium features for ${vehicles.length} vehicle(s)`,
      vehicles: vehicles.map(v => ({
        id: v._id,
        model: v.vehicleModel,
        isPremium: v.isPremium,
        premiumExpiry: v.premiumExpiry,
        maxPhotos: v.maxPhotos,
        analyticsEnabled: v.analyticsEnabled
      }))
    });
    
  } catch (error) {
    console.error('Error activating premium features:', error);
    res.status(500).json({ error: 'Failed to activate premium features' });
  }
};