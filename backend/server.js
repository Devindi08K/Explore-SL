require("dotenv").config(); // <-- Move this to the very top!
require('./config/passport'); // <-- Make sure this is at the top, before routes

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path'); // Import the path module

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json()); // Regular JSON parsing for most routes
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'uploads' directory and its subdirectories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Special handling for Stripe webhook (must be before the express.json middleware)
app.post('/api/payments/stripe/webhook', 
  express.raw({ type: 'application/json' }), 
  (req, res, next) => {
    req.rawBody = req.body; // Save raw body for Stripe signature verification
    next();
  },
  require('./controllers/stripeController').handleStripeWebhook
);

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const tourGuideRoutes = require("./routes/tourGuideRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const blogRoutes = require("./routes/blogRoutes");
const tourRoutes = require("./routes/tourRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const affiliateLinksRoute = require("./routes/affiliateLinksRoute");
const reviewRoutes = require('./routes/review');
const paymentRoutes = require('./routes/paymentRoutes');
const userRequestsRoutes = require('./routes/userRequestsRoutes');
// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/tour-guides", tourGuideRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/affiliate-links", affiliateLinksRoute);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user-requests', userRequestsRoutes);
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
