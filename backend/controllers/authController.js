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
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken(user);
        
        res.json({
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
