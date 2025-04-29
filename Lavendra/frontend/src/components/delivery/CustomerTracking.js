import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Establish socket.io connection to backend
const socket = io("http://localhost:5000");

const CustomerTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Progress tracker
  const statusSteps = ["Pending", "Out for Delivery", "Delivered", "Completed"];
  const colors = {
    Pending: "green",
    "Out for Delivery": "orange",
    Delivered: "purple",
    Completed: "gray",
  };

  // Real-time updates
  useEffect(() => {
    socket.on("statusUpdated", (updatedDelivery) => {
      if (updatedDelivery.orderId === orderId) {
        setDeliveryStatus(updatedDelivery.deliveryStatus);
      }
    });

    return () => socket.off("statusUpdated");
  }, [orderId]);

  // Track order
  const trackOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/deliveries");
      const delivery = response.data.find((d) => d.orderId === orderId);

      if (!delivery) {
        setError("Order not found.");
        setDeliveryStatus("");
      } else {
        setDeliveryStatus(delivery.deliveryStatus);
        setError("");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setError("Failed to track order.");
    } finally {
      setLoading(false);
    }
  };

  // Get messages according to the delivery status
  const getStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return {
          message: "Your order has been placed and is being processed.",
          icon: <PendingActionsIcon sx={{ fontSize: 80, color: "#6a1b9a" }} />,
        };
      case "Out for Delivery":
        return {
          message: "Good news! Your order is on its way.",
          icon: <LocalShippingIcon sx={{ fontSize: 80, color: "#6a1b9a" }} />,
        };
      case "Delivered":
        return {
          message: "Your order has been delivered. Please check your delivery.",
          icon: <InventoryIcon sx={{ fontSize: 80, color: "#6a1b9a" }} />,
        };
      case "Completed":
        return {
          message: "Thank you! Your order is successfully completed.",
          icon: <CheckCircleIcon sx={{ fontSize: 80, color: "#6a1b9a" }} />,
        };
      default:
        return { message: "", icon: null };
    }
  };

  return (
    <Box sx={{ textAlign: "center", margin: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Track Your Order
      </Typography>

      {/* Track Order Card */}
      <Paper sx={{ padding: 3, display: "inline-block" }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <TextField
            label="Enter Order ID"
            variant="outlined"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            sx={{ width: "300px" }}
          />
          <Button
            variant="contained"
            onClick={trackOrder}
            sx={{
              height: "56px",
              backgroundColor: "#6a1b9a",
              "&:hover": {
                backgroundColor: "#38006b",
              },
            }}
          >
            Track
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ marginTop: 3 }}>
            <CircularProgress sx={{ color: "#6a1b9a" }} />
          </Box>
        )}

        {deliveryStatus && !loading && (
          <Box sx={{ marginTop: 3 }}>
            {/* Progress Stepper */}
            <Stepper activeStep={statusSteps.indexOf(deliveryStatus)} alternativeLabel>
              {statusSteps.map((step, index) => (
                <Step key={step} sx={{ maxWidth: "120px" }}>
                  <StepLabel
                    sx={{
                      color:
                        statusSteps.indexOf(deliveryStatus) >= index
                          ? colors[step]
                          : "gray",
                    }}
                  >
                    {step}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}
      </Paper>

      {/* Status Message Card */}
      {deliveryStatus && !loading && (
        <Card sx={{ marginTop: 4, padding: 3, backgroundColor: "#f3e5f5", width: "400px", marginX: "auto" }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: "#6a1b9a", marginBottom: 2 }}>
              {getStatusMessage(deliveryStatus).message}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
              {getStatusMessage(deliveryStatus).icon}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CustomerTracking;
