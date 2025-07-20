const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailTransporter');
const validator = require('validator');
const disposableDomains = require('disposable-email-domains');
const transporter = require('../utils/emailTransporter');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "6h" } // Token expires in 6 hours
    );
};

exports.generateToken = generateToken; // <-- Add this line

// Password strength validation
const strongPassword = (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

function isDisposableEmail(email) {
  const domain = email.split('@')[1].toLowerCase();
  return disposableDomains.includes(domain);
}

// **REGISTER USER** (Fixed)
exports.registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        console.log("Registration attempt:", email); // Debug log

        // Check if user already exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ error: "Email already in use" });
        }

        if (await User.findOne({ userName })) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Password strength validation
        if (!strongPassword(password)) {
            return res.status(400).json({ error: "Password must be at least 8 characters, include uppercase, lowercase, and a number." });
        }

        // Email validation
        if (!validator.isEmail(email)) {
          return res.status(400).json({ error: "Invalid email address." });
        }
        if (isDisposableEmail(email)) {
          return res.status(400).json({ error: "Disposable email addresses are not allowed." });
        }

        // Create new user with default role 'regular'
        const token = crypto.randomBytes(32).toString('hex');
        const user = new User({
            userName,
            email,
            password,
            role: 'regular',
            emailVerificationToken: token
        });
        await user.save();
        console.log("Saved verification token:", token, "for user:", user.email);

        // Send verification email
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
        await sendEmail({
          to: user.email,
          subject: 'Verify your email',
          html: `
            <h2>Welcome to SLExplora!</h2>
            <p>Thank you for signing up. <strong>You must verify your email before you can log in.</strong></p>
            <p>Click the button below to verify your email and activate your account:</p>
            <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#eab308;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>
            <p>If you did not sign up, please ignore this email.</p>
          `
        });

        res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });

    } catch (error) {
        console.error("Registration error:", error); // Debug log
        res.status(500).json({ error: error.message || "Registration failed" });
    }
};

// **LOGIN USER**
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email before logging in." });
        }

        const token = generateToken(user);

        res.json({
            _id: user._id,
            token,
            role: user.role,
            userName: user.userName,
            email: user.email
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
};

// **LOGOUT USER**
exports.logoutUser = (req, res) => {
    res.clearCookie("authToken"); // Remove the token from cookies
    res.json({ message: "Logged out successfully" });
};

// **CHECK AUTHENTICATION STATUS**
exports.checkAuth = (req, res) => {
    try {
        const token = req.cookies.authToken; // Retrieve token from cookies
        if (!token) return res.json({ role: null });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ role: decoded.role });

    } catch (error) {
        res.json({ role: null });
    }
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user should be available from the auth middleware
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Return user data (excluding password)
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        // Don't reveal if user exists
        return res.json({ message: "If this email exists, a reset link has been sent." });
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        html: `
            <h2>Password Reset Request</h2>
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#eab308;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
            <p>If you did not request this, you can ignore this email.</p>
        `
    });

    res.json({ message: "If this email exists, a reset link has been sent." });
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
};

// Verify email
exports.verifyEmail = async (req, res) => {
    const { token } = req.params;
    console.log("Verifying token:", token);
    const user = await User.findOne({ emailVerificationToken: token });
    console.log("User found for token:", user);
    if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    res.json({ message: "Email verified successfully" });
};
