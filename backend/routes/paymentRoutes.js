const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');
const stripeController = require('../controllers/stripeController');
const Payment = require('../models/Payment'); // Add this import

// Regular payment routes
router.get('/user', protect, paymentController.getUserPayments);
router.post('/', protect, paymentController.createPayment);
router.get('/:id', protect, paymentController.getPaymentById);
router.patch('/:paymentId/complete', protect, authorize(['admin']), paymentController.completePayment);

// Test routes (only for development)
router.post('/test/make-premium/:vehicleId', protect, paymentController.makePremiumForTesting);
router.post('/test/complete/:orderId', protect, paymentController.testCompletePayment);

// Stripe specific routes
router.post('/stripe/create-checkout', protect, stripeController.createStripeCheckout);
router.get('/stripe/status/:orderId', stripeController.checkPaymentStatus);

// Check for an unused payment voucher for a specific service
router.get('/check-voucher/:serviceType', protect, async (req, res) => {
  try {
    const { serviceType } = req.params;
    const payment = await Payment.findOne({
      userId: req.user._id,
      serviceType: serviceType,
      status: 'completed',
      'subscriptionDetails.awaitingSubmission': true
    });

    if (payment) {
      res.json({ hasVoucher: true, paymentId: payment._id });
    } else {
      res.json({ hasVoucher: false });
    }
  } catch (error) {
    console.error('Error checking payment voucher:', error);
    res.status(500).json({ error: 'Server error while checking voucher' });
  }
});

module.exports = router;