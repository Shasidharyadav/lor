// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  createStudent,
  createTeacher,
  createAdmin,
  createStudentProfile,
  createFacultyProfile,
  createAdminProfile,
  findUserById,
  findProfileById,
  updateUserDetails,
  updateProfile,
  updatePassword,
  getAllTeacherUsers,
} = require('../models/userModel');


// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Register User
exports.registerUser = async (req, res) => {
  const { id, name, role, password, ...otherData } = req.body;

  if (!id || !name || !role || !password) {
    return res
      .status(400)
      .json({ message: 'All required fields must be provided.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
      await createStudent({ id, name, password: hashedPassword, ...otherData });
      await createStudentProfile({ id });
    } else if (role === 'teacher') {
      await createTeacher({ id, name, password: hashedPassword, ...otherData });
      await createFacultyProfile({ id });
    } else if (role === 'admin') {
      await createAdmin({ id, name, password: hashedPassword, ...otherData });
      await createAdminProfile({ id });
    } else {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    res
      .status(201)
      .json({ message: 'User and profile created successfully.' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res
      .status(500)
      .json({ message: 'Server error. Please try again later.' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res
      .status(400)
      .json({ message: 'ID and password are required.' });
  }

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: { id: user.id, role: user.role, name: user.name },
    });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res
      .status(500)
      .json({ message: 'Server error. Please try again later.' });
  }
};

// Fetch User Profile
exports.getUserProfile = async (req, res) => {
  const { id, role } = req.user;

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // findProfileById might return an array of rows
    const profiles = await findProfileById(id, role);
    // Extract the first object from the array
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    // Remove password from the user object
    const { password, ...userDetails } = user;

    // Merge user details with profile fields
    res.status(200).json({ ...userDetails, ...profile });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res
      .status(500)
      .json({ message: 'Server error. Please try again later.' });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { id, role } = req.user;
  const updates = req.body;

  try {
    // Separate updates for user table and profile table
    const userUpdates = {};
    const profileUpdates = {};

    const schema = {
      student: {
        userTable: [
          'name',
          'personalEmail',
          'campus',
          'school',
          'department',
          'specialization',
          'yearOfPassout',
        ],
        profileTable: ['linkedin', 'twitter', 'portfolio', 'bio'],
      },
      teacher: {
        userTable: [
          'name',
          'phone',
          'campus',
          'school',
          'department',
          'specialization',
          'designation',
        ],
        profileTable: ['qualifications', 'research_interests', 'bio'],
      },
      admin: {
        userTable: ['name'],
        profileTable: ['school', 'department'],
      },
    };

    const userFields = schema[role]?.userTable || [];
    const profileFields = schema[role]?.profileTable || [];

    Object.keys(updates).forEach((key) => {
      if (userFields.includes(key)) {
        userUpdates[key] = updates[key];
      }
      if (profileFields.includes(key)) {
        profileUpdates[key] = updates[key];
      }
    });

    // Update user details
    if (Object.keys(userUpdates).length > 0) {
      await updateUserDetails(id, userUpdates, role);
    }

    // Update profile details
    if (Object.keys(profileUpdates).length > 0) {
      await updateProfile(id, profileUpdates, role);
    }

    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res
      .status(500)
      .json({ message: 'Server error. Please try again later.' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Both current and new passwords are required.' });
  }

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Incorrect current password.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(id, hashedPassword, user.role);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res
      .status(500)
      .json({ message: 'Server error. Please try again later.' });
  }
};

// -- NEW CONTROLLER: getAllFaculty
exports.getAllFaculty = async (req, res) => {
  try {
    // This returns all teacher users (joined with faculty_profiles) from the model
    const faculty = await getAllTeacherUsers();
    return res.status(200).json(faculty); // an array of faculty objects
  } catch (error) {
    console.error('Error fetching faculty:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Handler to get pending LoR requests for a specific teacher
 */
exports.getPendingTeacherRequests = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    // Validate teacherId presence
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required.' });
    }

    // Fetch pending requests from the model
    const pendingRequests = await getPendingRequestsByTeacher(teacherId);

    // Check if any requests are found
    if (!pendingRequests || pendingRequests.length === 0) {
      return res.status(200).json([]); // Return empty array if no pending requests
    }

    res.status(200).json(pendingRequests);
  } catch (err) {
    console.error('Error fetching pending teacher LoR requests:', err);
    res.status(500).json({ message: 'Server error while fetching pending LoR requests.' });
  }
};
