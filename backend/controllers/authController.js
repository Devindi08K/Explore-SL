const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "6h" } // Token expires in 6 hours
    );
};

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

        // Create new user with default role 'regular'
        const user = new User({ 
            userName, 
            email, 
            password, // Password will be hashed by the pre-save middleware
            role: 'regular'
        });

        await user.save();
        console.log("User registered successfully"); // Debug log

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Registration error:", error); // Debug log
        res.status(500).json({ error: error.message || "Registration failed" });
    }
};

// **LOGIN USER**
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);
        console.log("Password received:", password);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(400).json({ error: "Invalid credentials" });
        }
        console.log("User found:", user.email);
        console.log("Stored hashed password:", user.password);

        // Use the comparePassword method
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isMatch);

        if (!isMatch) {
            console.log("Password does not match");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate token and set cookie
        const token = generateToken(user);
        console.log("Token generated successfully");
        
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 6 * 60 * 60 * 1000 // 6 hours
        });

        // Send response with user data
        res.json({
            role: user.role,
            userName: user.userName,
            email: user.email
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed. Please try again." });
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
