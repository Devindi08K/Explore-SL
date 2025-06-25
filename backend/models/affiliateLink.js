const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ["hotel", "restaurant", "cafe", "localEatery"], 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  isExternal: { 
    type: Boolean, 
    default: false 
  },
  
  // New field to distinguish between paid affiliates and free listings
  listingType: {
    type: String,
    enum: ["affiliate", "free", "regular"],
    default: "regular" // Regular user submissions are the default
  },
  
  priceRange: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  
  // Fields for businesses with booking systems
  redirectUrl: {
    type: String,
    required: function() { 
      return this.isExternal === true; 
    }
  },

  // Fields for local businesses
  contactName: {
    type: String,
    required: function() { 
      return this.isExternal === false; 
    }
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: function() { 
      return this.isExternal === false; 
    }
  },
  openingHours: {
    type: String,
    required: function() { 
      return this.isExternal === false; 
    }
  },
  specialties: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Add verification fields
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

  // Add review fields
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
  }
});

module.exports = mongoose.model("Affiliate", affiliateSchema);
