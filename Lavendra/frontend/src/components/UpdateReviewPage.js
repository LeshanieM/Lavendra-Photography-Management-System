import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // Import delete icon
import '../styles.css';
const UpdateReviewPage = () => {
  const [email, setEmail] = useState('');
  const [review, setReview] = useState(null);
  const [updatedReviewText, setUpdatedReviewText] = useState('');
  const [updatedRating, setUpdatedRating] = useState(1);
  const navigate = useNavigate();

  // Handle search for review by email
  const handleSearchByEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:5000/reviews/email/${email}`
      );

      if (response.data.review) {
        setReview(response.data.review);
        setUpdatedReviewText(response.data.review.reviewText);
        setUpdatedRating(response.data.review.rating);
        alert('Review found successfully!');
      } else {
        alert('Review not found with this email.');
      }
    } catch (error) {
      alert('Error fetching review. Please try again.');
    }
  };

  // Handle update review
  const handleUpdateReview = async (e) => {
    e.preventDefault();

    if (!updatedReviewText || !updatedRating) {
      alert('Review text and rating are required.');
      return;
    }

    const updatedReviewData = {
      reviewText: updatedReviewText,
      rating: updatedRating,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/reviews/email/${email}`,
        updatedReviewData
      );
      alert(response.data.message || 'Review updated successfully!');
    } catch (error) {
      alert('Error updating review. Please try again.');
    }
  };

  // Handle delete with confirm box
  const handleDeleteReview = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this review?'
    );

    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(
        `http://localhost:5000/reviews/email/${email}`
      );
      alert(response.data.message || 'Review deleted successfully!');
      setReview(null);
      setUpdatedReviewText('');
      setUpdatedRating(1);
    } catch (error) {
      alert('Error deleting review. Please try again.');
    }
  };

  return (
    <div className="update-review-page">
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
        My Reviews
      </h1>

      {/* Search Form */}
      <form
        onSubmit={handleSearchByEmail}
        className="my-reviews-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <p id="search-email-sentence">Search your Email here</p>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-field"
          />
        </div>
        <button className="button_1" type="submit">
          Search
        </button>
      </form>

      {/* If a review is found, show it and allow update/delete */}
      {review && (
        <div className="review-details">
          <h2>Your Review</h2>

          <form onSubmit={handleUpdateReview}>
            <div>
              <label>Update Review Text:</label>
              <br />
              <textarea
                value={updatedReviewText}
                onChange={(e) => setUpdatedReviewText(e.target.value)}
                required
                className="updated-review-textarea"
              ></textarea>
            </div>
            <div>
              <label>Update Rating:</label>
              <br />
              <select
                value={updatedRating}
                onChange={(e) => setUpdatedRating(Number(e.target.value))}
                required
                className="rating-dropdown"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>

            <button className="button_1">Update</button>
          </form>

          <button onClick={handleDeleteReview} className="icon-btn ">
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateReviewPage;
