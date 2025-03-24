import express from 'express';
import Inquiry from '../models/Inquiry.js';
const router = express.Router();

// Create an inquiry
router.post('/', async (req, res) => {
    try {
        const inquiry = new Inquiry(req.body);
        await inquiry.save();
        res.status(201).send('Inquiry sent successfully!');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update an inquiry
router.put('/:id', async (req, res) => {
    try {
        const updatedInquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInquiry) {
            return res.status(404).send('Inquiry not found');
        }
        res.status(200).json(updatedInquiry); // Send the updated inquiry as a response
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Fetch all inquiries
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find();
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete an inquiry
router.delete('/:id', async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        res.status(200).send('Inquiry deleted successfully!');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//search inquiries.
router.get('/search', async (req, res) => {
    const searchTerm = req.query.term; // Get the search term from the query parameters

    if (!searchTerm) {
        return res.status(400).json({ message: 'Search term is required.' });
    }

    try {
        // Query the database for matching inquiries
        const inquiries = await Inquiry.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: searchTerm, $options: 'i' } },
                { message: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        res.json(inquiries); // Return the search results
    } catch (error) {
        console.error('Error searching inquiries:', error);
        res.status(500).json({ message: 'An error occurred while searching inquiries.' });
    }
});

export default router;
