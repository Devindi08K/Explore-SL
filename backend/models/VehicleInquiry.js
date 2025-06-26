const mongoose = require('mongoose');

const vehicleInquirySchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    default: null
  },
  inquiryType: {
    type: String,
    enum: ['general', 'booking', 'pricing', 'availability', 'other'],
    default: 'general'
  },
  contactDetails: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VehicleInquiry', vehicleInquirySchema);