const express = require('express');
const { registerUser } = require('../controllers/userController'); // Ensure path is correct

const router = express.Router();

// POST /api/users/register
router.post('/register', registerUser);

module.exports = router;
