const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');

// Register new user
router.post('/register', registerValidation, authController.register);

// Login user
router.post('/login', loginValidation, authController.login);

// Refresh token
router.post('/refresh', authController.refreshToken);

// Logout user
router.post('/logout', authController.logout);

module.exports = router; 