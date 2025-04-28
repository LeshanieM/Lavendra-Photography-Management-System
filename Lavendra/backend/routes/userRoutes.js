import express from 'express';
import authMiddleware from '../middleware/auth.js';
import userController from '../controllers/userController.js';

const router = express.Router();


// Get all users
router.get('/', authMiddleware.auth, userController.getAllUsers);

// Search users
router.get('/search', authMiddleware.auth, userController.searchUsers);

// Update profile (must be before /:id route)
router.put('/profile', authMiddleware.auth, userController.updateProfile);

// Create user
router.post('/', authMiddleware.auth, userController.createUser);

// Update user
router.put('/:id', authMiddleware.auth, userController.updateUser);

// Delete user
router.delete('/:id', authMiddleware.auth, userController.deleteUser);

export default router;
