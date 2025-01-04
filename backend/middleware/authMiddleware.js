const jwt = require('jsonwebtoken');

// Authenticate middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data from token to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Invalid token:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles]; // Convert single role to an array
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next(); // Proceed if the role matches
  };
};

module.exports = { authenticate, authorize };
