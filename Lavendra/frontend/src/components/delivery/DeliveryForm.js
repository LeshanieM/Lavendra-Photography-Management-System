import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  Alert,
} from "@mui/material";

const DeliveryForm = () => {
  const [orderId, setOrderId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [date, setDeliveryDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Validate email and phone number format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderId || !name || !phone || !email || !deliveryAddress || !city || !date) {
      setError("All fields are required!");
      return;
    }

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!phonePattern.test(phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    // Fetching city coordinates
    try {
      const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: city,
          format: "json",
          limit: 1,
        },
      });

      if (!geoResponse.data || geoResponse.data.length === 0) {
        setError("Could not find coordinates for the entered address.");
        return;
      }

      const { lat, lon } = geoResponse.data[0];

      await axios.post("http://localhost:5000/api/deliveries", {
        orderId,
        name,
        phone,
        email,
        deliveryAddress,
        city,
        date,
        coordinates: [parseFloat(lat), parseFloat(lon)],
        deliveryStatus: "Pending",
      });

      navigate("/order-success");
    } catch (error) {
      console.error("Error creating delivery:", error);
      setError("Failed to create delivery. Please try again.");
    }
  };

  // Handle Reset
  const handleReset = () => {
    setOrderId("");
    setName("");
    setPhone("");
    setEmail("");
    setDeliveryAddress("");
    setCity("");
    setDeliveryDate("");
    setError("");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="center">
        {/* Image Section */}
        <Box flex={1} sx={{ mr: 2 }}>
          <img
            src="/images/delivery_form_img.jpg"
            alt="Delivery"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Box>

        {/* Form Section */}
        <Paper elevation={3} sx={{ p: 4, flex: 1 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Delivery Details
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Delivery Address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Delivery Date"
              type="date"
              value={date}
              onChange={(e) => setDeliveryDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#6a1b9a",
                "&:hover": { backgroundColor: "#38006b" },
              }}
            >
              Submit
            </Button>

            <Button
              type="button"
              fullWidth
              variant="outlined"
              sx={{
                mt: 2,
                borderColor: "#6a1b9a",
                color: "#6a1b9a",
                "&:hover": {
                  borderColor: "#38006b",
                  color: "#38006b",
                },
              }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DeliveryForm;
