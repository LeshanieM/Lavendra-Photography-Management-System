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
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '3rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
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
            style={{
              width: '100%',
              padding: '0.8rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.8rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>
        <div>
          <label>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.8rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
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
            style={{
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease',
              width: '100%',
              padding: '0.8rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
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
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.8rem',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#3057cc',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Submit Review
        </button>
        <br />
        <br />
        <button
          type="button"
          onClick={handleNavigateToUpdate}
          style={{
            width: '100%',
            padding: '0.8rem',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#3057cc',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Go to My Reviews
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
