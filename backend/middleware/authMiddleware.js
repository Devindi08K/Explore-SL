const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token, authorization denied" });
        }

        const extractedToken = token.split(" ")[1];
        const verified = jwt.verify(extractedToken, process.env.JWT_SECRET);

        req.user = verified;

        console.log("Authenticated User:", req.user);

        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
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
        next();
    };
};

module.exports = { protect, authorize };
