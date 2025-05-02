import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Rating,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const ReviewDisplay = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const navigate = useNavigate();

  // Fetching reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reviews');
        setReviews(response.data.reviews);
        setFilteredReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterReviews(e.target.value, ratingFilter);
  };

  const handleRatingFilter = (e) => {
    setRatingFilter(e.target.value);
    filterReviews(searchQuery, e.target.value);
  };

  // Filtering reviews
  const filterReviews = (query, rating) => {
    const filtered = reviews.filter((review) => {
      const matchesSearch =
        review.name.toLowerCase().includes(query.toLowerCase()) ||
        review.reviewText.toLowerCase().includes(query.toLowerCase());
      const matchesRating = rating ? review.rating === parseInt(rating) : true;
      return matchesSearch && matchesRating;
    });
    setFilteredReviews(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter('');
    setFilteredReviews(reviews);
  };

  // Navigation when click on buttons
  const handleAddReviewClick = () => {
    navigate('/addReview');
  };

  const handleGoToReview = () => {
    navigate('/update-review');
  };

  return (
    <Container sx={{ py: 2 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 600, letterSpacing: 1 }}
      >
        Reviews
      </Typography>

      {/* Filters Section*/}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <FilterListIcon sx={{ color: '#6a1b9a' }} />
            <Typography variant="h6" color="#6a1b9a">
              Filters
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rating</InputLabel>
              <Select
                value={ratingFilter}
                onChange={handleRatingFilter}
                label="Rating"
              >
                <MenuItem value="">All Ratings</MenuItem>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating} Star{rating > 1 ? 's' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box display="flex" justifyContent="center">
            <TextField
              size="small"
              variant="outlined"
              label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ minWidth: 300 }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#6a1b9a',
                '&:hover': { backgroundColor: '#38006b' },
              }}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Review cards*/}
      {filteredReviews.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No reviews found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredReviews.map((review) => (
            <Grid item key={review._id} xs={12} sm={6} md={4}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="#6a1b9a" gutterBottom>
                    {review.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {review.reviewText}
                  </Typography>
                  <Rating value={review.rating} readOnly />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box
        sx={{
          mt: 5,
          bgcolor: '#f3e5f5',
          py: 3,
          px: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img
            src="/images/review_display_img.png"
            alt="Review Banner"
            style={{
              width: '100%',
              maxWidth: '900px',
              borderRadius: '8px',
            }}
          />
        </Box>

        {/* Review bottom description section*/}
        <Box
          sx={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="#6a1b9a" gutterBottom>
            Did you enjoy your experience with Lavendra Photography? We'd truly
            appreciate it if you could take a moment to share your thoughts and
            help others discover our services!
          </Typography>
          <br />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#6a1b9a',
              '&:hover': { backgroundColor: '#38006b' },
            }}
            onClick={handleAddReviewClick}
          >
            Write a Review
          </Button>
          <br />
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGoToReview}
          >
            Go to My Reviews
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ReviewDisplay;
