import React, { useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import {
  Button,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Stack
} from '@mui/material';

const UpdateReviewPage = () => {
  const [email, setEmail] = useState('');
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const buttonStyle = {
    backgroundColor: 'white',
    '&:hover': { backgroundColor: '#f0f0f0' },
  };

  // Search reviews by email
  const handleSearchByEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/reviews/email/${email}`);
      if (response.data.reviews && response.data.reviews.length > 0) {
        setReviews(response.data.reviews);
        setSnackbarMessage('Reviews found successfully!');
      } else {
        setReviews([]);
        setSnackbarMessage('No reviews found for this email.');
      }
    } catch (error) {
      setReviews([]);
      setSnackbarMessage('Error fetching reviews. Please try again.');
    } finally {
      setOpenSnackbar(true);
    }
  };

  // Save edited review
  const handleSaveEdit = async () => {
    if (!editReview) return;
    try {
      await axios.put(`http://localhost:5000/reviews/${editReview._id}`, {
        reviewText: editReview.reviewText,
        rating: editReview.rating,
      });
      setReviews(prev =>
        prev.map((r) => (r._id === editReview._id ? editReview : r))
      );
      setEditReview(null);
      setSnackbarMessage('Review updated successfully!');
    } catch (error) {
      setSnackbarMessage('Error updating review. Please try again.');
    } finally {
      setOpenSnackbar(true);
    }
  };

  // Delete a review
  const handleDeleteReview = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/reviews/${id}`);
      setReviews(prev => prev.filter((r) => r._id !== id));
      setSnackbarMessage('Review deleted successfully!');
    } catch (error) {
      setSnackbarMessage('Error deleting review. Please try again.');
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Reviews
      </Typography>

      {/* Search Form */}
      <Box
        component="form"
        onSubmit={handleSearchByEmail}
        sx={{ backgroundColor: '#f8f8f8', padding: 3, borderRadius: 2, mb: 4 }}
      >
        <TextField
          label="Enter Your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#6a1b9a',
            '&:hover': { backgroundColor: '#5e178a' },
          }}
        >
          Search Reviews
        </Button>
      </Box>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <Stack spacing={3}>
          {reviews.map((review) => (
            <Card key={review._id} sx={{ backgroundColor: '#f8f8f8' }}>
              <CardContent>
                {editReview && editReview._id === review._id ? (
                  <>
                    <TextField
                      label="Edit Review Text"
                      value={editReview.reviewText}
                      onChange={(e) =>
                        setEditReview({ ...editReview, reviewText: e.target.value })
                      }
                      required
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Rating</InputLabel>
                      <Select
                        value={editReview.rating}
                        label="Rating"
                        onChange={(e) =>
                          setEditReview({ ...editReview, rating: Number(e.target.value) })
                        }
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <MenuItem key={value} value={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                ) : (
                  <>
                    <Typography variant="subtitle1"><strong>Name:</strong> {review.name}</Typography>
                    <Typography variant="subtitle2"><strong>Email:</strong> {review.email}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}><strong>Review:</strong> {review.reviewText}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}><strong>Rating:</strong> {review.rating}</Typography>
                  </>
                )}
              </CardContent>

              <CardActions>
                {editReview && editReview._id === review._id ? (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FaSave />}
                      onClick={handleSaveEdit}
                      fullWidth
                      sx={buttonStyle}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FaTimes />}
                      onClick={() => setEditReview(null)}
                      fullWidth
                      sx={buttonStyle}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FaEdit />}
                      onClick={() => setEditReview(review)}
                      fullWidth
                      sx={buttonStyle}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<FaTrash />}
                      onClick={() => handleDeleteReview(review._id)}
                      fullWidth
                      sx={buttonStyle}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateReviewPage;
