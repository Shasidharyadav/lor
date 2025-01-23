const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { executeQuery, updatePassword } = require('../models/userModel');
const { findUserById } = require('../models/userModel');

// Forgot Password - Generate and Send Reset Token
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if user exists
    const roles = ["student_users", "teacher_users", "admin_users"];
    let user = null;

    for (const role of roles) {
      user = await executeQuery(`SELECT * FROM ${role} WHERE gitamEmail = ?`, [email], `Error finding user in ${role}`);
      if (user.length > 0) {
        break;
      }
    }

    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store token in DB
    await executeQuery(
      `INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`,
      [email, hashedToken, Date.now() + 15 * 60 * 1000, hashedToken, Date.now() + 15 * 60 * 1000],
      'Error saving reset token'
    );

    // Send reset link via email
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error in forgotPassword:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Check if token is valid
    const resetEntry = await executeQuery(
      `SELECT * FROM password_resets WHERE token = ? AND expires_at > ?`,
      [hashedToken, Date.now()],
      'Error fetching reset token'
    );

    if (!resetEntry || resetEntry.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const email = resetEntry[0].email;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password
    const roles = ["student_users", "teacher_users", "admin_users"];
    let updated = false;

    for (const role of roles) {
      const result = await executeQuery(
        `UPDATE ${role} SET password = ? WHERE gitamEmail = ?`,
        [hashedPassword, email],
        `Error updating password for ${role}`
      );
      if (result.affectedRows > 0) {
        updated = true;
        break;
      }
    }

    if (!updated) {
      return res.status(404).json({ message: 'User not found to update password' });
    }

    // Delete the reset token
    await executeQuery(`DELETE FROM password_resets WHERE email = ?`, [email], 'Error deleting reset token');

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error in resetPassword:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Login Controller
const login = async (req, res) => {
  const { id, password } = req.body;

  // Validate Input
  if (!id || !password) {
    return res.status(400).json({ message: 'ID and password are required' });
  }

  try {
    // Fetch user by ID
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token valid for 1 day
    );

    // Successful Response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Middleware to Verify Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token data to the request
    next();
  } catch (error) {
    console.error('Invalid token:', error.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
module.exports = { login, verifyToken, forgotPassword, resetPassword };
