const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { roleAuth, isAdmin, isHR, isSelfOrAdmin } = require('../middleware/roleAuth');
const { profileUpdateValidation } = require('../middleware/validation');

// Apply authentication middleware to all routes
router.use(auth);

// Get all users (admin and HR only)
router.get('/', roleAuth('admin', 'hr'), userController.getAllUsers);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', profileUpdateValidation, userController.updateProfile);

// Change password
router.put('/change-password', userController.changePassword);

// Get user by ID (admin and HR only)
router.get('/:userId', roleAuth('admin', 'hr'), userController.getUserById);

// Update user (admin only)
router.put('/:userId', isAdmin, userController.updateUser);

// Delete user (admin only)
router.delete('/:userId', isAdmin, userController.deleteUser);

module.exports = router; 