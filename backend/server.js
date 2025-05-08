const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const tourGuideRoutes = require("./routes/tourGuideRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const blogRoutes = require("./routes/blogRoutes");
const tourRoutes = require("./routes/tourRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const affiliateLinksRoute = require("./routes/affiliateLinksRoute");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/tour-guides", tourGuideRoutes); // Mount before admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/affiliate-links", affiliateLinksRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((error) => console.error("Error connecting to MongoDB:", error));
