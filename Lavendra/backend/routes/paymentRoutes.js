import express from 'express';
const router = express.Router();
import Payment from '../models/Payment.js';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, customerEmail, description } = req.body;

        console.log('Received Request Data:', { amount, currency, customerEmail, description }); // Log incoming request

        // Validate amount
        if (!amount || isNaN(amount)) {
            console.log('Invalid amount provided.');
            return res.status(400).send({ error: 'Invalid amount' });
        }

        // Currency Conversion (LKR to USD)
        const conversionRate = 320; // Example rate: 1 USD = 320 LKR
        const amountInUsd = Math.round(parseFloat(amount) / conversionRate * 100);
        console.log('Converted Amount (USD Cents):', amountInUsd);

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInUsd,
            currency: 'usd', 
            automatic_payment_methods: { enabled: true },
            description: description || 'Lavendra Photography Services',
            metadata: { customerEmail }
        });

        console.log('Payment Intent Created Successfully:', paymentIntent);

        res.send({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        res.status(500).send({ error: error.message });
    }
});


// Store Payment in Database
router.post('/store-payment', async (req, res) => {
    try {
        const { name, email, amount, paymentStatus, paymentIntentId } = req.body;

        const payment = new Payment({
            name,
            email,
            amount,
            paymentStatus,
            paymentIntentId
        });

        await payment.save();
        res.send({ message: 'Payment stored successfully!' });
    } catch (error) {
        console.error('Error storing payment:', error);
        res.status(500).send({ error: error.message });
    }
});

// Get All Payments
router.get('/payments', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).send({ error: error.message });
    }
});

export default router;