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
  contactPhone: String
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
