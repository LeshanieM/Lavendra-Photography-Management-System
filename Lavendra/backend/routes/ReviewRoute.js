import express from 'express';
import ReviewController from '../controllers/ReviewController.js';

const reviewRouter = express.Router();

// Get all reviews
reviewRouter.get("/", ReviewController.getAllReviews);

// Add a review
reviewRouter.post("/", ReviewController.addReviews);

// Get all reviews by email
reviewRouter.get("/email/:email", ReviewController.getByEmail);

// Update a review by ID
reviewRouter.put("/:id", ReviewController.updateById);

// Delete a review by ID
reviewRouter.delete("/:id", ReviewController.deleteById);

export default reviewRouter;
