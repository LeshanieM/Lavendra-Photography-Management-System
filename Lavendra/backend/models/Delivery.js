import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  name: String,
  phone: String,
  email: String,
  deliveryAddress: String,
  city: String,
  date: String,
  coordinates: {
    type: [Number], // [latitude, longitude]
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Out for Delivery', 'Delivered', 'Completed'],
    default: 'Pending',
  },
});

const Delivery = mongoose.model('Delivery', DeliverySchema);

export default Delivery;
