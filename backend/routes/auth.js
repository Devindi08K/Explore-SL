const express = require('express');
const { registerUser, loginUser, logoutUser, checkAuth } = require('../controllers/authController');
const passport = require('passport');
const User = require('../models/User'); // Make sure to import the User model
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth', checkAuth); // New endpoint to check authentication status

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

// Facebook OAuth routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

// Profile endpoint
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

module.exports = router;
