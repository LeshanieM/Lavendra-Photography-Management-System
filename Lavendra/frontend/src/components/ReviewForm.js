import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const ReviewForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //validate whether all fields are filled
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

      // Clear form fields
      setName('');
      setEmail('');
      setReviewText('');
      setRating(1);
      setError('');
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleNavigateToUpdate = () => {
    // Navigate to the update-review page
    navigate('/update-review');
  };

  return (
    <div className="review-container">
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
        Write a Review
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Rating:</label>
          <br />
          <select
            className="rating-dropdown"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <br />
        <br />
        <button type="submit" className="button_1">
          Submit Review
        </button>
        <br />
        <br />
        <button
          type="button"
          className="button_1"
          onClick={handleNavigateToUpdate}
        >
          Go to My Reviews
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
