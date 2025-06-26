const mongoose = require('mongoose');

const vehicleViewSchema = new mongoose.Schema({
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
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for efficient querying
vehicleViewSchema.index({ vehicleId: 1, userId: 1, sessionId: 1, viewedAt: 1 });

module.exports = mongoose.model('VehicleView', vehicleViewSchema);