import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Update an existing booking by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully', updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      message: 'Failed to update booking. Please try again.',
      error: error.message,
    });
  }
});

// Delete an existing booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});

// Default export
export default router;
