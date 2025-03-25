import express from 'express';
import ReviewController from '../controllers/ReviewController.js';

const reviewRouter = express.Router();

reviewRouter.get("/", ReviewController.getAllReviews);
reviewRouter.post("/", ReviewController.addReviews);
// Get review by email
reviewRouter.get("/email/:email", ReviewController.getByEmail);
// Update review by email
reviewRouter.put("/email/:email", ReviewController.updateByEmail);
// Delete review by email
reviewRouter.delete("/email/:email", ReviewController.deleteByEmail);

export default reviewRouter;
