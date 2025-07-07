const mongoose = require("mongoose");

const tourGuideSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  image: {
    type: String,
    default: ''
  },
  bio: { type: String, required: true },
  
  // Professional Details
  languages: [{ type: String }],
  specialization: [{ type: String }],
  yearsOfExperience: { type: Number, required: true },
  
  // Add this certifications array to your schema
  certifications: [{
    name: { type: String },
    issuedBy: { type: String },
    year: { type: String }
  }],

  licenseNumber: { type: String },
  
  // Contact Information
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  whatsapp: { type: String },
  
  // Availability & Rates
  availability: { type: String, required: true },
  ratePerDay: { type: String, required: true },
  preferredAreas: {
    type: [String],
    default: []
  },
  
  // Verification Fields
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
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Reviews
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },

  // Premium Fields
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiry: {
    type: Date,
    default: null
  },
  premiumLevel: {
    type: String,
    enum: ['none', 'standard', 'premium'],
    default: 'none'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  featuredStatus: {
    type: String,
    enum: ['none', 'homepage', 'destination'],
    default: 'none'
  },
  analyticsEnabled: {
    type: Boolean,
    default: false
  },

  // Review Fields
  needsReview: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,

  // New Field
  hadPremiumBefore: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("TourGuide", tourGuideSchema);