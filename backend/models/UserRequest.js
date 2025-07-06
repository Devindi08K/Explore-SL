const mongoose = require('mongoose');

// Add the viewed field to the schema
const userRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['vehicle', 'tourGuide', 'blog', 'business', 'tour'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  requestText: {
    type: String,
    required: true
  },
  requestType: {
    type: String,
    enum: ['edit', 'remove'],
    default: 'edit'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  adminResponse: String,
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  viewed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('UserRequest', userRequestSchema);