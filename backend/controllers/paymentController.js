const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const AffiliateLink = require('../models/affiliateLink');
const Blog = require('../models/blog');
const Tour = require('../models/Tour');

// Store these values in .env file
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1219735';  // Replace with your merchant ID
const PAYHERE_SECRET = process.env.PAYHERE_SECRET || 'XXXXXXXXXXXXX';     // Replace with your secret
const PAYHERE_RETURN_URL = process.env.FRONTEND_URL + '/payment/success';
const PAYHERE_CANCEL_URL = process.env.FRONTEND_URL + '/payment/cancel';
const PAYHERE_NOTIFY_URL = process.env.BACKEND_URL + '/api/payments/notify';

// Initialize payment
exports.initializePayment = async (req, res) => {
  try {
    const { serviceType, amount, description, itemId, customerName, customerEmail, customerPhone } = req.body;
    
    // Create a unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Generate hash for PayHere
    const hashedSecret = crypto.createHash('md5').update(PAYHERE_SECRET).digest('hex');
    const hash = crypto.createHash('md5')
      .update(`${PAYHERE_MERCHANT_ID}${orderId}${amount}LKR${hashedSecret}`)
      .digest('hex');
    
    // Create payment record in database
    const payment = new Payment({
      userId: req.user._id,
      amount,
      description,
      serviceType,
      orderId,
      itemId: itemId || null,
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      }
    });
    
    await payment.save();
    
    // Return payment info for frontend
    return res.json({
      merchantId: PAYHERE_MERCHANT_ID,
      orderId: orderId,
      amount: amount,
      currency: 'LKR',
      hash: hash,
      returnUrl: PAYHERE_RETURN_URL,
      cancelUrl: PAYHERE_CANCEL_URL,
      notifyUrl: PAYHERE_NOTIFY_URL,
      customerName,
      customerEmail,
      customerPhone
    });
  } catch (error) {
    console.error('Error initializing payment:', error);
    return res.status(500).json({ error: 'Failed to initialize payment' });
  }
};

// Handle PayHere notification
exports.handleNotification = async (req, res) => {
  try {
    const { order_id, payment_id, payhere_amount, status_code, method } = req.body;
    
    // Find the payment by orderId
    const payment = await Payment.findOne({ orderId: order_id });
    
    if (!payment) {
      return res.status(404).send('Payment not found');
    }
    
    // Update payment status
    payment.status = status_code === '2' ? 'completed' : 'failed';
    payment.paymentId = payment_id;
    payment.paymentMethod = method;
    payment.updatedAt = Date.now();
    
    await payment.save();
    
    // If payment is successful, process the purchase
    if (status_code === '2') {
      await processSuccessfulPayment(payment);
    }
    
    // PayHere expects an empty response with status 200
    res.status(200).send();
  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).send('Error processing payment notification');
  }
};

// Check payment status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ orderId });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    return res.json({
      status: payment.status,
      orderId: payment.orderId,
      amount: payment.amount,
      serviceType: payment.serviceType,
      description: payment.description,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return res.status(500).json({ error: 'Failed to check payment status' });
  }
};

// Process successful payment
const processSuccessfulPayment = async (payment) => {
  try {
    const { serviceType, itemId, userId, amount } = payment;
    
    switch (serviceType) {
      case 'business_listing':
        // Set a 30-day premium subscription for business listing
        const listing = await AffiliateLink.findById(itemId);
        if (listing) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(startDate.getDate() + 30); // 30 days subscription
          
          payment.subscriptionDetails = {
            startDate,
            endDate,
            isActive: true,
            plan: 'premium'
          };
          
          // Update listing to premium
          listing.listingType = 'affiliate';
          listing.isPremium = true;
          listing.premiumExpiry = endDate;
          
          await listing.save();
        }
        break;
        
      case 'blog_post':
        // Process blog post sponsorship
        const blog = await Blog.findById(itemId);
        if (blog) {
          blog.isSponsored = true;
          blog.sponsorshipDate = new Date();
          await blog.save();
        }
        break;
        
      case 'tour_partner':
        // Process tour operator subscription
        const tour = await Tour.findById(itemId);
        if (tour) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(startDate.getDate() + 30);
          
          payment.subscriptionDetails = {
            startDate,
            endDate,
            isActive: true,
            plan: 'premium'
          };
          
          tour.isPremium = true;
          tour.premiumExpiry = endDate;
          await tour.save();
        }
        break;
    }
    
    // Update payment with subscription details
    await payment.save();
    
  } catch (error) {
    console.error('Error processing successful payment:', error);
    throw error;
  }
};