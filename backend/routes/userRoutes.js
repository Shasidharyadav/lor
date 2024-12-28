const express = require('express');
const {
  registerUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
} = require('../controllers/userController'); 
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser); 
router.get('/profile', authenticate, getUserProfile); 
router.put('/profile', authenticate, updateUserProfile); 
router.post('/change-password', authenticate, changePassword); 

module.exports = router;
