const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

// Initialize a payment
router.post('/initialize', protect, paymentController.initializePayment);

// PayHere notification endpoint
router.post('/notify', paymentController.handleNotification);

// Check payment status
router.get('/status/:orderId', protect, paymentController.checkPaymentStatus);

// Get user's payment history
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

module.exports = router;