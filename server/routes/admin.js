const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleAuth');

// All routes require authentication and admin role
router.use(auth);
router.use(isAdmin);

// Get all users
router.get('/users', adminController.getAllUsers);

// Get user by ID
router.get('/users/:userId', adminController.getUserById);

// Update user
router.put('/users/:userId', adminController.updateUser);

// Update user role
router.patch('/users/:userId/role', adminController.updateUserRole);

// Delete user
router.delete('/users/:userId', adminController.deleteUser);

// Get system statistics
router.get('/stats', adminController.getSystemStats);

// Update user status
router.patch('/users/:userId/status', adminController.updateUserStatus);

module.exports = router; 