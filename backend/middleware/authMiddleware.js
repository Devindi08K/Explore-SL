const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Add this import!

const protect = async (req, res, next) => {
  let token;
  
  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    console.log('⚠️ No token provided');
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for user:', decoded.id);
    
    // Attach user to request object
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log('⚠️ User not found but token was valid');
      return res.status(404).json({ error: 'User not found' });
    }
    
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    res.status(401).json({ error: 'Not authorized, token invalid' });
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
