const mongoose = require("mongoose");

const tourGuideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  languages: [{ type: String, required: true }],
  specialization: [{ type: String, required: true }], // e.g., Cultural, Wildlife, Adventure
  yearsOfExperience: { type: Number, required: true },
  certifications: [{
    name: String,
    issuedBy: String,
    year: Number
  }],
  licenseNumber: { type: String, required: true, unique: true }, // Government-issued license
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  bio: { type: String, required: true },
  availability: { type: String, required: true },
  ratePerDay: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // Admin verification status
  reviews: [{
    rating: Number,
    comment: String,
    reviewerName: String,
    date: { type: Date, default: Date.now }
  }],
  tourAreas: [{ type: String, required: true }], // Districts/areas they cover
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TourGuide", tourGuideSchema);