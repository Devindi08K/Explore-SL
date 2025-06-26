const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const vehicleService = require('../services/vehicleService');

// Submit an inquiry for a vehicle
router.post('/', async (req, res) => {
  try {
    const { vehicleId, name, email, phone, message, dates } = req.body;
    
    // Create the inquiry
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
    
    // Track inquiry for analytics
    await vehicleService.incrementInquiryCount(vehicleId);
    
    // Send notification if the vehicle is premium
    const vehicle = await Vehicle.findById(vehicleId);
    if (vehicle && vehicle.isPremium) {
      const owner = await User.findById(vehicle.submittedBy);
      
      if (owner && owner.email) {
        // Send notification email
        const transporter = nodemailer.createTransport({
          // Configure your email provider
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        
        await transporter.sendMail({
          from: '"Sri Lanka Tourism" <noreply@srilankatourism.com>',
          to: owner.email,
          subject: `New Booking Request for ${vehicle.vehicleModel}`,
          html: `
            <h2>You have a new booking request!</h2>
            <p>Vehicle: ${vehicle.vehicleModel}</p>
            <p>Customer: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Message: ${message}</p>
            <p>Requested dates: ${dates}</p>
            <p><a href="${process.env.FRONTEND_URL}/profile?tab=inquiries">Respond to this request now</a></p>
          `
        });
      }
    }
    
    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// Get inquiries for owner's vehicles
router.get('/my-inquiries', protect, async (req, res) => {
  try {
    // Find all vehicles owned by user
    const userVehicles = await Vehicle.find({ submittedBy: req.user._id });
    const vehicleIds = userVehicles.map(vehicle => vehicle._id);
    
    // Find inquiries for these vehicles
    const inquiries = await Inquiry.find({
      vehicleId: { $in: vehicleIds }
    }).sort({ createdAt: -1 });
    
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Error fetching inquiries' });
  }
});

// Update inquiry status
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, response } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    
    // Make sure the user owns the vehicle
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
});

module.exports = router;