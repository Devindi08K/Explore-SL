const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true },
  isExternal: { type: Boolean, default: false },
  
  // External tour fields
  bookingUrl: String,
  priceRange: String,
  
  // Local tour fields
  duration: String,
  groupSize: String,
  highlights: String,
  included: String,
  notIncluded: String,
  startingPoint: String,
  endingPoint: String,
  itinerary: [{
    day: String,
    description: String
  }],
  contactEmail: String,
  contactPhone: String,

  // Verification fields
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

  // Add these new fields for premium partnerships
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiry: {
    type: Date
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
  }
});

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    // Format data to match Tour model structure
    const tourData = {
      name: formData.tourName,
      type: formData.tourType,
      description: formData.description,
      // Add a default image since it's required
      image: "https://placehold.co/600x400?text=Tour+Image", // Default placeholder image
      isExternal: hasWebsite,
      bookingUrl: hasWebsite ? formData.bookingUrl : "",
      priceRange: formData.priceRange.startsWith('$') || formData.priceRange.startsWith('Rs') 
        ? formData.priceRange 
        : `Rs ${formData.priceRange}`,
      duration: formData.duration,
      groupSize: formData.groupSize,
      highlights: formData.highlights || "",
      included: formData.included || "",
      notIncluded: formData.notIncluded || "",
      contactEmail: formData.email,
      contactPhone: formData.phone,
      startingPoint: "", // Add required field with default value
      endingPoint: "", // Add required field with default value
      itinerary: [{ day: "Day 1", description: "" }], // Add required field with default value
      status: 'pending',
      submittedAt: new Date(),
      isVerified: false
    };

    await api.post("/tours", tourData);
    alert("Tour submitted successfully!");
    navigate('/tours');
  } catch (error) {
    console.error("Error submitting tour:", error);
    alert("Failed to submit tour: " + (error.response?.data?.error || error.message));
  } finally {
    setIsSubmitting(false);
  }
};

module.exports = mongoose.model("Tour", tourSchema);
