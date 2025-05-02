import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';

const ReviewForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !reviewText || !rating) {
      alert('All fields are required!');
      return;
    }
  
    const reviewData = {
      name,
      email,
      reviewText,
      rating,
    };
  
    try {
      const response = await axios.post(
        'http://localhost:5000/reviews',
        reviewData
      );
  
      alert(response.data.message || 'Review added successfully!');
      setName('');
      setEmail('');
      setReviewText('');
      setRating(1);
      setError('');
  
      navigate('/reviews');
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    }
  };  

  return (
    <Container maxWidth="md" sx={{ py: 1}}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
        Write a Review
      </Typography>

      <Box
        sx={{
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          minHeight: '550px',
        }}
      >
        <Grid container spacing={0}>
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/review_form_img.jpg"
              alt="Review Banner"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Grid>

          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Review"
                  variant="outlined"
                  fullWidth
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel>Rating</InputLabel>
                  <Select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    label="Rating"
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{
                    mb: 2,
                    padding: '0.8rem',
                    backgroundColor: '#6a1b9a',
                    '&:hover': { backgroundColor: '#38006b' },
                  }}
                >
                  Submit Review
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    setName('');
                    setEmail('');
                    setReviewText('');
                    setRating(1);
                    setError('');
                  }}
                  sx={{
                    padding: '0.8rem',
                    borderColor: '#6a1b9a',
                    color: '#6a1b9a',
                    '&:hover': {
                      borderColor: '#38006b',
                      color: '#38006b',
                    },
                  }}
                >
                  Reset
                </Button>
                
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ReviewForm;
