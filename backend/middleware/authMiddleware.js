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
    };

    // If the user is a teacher, fetch the status from DB
    if (decoded.role === 'teacher') {
      try {
        const [teacher] = await userModel.executeQuery(
          'SELECT status FROM teacher_users WHERE id = ? LIMIT 1',
          [decoded.id],
          'Error fetching teacher status in authMiddleware'
        );
        if (teacher) {
          req.user.status = teacher.status; // e.g. "teacher", "HOD", or "HOI"
        } else {
          req.user.status = 'teacher'; // fallback if not found
        }
      } catch (err) {
        console.error('Error fetching teacher status:', err.message);
      }
    } else if (decoded.role === 'department_admin') {
      // For departmental admins, attach a default status
      req.user.status = 'department_admin';
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Invalid token:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
