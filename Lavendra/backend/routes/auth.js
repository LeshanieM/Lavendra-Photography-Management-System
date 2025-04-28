import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authController from '../controllers/authController.js';

// Access individual middlewares like this
const { auth, isAdmin, isPhotographer, isUser } = authMiddleware;

const router = express.Router();

// Register user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user
router.get('/me', auth, authController.getCurrentUser);

export default router;
