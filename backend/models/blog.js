const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true }, // Store image URL or base64 string
  author: { type: String, required: true }, // New field for author
  
});

module.exports = mongoose.model("Blog", blogSchema);
