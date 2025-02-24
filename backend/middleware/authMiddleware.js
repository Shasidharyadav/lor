const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); // so we can query DB to find teacher status

// Authenticate middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data (id, role, etc.) from token
    req.user = {
      id: decoded.id,
      role: decoded.role,
      // Optionally attach any other fields from the token payload
    };

    // If this user is a teacher, fetch the status from DB
    if (decoded.role === 'teacher') {
      try {
        const [teacher] = await userModel.executeQuery(
          'SELECT status FROM teacher_users WHERE id = ? LIMIT 1',
          [decoded.id],
          'Error fetching teacher status in authMiddleware'
        );
        if (teacher) {
          req.user.status = teacher.status; 
          // e.g. "teacher", "HOD", or "HOI"
        } else {
          req.user.status = 'teacher'; // fallback if not found
        }
      } catch (err) {
        console.error('Error fetching teacher status:', err.message);
        // you can decide if you want to block or just pass through
        // return res.status(500).json({ message: 'Failed to fetch teacher status' });
      }
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Invalid token:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
// roles can be e.g. ['admin'] or 'admin'
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
