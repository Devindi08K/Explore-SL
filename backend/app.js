const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

const app = express();

// Body parser middleware
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport middleware
app.use(passport.initialize());

// API Routes
app.use('/api', require('./routes'));

// Add this line with the other routes
const userRequestsRoutes = require('./routes/userRequestsRoutes');

// Add this line with the other app.use statements
app.use('/api/user-requests', userRequestsRoutes);

module.exports = app;