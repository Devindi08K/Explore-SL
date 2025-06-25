const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  serviceType: {
    type: String,
    enum: ['blog_post', 'business_listing', 'tour_partner'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  paymentMethod: String,
  customerDetails: {
    name: String,
    email: String,
    phone: String
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId
  },
  subscriptionDetails: {
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    },
    plan: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Payment', paymentSchema);