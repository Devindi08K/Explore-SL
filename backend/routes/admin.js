const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Example of an admin route
router.get("/dashboard", protect, authorize(["admin"]), (req, res) => {
    res.send("Welcome to the Admin Dashboard");
});

// Example route to get all users (assuming User model is imported)
router.get("/users", protect, authorize(["admin"]), async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;
