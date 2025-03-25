import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import '../styles.css';

const ReviewDisplay = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  // Fetch reviews
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

  // Filter reviews based on search and rating filter
  const filterReviews = (query, rating) => {
    let filtered = reviews.filter((review) => {
      const matchesSearch =
        review.name.toLowerCase().includes(query.toLowerCase()) ||
        review.reviewText.toLowerCase().includes(query.toLowerCase());

      const matchesRating = rating ? review.rating === parseInt(rating) : true;

      return matchesSearch && matchesRating;
    });
    setFilteredReviews(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter('');
    setFilteredReviews(reviews);
  };

  return (
    <div className="review-display-container">
      <h1
        style={{
          color: '#000000',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontSize: '2rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Reviews
      </h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or review"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Filters */}
      <div className="filters">
        <h3 className="filter-title">Filters</h3>
        <select
          onChange={handleRatingFilter}
          value={ratingFilter}
          className="filter-dropdown"
        >
          <option value="">All Ratings</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>

        <button onClick={clearFilters} className="clear-filter-btn">
          Clear Filters
        </button>
      </div>

      {/* Display Reviews */}
      {filteredReviews.length === 0 ? (
        <p className="no-reviews">No reviews found.</p>
      ) : (
        <div className="review-list">
          {filteredReviews.map((review) => (
            <div key={review._id} className="review-card">
              <h3 className="review-name">{review.name}</h3>
              <p className="review-text">{review.reviewText}</p>

              {/* Display Rating with Stars */}
              <div className="rating-stars">
                <ReactStars
                  count={5}
                  value={review.rating}
                  size={24}
                  activeColor="#ffd700"
                  edit={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;
