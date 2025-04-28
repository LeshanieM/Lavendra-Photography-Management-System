import { body, validationResult } from 'express-validator';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const userController = {
  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Search users (admin only)
  searchUsers: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }

      const { query } = req.query;
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      }).select('-password');
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Create user (admin only)
  createUser: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;

      if (role && !['user', 'admin', 'photographer'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
        role: role || 'user',
      });

      await user.save();

      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update user (admin only)
  updateUser: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role, age, mobile, bio, address } =
        req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (role && !['user', 'admin', 'photographer'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (age) user.age = age;
      if (mobile) user.mobile = mobile;
      if (bio) user.bio = bio;
      if (address) user.address = address;

      if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
          mobile: user.mobile,
          bio: user.bio,
          address: user.address,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete user (admin only)
  deleteUser: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user._id.toString() === req.user.id) {
        return res
          .status(400)
          .json({ message: 'You cannot delete your own account' });
      }

      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update profile (any authenticated user)
  updateProfile: async (req, res) => {
    try {
      console.log('Profile update request received');
      console.log('User:', req.user);
      console.log('Request body:', req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, bio, age, mobile, address } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }

      if (name) user.name = name;
      if (bio) user.bio = bio;
      if (age) user.age = age;
      if (mobile) user.mobile = mobile;
      if (address) user.address = address;

      await user.save();
      console.log('Profile updated successfully');

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          age: user.age,
          mobile: user.mobile,
          address: user.address,
        },
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

export default userController;
