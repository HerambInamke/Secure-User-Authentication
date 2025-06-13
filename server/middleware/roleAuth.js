const User = require('../models/User');

// Middleware to check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Insufficient permissions'
      });
    }

    next();
  };
};

// Helper middleware for common role checks
const isAdmin = roleAuth('admin');
const isHR = roleAuth('hr');
const isSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const userId = req.params.userId || req.body.userId;
  
  // Allow admin to access any user's data
  if (req.user.role === 'admin') {
    return next();
  }

  // Regular users can only access their own data
  if (req.user._id.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  next();
};

module.exports = {
  roleAuth,
  isAdmin,
  isHR,
  isSelfOrAdmin
}; 