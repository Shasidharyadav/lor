const bcrypt = require('bcryptjs');
const { createStudent, createTeacher, createAdmin } = require('../models/userModel');

exports.registerUser = async (req, res) => {
  const { id, name, email, phone, campus, department, designation, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
      await createStudent({ id, name, email, phone, campus, department, password: hashedPassword });
    } else if (role === 'teacher') {
      await createTeacher({ id, name, email, designation, department, password: hashedPassword });
    } else if (role === 'admin') {
      await createAdmin({ id, name, email, password: hashedPassword });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Error registering user' });
  }
};
