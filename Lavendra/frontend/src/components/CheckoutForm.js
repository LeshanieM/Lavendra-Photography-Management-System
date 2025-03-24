import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { TextField, Button, CircularProgress, Typography, Box, InputAdornment } from '@mui/material';
import { Store } from '../Store'; // Import your context

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const order = location.state?.order; // Access the order object from navigation state

  const { state } = useContext(Store); // Access the global state
  const { userInfo } = state; // Destructure userInfo from the state

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [amount, setAmount] = useState(order?.totalPrice?.toFixed(2) || '0.00'); // Initialize with order.totalPrice
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Regex for email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return regex.test(email);
};

// Handle email input change
const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value === '') {
        setIsValidEmail(true); // Reset validation if the field is empty
        setErrorMessage('');
    } else if (!validateEmail(value)) {
        setIsValidEmail(false);
        setErrorMessage('Please enter a valid email address.');
    } else {
        setIsValidEmail(true);
        setErrorMessage('');
    }
};

  // Update amount when order.totalPrice changes
  useEffect(() => {
    if (order?.totalPrice) {
      setAmount(order.totalPrice.toFixed(2));
    }
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      //Create a payment intent
      const { data: { clientSecret } } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/create-payment-intent`,
        {
          amount: parseFloat(amount) * 100, // Convert to cents
          currency: 'lkr', // Use LKR
          customerEmail: email,
          description: 'Payment for Lavendra Photography Services',
        }
      );

      // Step 2: Confirm the payment
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setMessage('Payment successful!');

        // Step 3: Call the /pay route to update the order status
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/orders/${order._id}/pay`, // Call the /pay route
          {
            id: paymentIntent.id, // Payment intent ID
            status: paymentIntent.status, // Payment status (e.g., 'succeeded')
            update_time: new Date().toISOString(), // Timestamp of payment
            email_address: email, // Customer email
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` }, // Include auth token
          }
        );

        // Step 4: Store payment details (optional)
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/payments/store-payment`,
          {
            name,
            email,
            amount,
            paymentStatus: 'Completed',
            paymentIntentId: paymentIntent.id,
          }
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('Payment failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 'md',
        mx: 'auto',
        mt: 8,
        p: 6,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" sx={{ mb: 4 }}>Checkout Form</Typography>

      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={handleEmailChange/*(e) => setEmail(e.target.value)*/}
        margin="normal"
        required
        error={!isValidEmail} // Show error state if email is invalid
      />

            {!isValidEmail && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {errorMessage}
                </Typography>
            )}

      <TextField
        label="Amount"
        variant="outlined"
        fullWidth
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        margin="normal"
        InputProps={{
          readOnly: true, // Make the field read-only
          startAdornment: <InputAdornment position="start">LKR</InputAdornment>, // Add LKR prefix
        }}
        required
      />

      <Box sx={{ my: 4 }}>
        <CardElement />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Button type="submit" variant="contained" color="primary" disabled={!stripe}>
          Pay Now
        </Button>
      )}

      {message && (
        <Typography sx={{ mt: 4 }}>{message}</Typography>
      )}
    </Box>
  );
};

export default CheckoutForm;