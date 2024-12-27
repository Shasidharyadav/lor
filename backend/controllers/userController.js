const bcrypt = require('bcryptjs');
const { findUserById, updateUserDetails, updatePassword } = require('../models/userModel');

// Register User
exports.registerUser = async (req, res) => {
  const { id, name, gitamEmail, role, password } = req.body;

  if (!id || !name || !gitamEmail || !role || !password) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (role === 'student') {
      await createStudent({ ...req.body, password: hashedPassword });
    } else if (role === 'teacher') {
      await createTeacher({ ...req.body, password: hashedPassword });
    } else if (role === 'admin') {
      await createAdmin({ id, name, gitamEmail, password: hashedPassword });
    } else {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Fetch User Profile
exports.getUserProfile = async (req, res) => {
  const { id } = req.user; // Extracted from JWT token in `authenticate` middleware

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Exclude sensitive fields like password
    const { password, ...userDetails } = user;

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { id } = req.user; // Extracted from JWT token
  const updates = req.body;

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await updateUserDetails(id, updates, user.role);

    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new passwords are required.' });
  }

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(id, hashedPassword, user.role);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
