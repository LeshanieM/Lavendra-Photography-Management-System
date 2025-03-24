import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    name: String,
    email: String,
    amount: Number,
    paymentStatus: String,
    invoiceUrl: String,
    paymentIntentId: String,
    customerId: String,
    createdAt: { type: Date, default: Date.now }
});


const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
