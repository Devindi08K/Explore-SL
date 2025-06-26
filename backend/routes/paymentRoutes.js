const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');
const stripeController = require('../controllers/stripeController');

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

module.exports = router;