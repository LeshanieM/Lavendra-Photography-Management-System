// src/components/Hero.js
import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #ffffff 0%, #f9f3ff 100%)',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={6}>
          {/* Image Column - Left Side */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '500px',
                height: { xs: '300px', md: '500px' },
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 15px 30px rgba(106, 27, 154, 0.15)',
                backgroundImage: 'url(https://www.nyip.edu/media/zoo/images/top-5-photography-trends-in-2023-for-budding-photographers-1_7ab20070adafbe94d85f51804d9a9bdf.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Grid>

          {/* Content Column - Right Side */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: { xs: 3, md: 4 },
              borderRadius: 2,
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(255,255,255,0.7)'
            }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: '#6a1b9a',
                  lineHeight: 1.2,
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Capture Your World
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  mb: 4,
                  color: '#5a1084',
                  lineHeight: 1.6,
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Discover breathtaking photography and share your unique vision with the world.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  onClick={() => navigate("/home")}
                  variant="contained"
                  sx={{
                    px: 5,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #6a1b9a, #8e44ad)',
                    color: 'white',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(106, 27, 154, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(106, 27, 154, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Begin Exploring
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;