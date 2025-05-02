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
  }
});

module.exports = mongoose.model("Affiliate", affiliateSchema);
