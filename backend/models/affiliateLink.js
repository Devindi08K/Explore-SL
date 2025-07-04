const mongoose = require("mongoose");

const affiliateLinkSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  businessType: { type: String, required: true, enum: ['restaurant', 'hotel', 'shop', 'other', 'cafe', 'localEatery'] },
  description: { type: String, required: true },
  location: { type: String, required: true },
  priceRange: { type: String },
  specialties: { type: String },
  openingHours: { type: String },
  imageUrl: { type: String, required: true },
  bookingUrl: { type: String },
  contactName: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  isExternal: { type: Boolean, default: false },
  redirectUrl: { type: String },
  listingType: { type: String, enum: ['regular', 'sponsored'], default: 'regular' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isVerified: { type: Boolean, default: false },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Premium Features
  isPremium: { type: Boolean, default: false },
  premiumExpiry: { type: Date },
  featuredStatus: { type: String, enum: ['none', 'homepage', 'destination'], default: 'none' },
  analyticsEnabled: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  needsReview: { type: Boolean, default: false },
  hadPremiumBefore: { type: Boolean, default: false }
});

module.exports = mongoose.model('AffiliateLink', affiliateLinkSchema);