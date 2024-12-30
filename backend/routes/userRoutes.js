const express = require('express');
const { getUserProfile, updateUserProfile, changePassword, getAllFaculty, } = require('../controllers/userController');
const  { findUserById } = require('../models/userModel')
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

  

router.get('/profile', authenticate, getUserProfile); 
router.put('/profile', authenticate, updateUserProfile);
router.post('/change-password', authenticate, changePassword); 
router.get('/faculty', authenticate, getAllFaculty);

module.exports = router;
