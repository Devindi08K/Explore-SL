const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  blogUrl: { type: String, required: true },
  email: { type: String, required: true },
  message: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("Blog", blogSchema);
