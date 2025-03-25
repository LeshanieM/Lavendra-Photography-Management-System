import React from 'react';
import { 
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
  Paper,
  Divider
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// Purple and white theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6a1b9a', // Deep purple
      light: '#9c4dff',
      dark: '#38006b'
    },
    secondary: {
      main: '#ffffff', // White
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      color: '#6a1b9a'
    },
    h4: {
      fontWeight: 600,
    },
  },
});

const PurpleSection = styled('section')({
  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
  padding: '4rem 0',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(106, 27, 154, 0.1)'
});

function HomePage() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Hero Section */}
      <Box sx={{ 
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
          zIndex: 0,
          clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)'
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
              color='purple'
                variant="h2" 
                component="h1"
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                  mb: 3,
                  position: 'relative'
                }}
              >
                Lavendra Photography
              </Typography>
              
              <Typography 
                variant="h5" 
                component="p"
                gutterBottom
                sx={{ 
                  mb: 4,
                  color: 'text.secondary',
                  position: 'relative'
                }}
              >
                Capturing life's precious moments with elegance and creativity
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', position: 'relative' }}>
                <Button 
                  onClick={() => navigate("/product")}
                  variant="contained" 
                  color="primary"
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 2,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderRadius: '8px'
                  }}
                >
                  Explore Packages
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary"
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 2,
                    borderWidth: 2,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderRadius: '8px'
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{
                position: 'relative',
                height: '400px',
                backgroundImage: 'url(https://images.unsplash.com/photo-1493863641943-9b68992a8d07)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '16px',
                boxShadow: '0 15px 30px rgba(106, 27, 154, 0.2)'
              }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" component="h2" sx={{ 
          fontWeight: 'bold',
          mb: 6,
          textAlign: 'center',
          color: 'primary.main'
        }}>
          Our Services
        </Typography>
        
        <Grid container spacing={4}>
          {[
            {
              title: 'Wedding Photography',
              description: 'Capture your special day with our premium wedding packages including pre-wedding shoots.',
              icon: '💒'
            },
            {
              title: 'Portrait Sessions',
              description: 'Professional studio or outdoor portrait sessions for individuals and families.',
              icon: '📷'
            },
            {
              title: 'Commercial Photography',
              description: 'High-quality product and business photography for brands and e-commerce.',
              icon: '💒'
            },
            {
                title: 'Rental services',
                description: 'High-quality product and business photography for brands and e-commerce.',
                icon: '🛍️'
              },
              {
                title: 'Better payment options',
                description: 'High-quality product and business photography for brands and e-commerce.',
                icon: '🛍️'
              },{
                title: 'Customized packages ',
                description: 'High-quality product and business photography for brands and e-commerce.',
                icon: '📷'
              }
          ].map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper elevation={3} sx={{ 
                p: 4,
                height: '100%',
                borderRadius: '12px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 25px rgba(106, 27, 154, 0.15)'
                }
              }}>
                <Typography variant="h3" sx={{ 
                  fontSize: '2.5rem',
                  mb: 2
                }}>
                  {service.icon}
                </Typography>
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  color: 'primary.main'
                }}>
                  {service.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {service.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonial Section */}
      <PurpleSection>
        <Container maxWidth="md">
          <Typography variant="h3" component="h3" sx={{ 
            fontWeight: 'bold',
            mb: 4,
            textAlign: 'center',
            color: 'white'
          }}>
            Client Testimonials
          </Typography>
          
          <Paper elevation={0} sx={{ 
            p: 4,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.9)'
          }}>
            <Typography variant="body1" sx={{ 
              fontStyle: 'italic',
              fontSize: '1.2rem',
              mb: 2
            }}>
              "Lavendra captured our wedding perfectly. The photos are absolutely stunning and will help us remember this day forever."
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }}>
              — Sarah & Michael
            </Typography>
          </Paper>
        </Container>
      </PurpleSection>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h3" sx={{ 
          fontWeight: 'bold',
          mb: 3,
          color: 'primary.main'
        }}>
          Ready to create beautiful memories?
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={() => navigate("")}
          sx={{ 
            px: 6,
            py: 2,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(106, 27, 154, 0.3)'
          }}
        >
          Get in Touch
        </Button>
      </Container>
    </ThemeProvider>
  );
}

export default HomePage;