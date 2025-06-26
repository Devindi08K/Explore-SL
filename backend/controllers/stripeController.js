const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const AffiliateLink = require('../models/affiliateLink');
const Blog = require('../models/blog');
const Tour = require('../models/Tour');
const TourGuide = require('../models/TourGuide');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// Store these values in .env file
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Create Stripe checkout session
exports.createStripeCheckout = async (req, res) => {
  try {
    const { serviceType, amount, description, itemId, customerName, customerEmail, customerPhone } = req.body;
    
    console.log('💳 Creating Stripe checkout for:', { serviceType, amount, description });
    
    // Create a unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Check for existing active subscription for vehicle premium
    if (serviceType === 'vehicle_premium_monthly' || serviceType === 'vehicle_premium_yearly') {
      const existing = await Payment.findOne({
        userId: req.user._id,
        serviceType,
        status: 'completed',
        'subscriptionDetails.isActive': true
      });

      if (existing) {
        return res.status(400).json({
          error: `You already have an active ${serviceType === 'vehicle_premium_yearly' ? 'yearly' : 'monthly'} vehicle premium subscription.`
        });
      }
    }
    
    // Create payment record in database
    const payment = new Payment({
      userId: req.user._id,
      amount,
      description,
      serviceType,
      orderId,
      itemId: itemId || null,
      customerDetails: {
        name: customerName || req.user.userName,
        email: customerEmail || req.user.email,
        phone: customerPhone || ''
      },
      status: 'pending'
    });
    
    await payment.save();
    console.log('✅ Payment record created:', orderId);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr',
            product_data: {
              name: description,
            },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${FRONTEND_URL}/payment/cancel`,
      client_reference_id: orderId,
      customer_email: customerEmail || req.user.email,
      metadata: {
        orderId: orderId,
        serviceType: serviceType,
        userId: req.user._id.toString(),
        itemId: itemId || ''
      }
    });
    
    console.log('✅ Stripe checkout session created:', session.id);
    return res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error creating Stripe checkout:', error);
    return res.status(500).json({ error: 'Failed to initialize payment' });
  }
};

// Handle Stripe webhook with improved logging
exports.handleStripeWebhook = async (req, res) => {
  console.log('🔔 Stripe webhook received!');
  
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    console.log('✅ Webhook signature verified. Event type:', event.type);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    console.log('💳 Processing checkout.session.completed event');
    const session = event.data.object;
    
    console.log('📊 Session metadata:', session.metadata);
    
    const { orderId, serviceType, userId, itemId } = session.metadata;
    
    try {
      // Find the payment by orderId
      const payment = await Payment.findOne({ orderId });
      
      if (!payment) {
        console.error('❌ Payment not found for orderId:', orderId);
        return res.status(404).send('Payment not found');
      }
      
      console.log('📝 Found payment, updating status...');
      
      // Update payment status
      payment.status = 'completed';
      payment.paymentId = session.payment_intent;
      payment.paymentMethod = 'stripe';
      payment.updatedAt = new Date();
      
      await payment.save();
      console.log('✅ Payment status updated to completed');
      
      // Process the successful payment
      await processSuccessfulPayment(payment);
      console.log('✅ Payment processing completed');
      
      // Return a 200 response
      return res.status(200).send({ received: true });
    } catch (error) {
      console.error('❌ Error processing Stripe webhook:', error);
      return res.status(500).send('Error processing Stripe webhook');
    }
  } else {
    console.log('ℹ️ Received event type:', event.type, '- not handling');
  }
  
  // Return a 200 response for other events
  return res.status(200).send({ received: true });
};

// Check payment status by orderId
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
    console.log('🔄 Processing successful payment for service:', payment.serviceType);
    
    const { serviceType, itemId, userId } = payment;
    
    switch (serviceType) {
      case 'business_listing':
        const listing = await AffiliateLink.findById(itemId);
        if (listing) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(startDate.getDate() + 30);
          
          payment.subscriptionDetails = {
            startDate,
            endDate,
            isActive: true,
            plan: 'premium'
          };
          
          listing.listingType = 'affiliate';
          listing.isPremium = true;
          listing.premiumExpiry = endDate;
          
          await listing.save();
          await payment.save();
          console.log('✅ Business listing upgraded to premium');
        }
        break;
        
      case 'blog_post':
        const blog = await Blog.findById(itemId);
        if (blog) {
          blog.isSponsored = true;
          blog.sponsorshipDate = new Date();
          await blog.save();
          await payment.save();
          console.log('✅ Blog post sponsored');
        }
        break;
        
      case 'tour_partner':
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
          await payment.save();
          console.log('✅ Tour made premium');
        }
        break;
        
      case 'guide_premium_monthly':
      case 'guide_premium_yearly': {
        const guide = await TourGuide.findOne({ submittedBy: userId });
        if (guide) {
          const startDate = new Date();
          const endDate = new Date();
          
          if (serviceType === 'guide_premium_yearly') {
            endDate.setMonth(endDate.getMonth() + 14); // 12 + 2 free
          } else {
            endDate.setMonth(endDate.getMonth() + 3); // 1 + 2 free
          }
          
          payment.subscriptionDetails = {
            startDate,
            endDate,
            isActive: true,
            plan: serviceType === 'guide_premium_yearly' ? 'yearly' : 'monthly'
          };
          
          guide.isPremium = true;
          guide.premiumExpiry = endDate;
          guide.premiumLevel = 'standard';
          
          await guide.save();
          await payment.save();
          console.log('✅ Tour guide upgraded to premium');
        }
        break;
      }
        
      case 'vehicle_premium_monthly':
      case 'vehicle_premium_yearly': {
        console.log(`🔧 Processing ${serviceType} for user ${userId}`);
        
        const vehicles = await Vehicle.find({ submittedBy: userId });
        console.log(`🔍 Found ${vehicles.length} existing vehicles for user`);
        
        // Calculate dates
        const startDate = new Date();
        const endDate = new Date();
        
        if (serviceType === 'vehicle_premium_yearly') {
          endDate.setMonth(endDate.getMonth() + 14); // 12 + 2 free
        } else {
          endDate.setMonth(endDate.getMonth() + 3); // 1 + 2 free
        }
        
        // Create subscription details - ALWAYS set isActive to true
        payment.subscriptionDetails = {
          startDate,
          endDate,
          isActive: true, // This is crucial - always set to true for completed payments
          plan: serviceType === 'vehicle_premium_yearly' ? 'yearly' : 'monthly',
          vehicleIds: vehicles.map(v => v._id),
          awaitingVehicleRegistration: vehicles.length === 0
        };
        
        if (vehicles.length === 0) {
          console.log(`⚠️ No vehicles found for user ${userId}. Premium subscription will apply to future vehicle registrations.`);
        } else {
          console.log(`✅ Upgrading ${vehicles.length} existing vehicles to premium`);
          
          // Upgrade existing vehicles
          for (const vehicle of vehicles) {
            vehicle.isPremium = true;
            vehicle.premiumExpiry = endDate;
            vehicle.maxPhotos = 3;
            vehicle.analyticsEnabled = true;
            vehicle.bookingNotifications = true;
            vehicle.featuredStatus = 'homepage';
            
            // Initialize analytics if not present
            if (!vehicle.viewCount) vehicle.viewCount = 0;
            if (!vehicle.inquiryCount) vehicle.inquiryCount = 0;
            
            await vehicle.save();
            console.log(`✅ Vehicle ${vehicle._id} upgraded to premium`);
          }
        }
        
        await payment.save();
        console.log(`✅ Payment saved with subscription details:`, payment.subscriptionDetails);
        break;
      }
      
      default:
        console.log(`❓ No specific handling for service type: ${serviceType}`);
    }
  } catch (error) {
    console.error('❌ Error processing successful payment:', error);
    throw error;
  }
};

exports.processSuccessfulPayment = processSuccessfulPayment;