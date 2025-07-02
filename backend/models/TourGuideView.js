// Create backend/models/TourGuideView.js
const mongoose = require('mongoose');

const tourGuideViewSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourGuide',
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
tourGuideViewSchema.index({ guideId: 1, userId: 1, sessionId: 1, viewedAt: 1 });

module.exports = mongoose.model('TourGuideView', tourGuideViewSchema);