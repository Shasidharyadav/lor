const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/userModel');

const login = (req, res) => {
  const { id, password } = req.body;

  findUserById(id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (results.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch)
        return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      });
    });
  });
};

module.exports = { login };
