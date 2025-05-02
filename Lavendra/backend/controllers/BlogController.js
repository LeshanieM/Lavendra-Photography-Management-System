import Blog from "../models/BlogModel.js";
import multer from "multer";
import path from "path";

// Image upload configuration (using multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Store images with unique filenames
  },
});

const upload = multer({ storage: storage });

// Get all blogs
const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }
    return res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching blogs" });
  }
};

// Add a new blog 
const addBlogs = async (req, res, next) => {
  const { title, description, publishedDate } = req.body;
  const image = req.file ? req.file.path : null; // Get the uploaded image path

  // Validate published date:
  const today = new Date();
  const selectedDate = new Date(publishedDate);
  if (selectedDate > today) {
    return res.status(400).json({ message: "Published date cannot be in the future." });
  }

  // Check if the image is uploaded
  if (!image) {
    return res.status(400).json({ message: "Image is required to add a blog." });
  }

  try {
    const blog = new Blog({
      title,
      image,
      description,
      publishedDate,
    });

    await blog.save();
    return res.status(201).json({ message: "Blog added successfully", blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error adding blog" });
  }
};

// Get a blog by ID
const getById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching blog" });
  }
};

// Update a blog
const updateBlogs = async (req, res, next) => {
  const { title, description, publishedDate } = req.body;
  const image = req.file ? req.file.path : undefined;

  try {
    const updateData = { title, description, publishedDate };

    if (image) updateData.image = image;

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!blog) {
      return res.status(404).json({ message: "Unable to update blog" });
    }

    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating blog" });
  }
};

// Delete a blog
const deleteBlogs = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Unable to delete blog" });
    }
    return res.status(200).json({ message: "Blog deleted successfully", blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting blog" });
  }
};

export { getAllBlogs, addBlogs, getById, updateBlogs, deleteBlogs }; // Named export
