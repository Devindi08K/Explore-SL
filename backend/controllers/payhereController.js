const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const AffiliateLink = require('../models/affiliateLink');
const Blog = require('../models/blog');
const Tour = require('../models/Tour');
const TourGuide = require('../models/TourGuide');
const Vehicle = require('../models/Vehicle');

// Initialize PayHere configuration
const merchantId = process.env.PAYHERE_MERCHANT_ID;
const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
const returnUrl = process.env.PAYHERE_RETURN_URL || 'https://slexplora.com/payment/success';
const cancelUrl = process.env.PAYHERE_CANCEL_URL || 'https://slexplora.com/payment/cancel';
const notifyUrl = process.env.PAYHERE_NOTIFY_URL || 'https://api.slexplora.com/api/payments/payhere/notify';
const payhereMode = process.env.PAYHERE_MODE || 'sandbox';

// Create PayHere checkout data
exports.createPayhereCheckout = async (req, res) => {
  try {
    const { serviceType, amount, description, itemId } = req.body;
    
    if (!serviceType || !amount || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a unique order ID
    const orderId = `SLX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Create a pending payment record
    const payment = new Payment({
      userId: req.user._id,
      amount,
      currency: 'LKR',
      orderId,
      serviceType,
      description,
      status: 'pending',
      paymentMethod: 'payhere',
      itemId: itemId || null,
    });
    
    await payment.save();
    
    // Return the PayHere checkout data
    res.json({
      merchantId,
      returnUrl,
      cancelUrl, 
      notifyUrl,
      orderId,
      itemsDescription: description,
      amount,
      currency: 'LKR',
      firstName: req.user.firstName || req.user.userName || 'Customer',
      lastName: req.user.lastName || '',
      email: req.user.email,
      phone: req.user.phone || '',
      address: req.user.address || 'Sri Lanka',
      city: req.user.city || 'Colombo',
      country: 'Sri Lanka',
      mode: payhereMode
    });
    
  } catch (error) {
    console.error('Error creating PayHere checkout:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Handle PayHere notification (IPN - Instant Payment Notification)
exports.handleNotification = async (req, res) => {
  try {
    console.log('🔔 PayHere notification received:', req.body);
    
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    } = req.body;
    
    // Verify the notification with MD5 signature
    const localMd5Sig = crypto
      .createHash('md5')
      .update(
        merchant_id + 
        order_id + 
        payhere_amount + 
        payhere_currency + 
        status_code + 
        merchantSecret.toUpperCase()
      )
      .digest('hex')
      .toUpperCase();
    
    if (localMd5Sig !== md5sig) {
      console.error('❌ Invalid MD5 signature from PayHere');
      return res.status(400).send('Invalid signature');
    }
    
    // Find the payment by order_id
    const payment = await Payment.findOne({ orderId: order_id });
    
    if (!payment) {
      console.error('❌ Payment not found for order_id:', order_id);
      return res.status(404).send('Payment not found');
    }
    
    // Update payment status based on PayHere status code
    // 2 = Success
    if (status_code === '2') {
      payment.status = 'completed';
      payment.paymentId = payment_id;
      payment.updatedAt = new Date();
      await payment.save();
      
      // Process the successful payment
      await processSuccessfulPayment(payment);
      
      console.log('✅ Payment completed successfully');
    } 
    // Other status codes: 0=Pending, -1=Canceled, -2=Failed, -3=Chargedback
    else if (status_code === '-1' || status_code === '-2') {
      payment.status = 'failed';
      await payment.save();
      console.log('❌ Payment failed or cancelled');
    }
    
    // Always return 200 response for IPN
    return res.status(200).send('OK');
    
  } catch (error) {
    console.error('❌ Error processing PayHere notification:', error);
    return res.status(500).send('Server error');
  }
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
    const { serviceType, userId, itemId } = payment;
    const user = await User.findById(userId);

    switch (serviceType) {
      case 'sponsored_blog_post': {
        payment.subscriptionDetails = {
          awaitingSubmission: true,
          submissionType: 'blog'
        };
        await payment.save();
        console.log('✅ Payment for sponsored blog post recorded. Awaiting submission.');
        break;
      }

      case 'tour_partnership': {
        payment.subscriptionDetails = {
          awaitingSubmission: true,
          submissionType: 'tour'
        };
        await payment.save();
        console.log('✅ Payment for tour partnership recorded. Awaiting submission.');
        break;
      }

      case 'guide_premium_monthly':
      case 'guide_premium_yearly': {
        const guide = await TourGuide.findOne({ submittedBy: userId }).sort({ submittedAt: -1 });
        
        if (guide) {
          // Calculate dates
          const startDate = new Date();
          const endDate = new Date();
          
          if (serviceType === 'guide_premium_yearly') {
            // 12 months for the yearly plan
            endDate.setMonth(endDate.getMonth() + 12);
          } else {
            // Just 1 month for monthly plan
            endDate.setMonth(endDate.getMonth() + 1);
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
          guide.analyticsEnabled = true;
          guide.featuredStatus = 'destination'; // Featured in destination pages by default
          guide.needsReview = true; 
          
          await guide.save();
          await payment.save();
          
          console.log('✅ Tour guide upgraded to premium');
        } else {
          // Store the payment with a flag indicating we need to apply premium to the next guide registered
          payment.subscriptionDetails = {
            startDate: new Date(),
            endDate: serviceType === 'guide_premium_yearly' 
              ? new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000) // 12 months in milliseconds
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),     // 1 month in milliseconds
            isActive: true,
            plan: serviceType === 'guide_premium_yearly' ? 'yearly' : 'monthly',
            awaitingGuideRegistration: true
          };
          await payment.save();
          
          console.log('⚠️ No guide found, flagging payment for future premium upgrade');
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
          // 12 months for the yearly plan
          endDate.setMonth(endDate.getMonth() + 12);
        } else {
          // Just 1 month for monthly plan
          endDate.setMonth(endDate.getMonth() + 1);
        }
        
        // Create subscription details - ALWAYS set isActive to true
        payment.subscriptionDetails = {
          startDate,
          endDate,
          isActive: true,
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
      
      case 'business_listing_monthly':
      case 'business_listing_yearly': {
        console.log(`🔧 Processing ${serviceType} for user ${userId}`);
        
        const listings = await AffiliateLink.find({ submittedBy: userId });
        
        const startDate = new Date();
        const endDate = new Date();
        if (serviceType === 'business_listing_yearly') {
          // Use 12 month pattern 
          endDate.setMonth(endDate.getMonth() + 12);
        } else {
          endDate.setMonth(endDate.getMonth() + 1); // Just 1 month
        }

        payment.subscriptionDetails = {
          startDate,
          endDate,
          isActive: true,
          plan: serviceType === 'business_listing_yearly' ? 'yearly' : 'monthly',
          awaitingSubmission: listings.length === 0 
        };

        if (listings.length > 0) {
          console.log(`✅ Upgrading ${listings.length} existing business listings to premium`);
          for (const listing of listings) {
            listing.isPremium = true;
            listing.premiumExpiry = endDate;
            listing.analyticsEnabled = true;
            listing.featuredStatus = 'destination';
            if (listing.status === 'pending') {
              listing.status = 'approved';
              listing.isVerified = true;
              listing.verifiedAt = new Date();
              listing.needsReview = true;
            }
            await listing.save();
          }
        }

        await payment.save();
        console.log('✅ Payment for business listing recorded and processed.');
        break;
      }
      
      default:
        console.log(`❓ No specific handling for service type: ${serviceType}`);
    }

    // Send receipt email
    const sendReceiptEmail = async (payment, user) => {
      try {
        const { sendEmail } = require('../utils/emailTransporter');
        await sendEmail({
          to: user.email,
          subject: `SLExplora - Payment Receipt #${payment.orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #8B5A2B; margin-bottom: 5px;">Payment Receipt</h1>
                <p style="color: #666; font-size: 14px;">Thank you for your purchase with SLExplora</p>
              </div>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p><strong>Order ID:</strong> ${payment.orderId}</p>
                <p><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleString()}</p>
                <p><strong>Amount:</strong> LKR ${payment.amount.toLocaleString()}</p>
                <p><strong>Description:</strong> ${payment.description}</p>
                <p><strong>Payment Method:</strong> PayHere</p>
              </div>
              
              <div style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                <p><strong>Merchant Information:</strong><br/>
                SLExplora Ltd<br/>
                Registration No: BRG12345678<br/>
                123 Temple Road, Colombo 00300, Sri Lanka<br/>
                Email: info@slexplora.com</p>
                
                <p><strong>Payment Data Policy:</strong><br/>
                We retain transaction data for 7 years to comply with accounting regulations.
                No full card details are stored on our servers. For more information, please see our
                <a href="https://slexplora.com/privacy-policy">Privacy Policy</a>.</p>
              </div>
            </div>
          `
        });
      } catch (error) {
        console.error('Error sending receipt email:', error);
        // Don't fail the payment process if email fails
      }
    };

    // Call this after payment is marked complete
    await sendReceiptEmail(payment, user);
  } catch (error) {
    console.error('❌ Error processing successful payment:', error);
    throw error;
  }
};

exports.processSuccessfulPayment = processSuccessfulPayment;