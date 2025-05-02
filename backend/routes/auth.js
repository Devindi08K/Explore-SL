const express = require('express');
const { registerUser, loginUser, logoutUser, checkAuth } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth', checkAuth); // New endpoint to check authentication status

module.exports = router;
