import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';


// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const user = await User.findById(decoded.user.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Middleware to check if user is photographer
const isPhotographer = (req, res, next) => {
  if (req.user.role !== 'photographer') {
    return res
      .status(403)
      .json({ message: 'Access denied. Photographer only.' });
  }
  next();
};

// Middleware to check if user is regular user
const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Access denied. User only.' });
  }
  next();
};

// Export the middlewares as an object using default export
export default {
  auth,
  isAdmin,
  isPhotographer,
  isUser,
};
