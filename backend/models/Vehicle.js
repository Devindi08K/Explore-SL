const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'van', 'minibus', 'largebus', 'suv', 'taxi', 'threeWheeler']
  },
  vehicleModel: {
    type: String,
    required: true
  },
  vehicleYear: {
    type: Number,
    required: true
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true
  },
  seatingCapacity: {
    type: Number,
    required: true
  },
  features: [{
    type: String
  }],
  hasAC: {
    type: Boolean,
    default: false
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  pricePerKm: {
    type: Number
  },
  availability: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  whatsapp: String,
  baseLocation: {
    type: String,
    required: true
  },
  willingToTravel: {
    type: Boolean,
    default: true
  },
  servingAreas: [{
    type: String
  }],
  vehicleImages: {
    type: [String],
    validate: {
      validator: function(images) {
        // Filter out empty strings first
        const validImages = images.filter(img => img && img.trim() !== '');
        const maxImages = this.isPremium ? 3 : 1;
        return validImages.length >= 1 && validImages.length <= maxImages;
      },
      message: function(props) {
        const validImages = props.value.filter(img => img && img.trim() !== '');
        const maxImages = this.isPremium ? 3 : 1;
        return `Vehicle must have 1-${maxImages} valid images. Current: ${validImages.length}`;
      }
    }
  },
  driverLicense: {
    type: String,
    required: true
  },
  vehiclePermit: {
    type: String,
    required: true
  },
  insuranceInfo: {
    type: String,
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  driverExperience: {
    type: Number,
    required: true
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  },
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
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiry: Date,
  featuredStatus: {
    type: String,
    enum: ['none', 'homepage', 'destination'],
    default: 'none'
  },
  maxPhotos: {
    type: Number,
    default: 3 // Free tier default
  },
  analyticsEnabled: {
    type: Boolean,
    default: false
  },
  bookingNotifications: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  inquiryCount: {
    type: Number,
    default: 0
  },
  // For advanced booking calendar
  availabilityCalendar: {
    type: Map,
    of: String,
    default: {}
  },
  needsReview: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);