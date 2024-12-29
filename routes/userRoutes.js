const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Register User
router.post('/register', userController.register);

// Login User
router.post('/login', userController.login);

// Logout User
router.post('/logout', userController.logout);

// Get All Users
router.get('/', authenticateToken, authorizeRole(['admin']), userController.getAllUsers);

// Create User
router.post('/', authenticateToken, authorizeRole(['admin']), userController.createUser);

// Read User
router.get('/:id', authenticateToken, authorizeRole(['admin']), userController.getUser);

// Update User
router.patch('/:id', authenticateToken, authorizeRole(['admin']), userController.updateUser);

// Delete User
router.delete('/:id', authenticateToken, authorizeRole(['admin']), userController.deleteUser);

module.exports = router;
