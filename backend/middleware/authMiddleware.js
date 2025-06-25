const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Add this import!

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // The issue is here! decoded only contains the payload, not the actual user object
    // You need to fetch the user from the database first
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    req.user = user; // Set the actual user object with _id property
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Role-based authentication
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied" });
        }
        
        next(); // Don't forget to call next() if authorized!
    };
};

module.exports = { protect, authorize };
