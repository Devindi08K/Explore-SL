require("dotenv").config();
require('./config/passport');
const { MongooseServerless } = require('mongoose-serverless');
const mongoose = new MongooseServerless();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const payhereController = require('./controllers/payhereController');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://slexplora.com', 'https://www.slexplora.com', 'http://localhost:3000'],
  credentials: true
}));

// Special handling for PayHere webhook
app.post('/api/payments/payhere/notify', express.json(), payhereController.handleNotification);

// Regular express json parsing for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'uploads' directory and its subdirectories
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

// Add this to your server.js file
app.get('/', (req, res) => {
  res.status(200).json({ message: 'SLExplora API is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', message: 'API is working properly' });
});

// Replace the current favicon handler with this
app.get('/favicon.ico', (req, res) => {
  // Just send a 204 No Content status to stop the browser from requesting it again
  res.status(204).end();
});

// Add another handler for favicon.png (browsers may request either)
app.get('/favicon.png', (req, res) => {
  res.status(204).end();
});

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
    // If not running on Vercel, start the server
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

// For Vercel serverless functions, we need to export the app
module.exports = app;
