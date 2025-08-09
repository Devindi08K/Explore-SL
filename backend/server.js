require("dotenv").config();
require('./config/passport');

// Use regular mongoose instead of mongoose-serverless (which is for Vercel)
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const payhereController = require('./controllers/payhereController');

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://slexplora.com',
      'https://www.slexplora.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Allow Vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Special handling for PayHere webhook - keep this BEFORE other middleware
app.post('/payments/payhere/notify', express.json(), payhereController.handleNotification);

// Regular express json parsing for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
// const inquiryRoutes = require('./routes/inquiryRoutes'); // Temporarily disable

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SLExplora API is running' });
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/tour-guides", tourGuideRoutes);
app.use("/admin", adminRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/blogs", blogRoutes);
app.use("/tours", tourRoutes);
app.use("/destinations", destinationRoutes);
app.use("/affiliate-links", affiliateLinksRoute);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user-requests', userRequestsRoutes);
// app.use('/api/inquiries', inquiryRoutes); // Temporarily disable

// Also mount routes without /api prefix for backward compatibility
app.use("/auth", authRoutes);
app.use("/tour-guides", tourGuideRoutes);
app.use("/admin", adminRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/blogs", blogRoutes);
app.use("/tours", tourRoutes);
app.use("/destinations", destinationRoutes);
app.use("/affiliate-links", affiliateLinksRoute);
app.use('/reviews', reviewRoutes);
app.use('/payments', paymentRoutes);
app.use('/user-requests', userRequestsRoutes);
// app.use('/inquiries', inquiryRoutes); // Temporarily disable

// Base route
app.get('/', (req, res) => {
  res.send('SLExplora API is running. Visit /api/health for status.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

// For Vercel serverless functions, we need to export the app
module.exports = app;
