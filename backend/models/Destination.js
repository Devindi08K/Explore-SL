const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    source: String,
    district: { type: String, required: true, default: 'Colombo' },
    attractions: [String]
});

module.exports = mongoose.model("Destination", destinationSchema);
