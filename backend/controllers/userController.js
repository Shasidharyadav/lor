const bcrypt = require('bcryptjs');
const { createStudent, createTeacher, createAdmin } = require('../models/userModel');

// Register User Controller
exports.registerUser = async (req, res) => {
  const { id, name, email, phone, campus, department, designation, password, role } = req.body;

  // Validate Input
  if (!id || !name || !email || !password || !role) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user based on role
    if (role === 'student') {
      if (!phone || !campus || !department) {
        return res.status(400).json({ message: 'Missing fields for student role' });
      }
      await createStudent({ id, name, email, phone, campus, department, password: hashedPassword });
    } else if (role === 'teacher') {
      if (!designation || !department) {
        return res.status(400).json({ message: 'Missing fields for teacher role' });
      }
      await createTeacher({ id, name, email, designation, department, password: hashedPassword });
    } else if (role === 'admin') {
      await createAdmin({ id, name, email, password: hashedPassword });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Success Response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);

    // Handle Unique Constraint Violation (MySQL)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'User with this ID or Email already exists' });
    }

    // Generic Error Response
    res.status(500).json({ message: 'Error registering user' });
  }
};
