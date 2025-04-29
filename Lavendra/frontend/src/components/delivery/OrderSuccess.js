import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Paper, Box } from "@mui/material";

// Order success component
const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          🎉 Order Placed Successfully!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Thank you for placing your order. You can track it anytime.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/home")}
            sx={{ backgroundColor: '#6a1b9a', '&:hover': { backgroundColor: '#38006b' } }}
          >
            Go to Home
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/track-order")}
            sx={{ borderColor: '#6a1b9a', color: '#6a1b9a', '&:hover': { borderColor: '#38006b', color: '#38006b' } }}
          >
            Track Your Order
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess;
