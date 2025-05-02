import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  IconButton,
  Grid
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import { useNavigate } from 'react-router-dom';

const ContactUsPage = () => {
  const navigate = useNavigate();

  const contactDetails = [
    {
      icon: <Email sx={{ color: '#6a1b9a' }} />,
      label: 'lavendraphotography@gmail.com'
    },
    {
      icon: <Phone sx={{ color: '#6a1b9a' }} />,
      label: '+94 71 123 4567'
    },
    {
      icon: <LocationOn sx={{ color: '#6a1b9a' }} />,
      label: 'No. 45, Main Street, Colombo, Sri Lanka'
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <InstagramIcon />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <YouTubeIcon />, url: 'https://youtube.com', label: 'YouTube' },
    { icon: <XIcon />, url: 'https://x.com', label: 'X (Twitter)' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
        px: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 1000,
          width: '100%',
          p: 4,
          borderRadius: 4,
          backgroundColor: '#ffffff'
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <img
              src="/images/contact-image.jpg"
              alt="Contact Lavendra Photography"
              style={{ width: '100%', borderRadius: 12 }}
            />
          </Grid>

          {/* Information Section */}
          <Grid item xs={12} md={6} textAlign="center">
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#6a1b9a' }}
            >
              Get in Touch
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', mb: 4 }}>
              We'd love to hear from you. Reach out to us via the following options.
            </Typography>

            {/* Contact Details */}
            <Stack spacing={2} sx={{ mb: 4 }}>
              {contactDetails.map((detail, index) => (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                  key={index}
                >
                  {detail.icon}
                  <Typography variant="body1">{detail.label}</Typography>
                </Stack>
              ))}
            </Stack>

            {/* Social Media Links */}
            <Typography
              variant="h6"
              sx={{ mb: 2, color: '#6a1b9a', fontWeight: 'bold' }}
            >
              Follow Us
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{ color: '#6a1b9a' }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>

            {/* Instruction Message */}
            <Typography variant="body2" sx={{ color: '#777', mb: 2 }}>
              If you have any questions, concerns, or need more information, please fill out our inquiry form. We are happy to assist you!
            </Typography>

            {/* Inquiry Button */}
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/inquiryForm')}
              sx={{
                mt: 2,
                backgroundColor: '#6a1b9a',
                borderRadius: 2,
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(106, 27, 154, 0.3)',
                '&:hover': {
                  backgroundColor: '#4a148c'
                }
              }}
            >
              Inquire Now
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ContactUsPage;
