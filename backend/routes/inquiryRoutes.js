const express = require('express');
const router = express.Router();
// const Inquiry = require('../models/Inquiry');
// const Vehicle = require('../models/Vehicle');
// const User = require('../models/User');
// const sendEmail = require('../utils/emailTransporter');
// const { protect } = require('../middleware/authMiddleware'); // Assuming you have this middleware

// Submit an inquiry for a vehicle
router.post('/', async (req, res) => {
  // Temporarily disabled
  res.status(503).json({ message: "This feature is temporarily unavailable." });
  /*
  try {
    const { vehicleId, name, email, phone, message, dates } = req.body;
    
    const inquiry = new Inquiry({
      vehicleId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      message,
      requestedDates: dates,
      status: 'pending',
      createdAt: new Date()
    });
    
    await inquiry.save();
    
    const vehicle = await Vehicle.findById(vehicleId);
    if (vehicle && vehicle.isPremium) {
      const owner = await User.findById(vehicle.submittedBy);
      
      if (owner && owner.email) {
        await sendEmail({
          to: owner.email,
          subject: `New Booking Request for ${vehicle.vehicleModel}`,
          html: `...` // Email HTML
        });
      }
    }
    res.status(201).json(inquiry);
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
  */
});

// Get inquiries for owner's vehicles
router.get('/my-inquiries', /* protect, */ async (req, res) => {
  // Temporarily disabled
  res.json([]);
  /*
  try {
    const userVehicles = await Vehicle.find({ submittedBy: req.user._id });
    const vehicleIds = userVehicles.map(vehicle => vehicle._id);
    
    const inquiries = await Inquiry.find({
      vehicleId: { $in: vehicleIds }
    }).sort({ createdAt: -1 });
    
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Error fetching inquiries' });
  }
  */
});

// Update inquiry status
router.patch('/:id', /* protect, */ async (req, res) => {
  // Temporarily disabled
  res.status(503).json({ message: "This feature is temporarily unavailable." });
  /*
  try {
    const { status, response } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    
    const vehicle = await Vehicle.findOne({
      _id: inquiry.vehicleId,
      submittedBy: req.user._id
    });
    
    if (!vehicle) {
      return res.status(403).json({ error: 'Not authorized to update this inquiry' });
    }
    
    inquiry.status = status;
    if (response) {
      inquiry.ownerResponse = response;
    }
    inquiry.updatedAt = new Date();
    
    await inquiry.save();
    
    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ error: 'Error updating inquiry' });
  }
  */
});

module.exports = router;