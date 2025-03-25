// src/components/Hero.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Hero = () => {
  return (
    <Box
      sx={{
        height: '100vh', // Full viewport height
        backgroundColor: '#f3ecff', // Light purple background
        margin: 0, // Remove default margin
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box sx={{ maxWidth: 600 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: '3rem',
            marginBottom: 2,
            color: '#8744cf', // Purple text
          }}
        >
          Capture Your World
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.2rem',
            marginBottom: 3,
            color: '#8744cf', // Purple text
          }}
        >
          Explore stunning photography and share your own perspectives.
        </Typography>
        <Button
          variant="contained"
          sx={{
            padding: '1rem 2.5rem',
            backgroundColor: '#8744cf', // Purple button
            color: 'white',
            fontSize: '1.1rem',
            borderRadius: '30px',
            '&:hover': {
              backgroundColor: '#7333b8', // Darker purple on hover
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
