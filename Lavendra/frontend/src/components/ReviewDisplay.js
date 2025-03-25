import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';

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
    <div className="review-display-container" style={{ padding: '2rem' }}>
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
      <div
        className="search-bar"
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Search by name or review"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            fontSize: '1rem',
            width: '300px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            transition: 'border-color 0.3s ease',
          }}
        />
      </div>

      {/* Filters */}
      <div
        className="filters"
        style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ fontSize: '1.2rem', color: '#3057cc' }}>Filters</h3>
        <select
          onChange={handleRatingFilter}
          value={ratingFilter}
          style={{
            padding: '10px',
            fontSize: '1rem',
            border: '2px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'border-color 0.3s ease',
          }}
        >
          <option value="">All Ratings</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>

        <button
          onClick={clearFilters}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#3057cc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            width: '150px',
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Display Reviews */}
      {filteredReviews.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No reviews found.</p>
      ) : (
        <div
          className="review-list"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            padding: '20px',
          }}
        >
          {filteredReviews.map((review) => (
            <div
              key={review._id}
              className="review-card"
              style={{
                border: '1px solid #ccc',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <h3 style={{ color: '#3057cc', marginBottom: '0.8rem' }}>
                {review.name}
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#555',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                }}
              >
                {review.reviewText}
              </p>

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
