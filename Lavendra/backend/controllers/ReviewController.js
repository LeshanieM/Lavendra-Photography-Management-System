import Review from "../models/ReviewModel.js";

// Get all reviews
const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find();
        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found" });
        }
        return res.status(200).json({ reviews });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching reviews" });
    }
};

// Add a new review
const addReviews = async (req, res, next) => {
    const { name, email, reviewText, rating } = req.body;

    try {
        const review = new Review({ name, email, reviewText, rating });
        await review.save();
        return res.status(201).json({ message: "Review added successfully", review });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error adding review" });
    }
};

// Get review by email
const getByEmail = async (req, res, next) => {
    try {
        const review = await Review.findOne({ email: req.params.email });
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.status(200).json({ review });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching review" });
    }
};

// Update review by email
const updateByEmail = async (req, res, next) => {
    const { reviewText, rating } = req.body;
    try {
        const review = await Review.findOneAndUpdate(
            { email: req.params.email },
            { reviewText, rating },
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.status(200).json({ message: "Review updated successfully", review });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating review" });
    }
};

// Delete review by email
const deleteByEmail = async (req, res, next) => {
    try {
        const review = await Review.findOneAndDelete({ email: req.params.email });
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error deleting review" });
    }
};

// Default export
export default {
    getAllReviews,
    addReviews,
    getByEmail,
    updateByEmail,
    deleteByEmail,
};
