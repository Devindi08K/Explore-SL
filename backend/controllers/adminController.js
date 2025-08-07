// Add this reconciliation function at the end of the file

exports.reconcilePayments = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const Payment = require('../models/Payment');
    const { processSuccessfulPayment } = require('./stripeController');
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Get all pending payments older than 1 week
    const oldPendingPayments = await Payment.find({
      status: 'pending',
      createdAt: { $lt: oneWeekAgo }
    });
    
    console.log(`Found ${oldPendingPayments.length} old pending payments to check`);
    
    // Check with Stripe to see if any were actually completed
    let updatedCount = 0;
    for (const payment of oldPendingPayments) {
      try {
        // If payment has a Stripe session ID, check its status
        if (payment.stripeSessionId) {
          const session = await stripe.checkout.sessions.retrieve(payment.stripeSessionId);
          
          if (session.payment_status === 'paid') {
            console.log(`✅ Payment ${payment.orderId} was actually paid, updating status`);
            payment.status = 'completed';
            payment.paymentId = session.payment_intent;
            payment.updatedAt = new Date();
            await payment.save();
            
            // Process the payment benefits
            await processSuccessfulPayment(payment);
            updatedCount++;
          }
        }
      } catch (checkError) {
        console.error(`Error checking payment ${payment.orderId}:`, checkError);
      }
    }
    
    res.json({ 
      message: `Reconciliation complete. Updated ${updatedCount} payments.`,
      updatedCount 
    });
  } catch (error) {
    console.error('Payment reconciliation error:', error);
    res.status(500).json({ error: 'Failed to reconcile payments' });
  }
};