import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    amount: Number,
    paymentStatus: String,
    invoiceUrl: String,
    paymentIntentId: String,
    customerId: String,
    createdAt: { type: Date, default: Date.now }
});


const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;

