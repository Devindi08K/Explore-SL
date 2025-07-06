const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const UserRequest = require('../models/UserRequest');

// Submit an edit or removal request
router.post('/edit', protect, async (req, res) => {
  try {
    const { itemType, itemId, requestText, requestType } = req.body;
    const userId = req.user._id;
    
    // Validate input
    if (!itemType || !itemId || !requestText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create request
    const newRequest = new UserRequest({
      userId,
      itemType,
      itemId,
      requestText,
      requestType: requestType || 'edit',
      status: 'pending'
    });
    
    await newRequest.save();
    
    // Notify admin (in a real app, you'd send an email or create a notification)
    console.log(`New ${requestType} request received for ${itemType} (${itemId})`);
    
    res.status(201).json({ success: true, message: 'Request submitted successfully' });
  } catch (error) {
    console.error('Error submitting user request:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// Get user's requests
router.get('/my-requests', protect, async (req, res) => {
  try {
    const requests = await UserRequest.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Add a route to get all user requests (for admin)
router.get('/all', protect, authorize(['admin']), async (req, res) => {
  try {
    const requests = await UserRequest.find()
      .populate('userId', 'userName email')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Add route to update request status
router.patch('/:id/status', protect, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;
    
    const request = await UserRequest.findByIdAndUpdate(
      id,
      {
        status,
        adminResponse,
        respondedBy: req.user._id,
        respondedAt: new Date()
      },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ error: 'Failed to update request status' });
  }
});

// Add this route to mark a request as viewed
router.patch('/:id/viewed', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await UserRequest.findOne({ 
      _id: id,
      userId: req.user._id
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    request.viewed = true;
    await request.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking request as viewed:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

module.exports = router;