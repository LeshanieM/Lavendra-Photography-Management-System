import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRouteOld.js';
import orderRouter from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import bookingRoutes from './routes/BookingRoutes.js';
import reviewRouter from './routes/ReviewRoute.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import { Server } from 'socket.io';
import http from 'http';
import userRoutes from './routes/userRoutes.js';
import authMiddleware from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import blogRouter from './routes/BlogRoute.js';
import router from './routes/NoticeRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });
const { auth, isAdmin, isPhotographer, isUser } = authMiddleware;

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Middleware to attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Enable CORS
app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/reviews', reviewRouter);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/notices', router);

app.use('/blogs', blogRouter);
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';

// Initialize Cloudinary with credentials from .env
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Database connection
let db;
const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    db = client.db('photoGallery');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to MongoDB:', error);
    process.exit(1);
  }
};

// After cloudinary.config()
const ensureRootFolder = async () => {
  try {
    await cloudinary.api.create_folder(
      process.env.CLOUDINARY_ROOT_FOLDER || 'default_folder'
    );
  } catch (error) {
    if (!error.message.includes('already exists')) {
      console.error('Error creating root folder:', error);
    }
  }
};

await ensureRootFolder();
await connectToDatabase();

const port = process.env.PORT || 5000;

// Configure CORS with more specific options
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, JPG, PNG, GIF and WEBP are allowed.'
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

// Update the existing 'Get all images' endpoint to support folder filtering
app.get('/images', async (req, res) => {
  try {
    const folder = req.query.folder;

    if (!folder) {
      return res.status(400).json({ error: 'Folder parameter is required' });
    }

    console.log(`Fetching images from Cloudinary folder: ${folder}`);

    // Use the admin API with the folder parameter
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder + '/', // Add trailing slash to ensure we're in the right folder
      max_results: 100,
    });

    console.log(
      `Found ${
        result.resources ? result.resources.length : 0
      } images in ${folder}`
    );

    res.json(result.resources || []);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      error: 'Failed to fetch images',
      details: error.message,
    });
  }
});

// Image upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Check if folder is specified
    if (!req.body.folder) {
      return res.status(400).json({ error: 'Folder is required.' });
    }

    const folder = req.body.folder;

    // Upload to Cloudinary with metadata
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folder,
      resource_type: 'auto',
      tags: req.body.tags ? req.body.tags.split(',') : [],
      public_id: req.body.customFilename || undefined,
      transformation: [
        { quality: 'auto' }, // Optimize image quality
        { fetch_format: 'auto' }, // Auto-select best format
      ],
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    // Return detailed response
    res.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
    });
  } catch (error) {
    console.error('Error uploading image:', error);

    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Upload failed',
      details: error.message,
    });
  }
});

// Delete image endpoint
app.delete('/images/:folder/:publicId', async (req, res) => {
  try {
    const folder = req.params.folder;
    const publicId = req.params.publicId;
    const fullPublicId = `${folder}/${publicId}`;

    console.log(`Deleting image: ${fullPublicId}`);

    const result = await cloudinary.uploader.destroy(fullPublicId);

    if (result.result === 'ok') {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res
        .status(404)
        .json({ error: 'Image not found or could not be deleted' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Delete failed', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/folders', async (req, res) => {
  try {
    // Check if folderName is provided
    if (!req.body.folderName) {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    const folderName = req.body.folderName.trim();

    // Validate folder name (alphanumeric, spaces, apostrophes allowed)
    if (!/^[a-zA-Z0-9 '.-]+$/.test(folderName)) {
      return res.status(400).json({
        error:
          'Invalid folder name. Use only letters, numbers, spaces, apostrophes, periods, or hyphens.',
      });
    }

    // In Cloudinary, folders are created implicitly by uploading a file to a path
    // We'll upload a tiny placeholder and then delete it
    const placeholderData =
      'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

    // Upload placeholder to create folder
    const uploadResult = await cloudinary.uploader.upload(placeholderData, {
      folder: folderName,
      public_id: '.folder-placeholder',
    });

    // Delete the placeholder
    await cloudinary.uploader.destroy(uploadResult.public_id);

    // Return success
    res.json({
      success: true,
      message: `Folder "${folderName}" created successfully`,
      folderName: folderName,
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({
      error: 'Failed to create folder',
      details: error.message,
    });
  }
});

// Add this endpoint to list all folders
app.get('/folders', async (req, res) => {
  try {
    // Get all folders using the sub_folders API endpoint
    const result = await cloudinary.api.sub_folders('');

    res.json(result.folders || []);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({
      error: 'Failed to fetch folders',
      details: error.message,
    });
  }
});

// Email configuration (add to your .env)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Add error handling for missing email config
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error(
    'Email credentials not configured! Sharing functionality will be disabled'
  );
}

// Share folder endpoint with email verification
app.post('/folders/share', async (req, res) => {
  try {
    const { folderName, email } = req.body;

    if (!folderName || !email) {
      return res
        .status(400)
        .json({ error: 'Folder name and email are required' });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Generate unique token
    const token = crypto.randomBytes(20).toString('hex');
    const shareLink = `${process.env.BASE_URL}/folder/${token}`;

    // Store in database
    await db.collection('sharedFolders').insertOne({
      folderName,
      email,
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Send email
    await transporter.sendMail({
      from: `"Photo Gallery Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Shared Folder: ${folderName}`,
      html: `
        <h1>You've been granted access to a folder</h1>
        <p>The administrator has shared the folder "${folderName}" with you.</p>
        <p><a href="${shareLink}">Click here to access the folder</a></p>
        <p>This link will expire in 7 days.</p>
        <p>When you click the link, you'll need to verify your email address to view the photos.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.json({
      success: true,
      message: `Share link sent to ${email}. User will need to verify this email to access the folder.`,
    });
  } catch (error) {
    console.error('Error sharing folder:', error);
    res.status(500).json({
      error: 'Failed to share folder',
      details: error.message,
    });
  }
});

// Validate token endpoint
app.get('/folders/validate-token/:token', async (req, res) => {
  try {
    const token = req.params.token;

    const shareRecord = await db.collection('sharedFolders').findOne({ token });

    if (!shareRecord) {
      return res.status(404).json({ valid: false, error: 'Invalid token' });
    }

    if (new Date() > shareRecord.expiresAt) {
      return res.status(410).json({ valid: false, error: 'Token has expired' });
    }

    res.json({
      valid: true,
      folderName: shareRecord.folderName,
      email: shareRecord.email,
    });
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(500).json({
      error: 'Validation failed',
      details: error.message,
    });
  }
});

// Verify email endpoint - now returns the specific folder access
app.post('/folders/verify-email', async (req, res) => {
  try {
    const { email, folderName } = req.body;

    if (!email || !folderName) {
      return res
        .status(400)
        .json({ error: 'Email and folder name are required' });
    }

    const shareRecord = await db.collection('sharedFolders').findOne({
      folderName,
      email,
    });

    if (!shareRecord) {
      return res.json({
        verified: false,
        error: 'This email does not have access to this folder',
      });
    }

    res.json({
      verified: true,
      folderName: shareRecord.folderName,
      email: shareRecord.email,
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      error: 'Verification failed',
      details: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
