const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  requestedDates: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  ownerResponse: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  tourGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourGuide'
  }
});

module.exports = mongoose.model('Inquiry', inquirySchema);