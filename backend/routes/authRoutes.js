const express = require('express');
const { loginUser, registerUser } = require('../controllers/userController');
const { forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginUser); 
router.post('/register', registerUser); 
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
