const express = require('express');
const router = express.Router();
const { register, login, updateUserRole } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Correct import statement

// Existing routes
router.post('/register', register);
router.post('/login', login);

// New route for updating user roles
router.put('/updateRole/:userId', authMiddleware, updateUserRole);

module.exports = router;
