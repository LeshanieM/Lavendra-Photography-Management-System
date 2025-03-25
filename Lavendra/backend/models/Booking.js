import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  photographers: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  hours: { type: Number, required: true },
  editedPhotos: { type: Number, required: true },
  locations: { type: Number, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
});

// Export the model as default
export default mongoose.model('CustomizedBookings', bookingSchema);
