import express from 'express';
import Delivery from '../models/Delivery.js';

const router = express.Router();

// Create a new delivery
router.post('/', async (req, res) => {
  try {
    const {
      orderId,
      name,
      phone,
      email,
      deliveryAddress,
      city,
      date,
      coordinates,
      deliveryStatus,
    } = req.body;

    // Check if a delivery with the same orderId already exists
    const existingDelivery = await Delivery.findOne({ orderId });
    if (existingDelivery) {
      return res.status(400).json({ message: 'Order ID already exists' });
    }

    const newDelivery = new Delivery({
      orderId,
      name,
      phone,
      email,
      deliveryAddress,
      city,
      date,
      coordinates,
      deliveryStatus,
    });

    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all deliveries
router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get delivery by Order ID for customer tracking
router.get('/:orderId', async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId });
    if (!delivery) return res.status(404).json({ message: 'Order not found' });

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update delivery status for Admin & Delivery Personnel
router.put('/:id', async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus },
      { new: true }
    );

    if (!updatedDelivery)
      return res.status(404).json({ message: 'Delivery not found' });

    // Emit real-time update
    req.io.emit('statusUpdated', updatedDelivery);

    res.json(updatedDelivery);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete delivery by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!deletedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json({ message: 'Delivery deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
