const express = require('express');
const { registerUser, loginUser, logoutUser, checkAuth, getCurrentUser, generateToken, requestPasswordReset, resetPassword, verifyEmail } = require('../controllers/authController');
const passport = require('passport');
const User = require('../models/User'); // Make sure to import the User model
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware
const sendEmail = require('../utils/emailTransporter'); // Correct import
const crypto = require('crypto'); // Import crypto for token generation

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
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      // Use the FRONTEND_URL from environment variables for the redirect
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
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

// Add this route to your existing routes
router.get('/me', protect, getCurrentUser);

// Request password reset (send email)
router.post('/forgot-password', requestPasswordReset);

// Reset password (user clicks link in email)
router.post('/reset-password/:token', resetPassword);

// Verify email route
router.get('/verify-email/:token', verifyEmail);

// Resend verification email - accessible both logged in and logged out
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    let user;
    
    console.log(`🔄 Resend verification request for email: ${email || 'not provided'}`);
    
    // If no email in request body but user is logged in, use their email
    if (!email && req.user) {
      user = await User.findById(req.user._id);
      console.log(`Using logged-in user's email: ${user?.email || 'not found'}`);
    } else if (email) {
      user = await User.findOne({ email });
      console.log(`Looking up user by email: ${email}, found: ${user ? 'yes' : 'no'}`);
    } else {
      console.log('No email provided and user not logged in');
      return res.status(400).json({ error: "Email is required" });
    }
    
    if (!user) {
      // Don't reveal if user exists or not for security
      console.log('User not found, sending generic response');
      return res.json({ message: "If this email exists, a verification link has been sent." });
    }
    
    if (user.emailVerified) {
      console.log(`User ${user.email} is already verified`);
      return res.json({ message: "Your email is already verified.", verified: true });
    }
    
    // Generate a new token
    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    await user.save();
    
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    console.log(`Generated verification URL: ${verifyUrl}`);
    
    try {
      console.log(`Attempting to send verification email to ${user.email}`);
      const emailResult = await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Email Verification</h2>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verifyUrl}" style="display:inline-block; padding:12px 24px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #eab308; border-radius: 5px; text-decoration: none;">Verify Email Address</a>
            <p>If you didn't request this, you can ignore this email.</p>
          </div>
        `
      });
      
      if (emailResult && emailResult.error) {
        console.error("Failed to send email:", emailResult.message);
        // Continue anyway, just log the error
        console.log("Continuing despite email error...");
      }
      
      // If in development, provide a direct verification link
      let response = { message: "Verification email has been sent. Please check your inbox." };
      if (process.env.NODE_ENV !== 'production') {
        response.devVerificationLink = `${process.env.BACKEND_URL}/auth/dev-verify-direct/${token}`;
        console.log(`Development verification link: ${response.devVerificationLink}`);
      }
      
      console.log('Verification process completed');
      res.json(response);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Log the detailed error for debugging
      console.error("Detailed error:", {
        name: emailError.name,
        message: emailError.message,
        stack: emailError.stack
      });
      
      // Send a response anyway instead of failing
      res.json({ 
        message: "Verification token created but there was an issue sending the email. Please try again later.",
        emailError: true
      });
    }
  } catch (error) {
    console.error("Error in resend verification:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a direct verification endpoint for development
if (process.env.NODE_ENV !== 'production') {
  router.get('/dev-verify-direct/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const user = await User.findOne({ emailVerificationToken: token });
      
      if (!user) {
        return res.send('Invalid or expired token');
      }
      
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();
      
      res.send('Email verified successfully! You can now close this page and log in.');
    } catch (error) {
      res.send('Error verifying email: ' + error.message);
    }
  });
}

// Test email sending
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    
    console.log(`🧪 Testing email sending to ${email}`);
    
    const result = await sendEmail({
      to: email,
      subject: 'Test Email from SLExplora',
      html: `
        <h1>This is a test email</h1>
        <p>If you received this, email sending is working correctly.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `
    });
    
    if (result.error) {
      console.error("Failed to send test email:", result.message);
      return res.status(500).json({ error: "Failed to send test email. Please try again later." });
    }
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully', 
      result 
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send test email' 
    });
  }
});

// Test email with custom domain
router.post('/test-domain-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    
    console.log(`🧪 Testing custom domain email to: ${email}`);
    
    const result = await sendEmail({
      to: email,
      subject: 'Test Email from SLExplora',
      html: `
        <h1>This is a test email from SLExplora</h1>
        <p>If you received this, your custom domain email configuration is working correctly.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Best regards,<br>The SLExplora Team<br><a href="https://slexplora.com">slexplora.com</a></p>
      `
    });
    
    if (result.error) {
      console.error("Failed to send custom domain test email:", result.message);
      return res.status(500).json({ error: "Failed to send custom domain test email. Please try again later." });
    }
    
    res.json({ 
      success: true, 
      message: 'Custom domain test email sent successfully', 
      result 
    });
  } catch (error) {
    console.error('Custom domain test email error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send test email' 
    });
  }
});

// Development-only route to verify users without email
if (process.env.NODE_ENV !== 'production') {
    router.post('/dev-verify', async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            user.isVerified = true;
            await user.save();
            
            res.json({ message: 'User verified for development purposes' });
        } catch (error) {
            console.error('Error in dev verification:', error);
            res.status(500).json({ error: error.message });
        }
    });
}

module.exports = router;
