const mongoose = require("mongoose");

const tourGuideSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, required: true },
  
  // Professional Details
  languages: {
    type: [String],
    default: []
  },
  specialization: {
    type: [String],
    default: []
  },
  yearsOfExperience: { type: Number, required: true },
  certifications: {
    type: [{
      name: String,
      issuedBy: String,
      year: Number
    }],
    default: []
  },
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
  }
});

module.exports = mongoose.model("TourGuide", tourGuideSchema);