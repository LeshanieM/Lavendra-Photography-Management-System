import express from 'express';
import multer from 'multer';
import path from 'path';
import { getAllBlogs, addBlogs, getById, updateBlogs, deleteBlogs } from '../controllers/BlogController.js';

const blogRouter = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure the "uploads" folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// Initialize upload middleware
const upload = multer({ storage: storage });

// Routes
blogRouter.post('/', upload.single('image'), addBlogs);
blogRouter.put('/:id', upload.single('image'), updateBlogs);
blogRouter.get('/:id', getById);
blogRouter.delete('/:id', deleteBlogs);
blogRouter.get('/', getAllBlogs);

export default blogRouter;
