const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Error fetching vehicles' });
  }
});

// Submit new vehicle
router.post('/', async (req, res) => {
  try {
    const vehicle = new Vehicle({
      ...req.body,
      status: 'pending',
      isVerified: false,
      submittedAt: new Date()
    });
    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error('Vehicle registration error:', error);
    res.status(400).json({
      error: 'Error registering vehicle',
      details: error.message
    });
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

module.exports = router;