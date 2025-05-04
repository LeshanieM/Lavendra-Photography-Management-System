import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import '../index.css'; // If you want to add any custom styles
import AdminHeader from '../pages/AdminHeader';

export default function CreatePackageScreen() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [brand, setBrand] = useState('');
  const [rating, setRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [description, setDescription] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/products/packages', {
        name,
        slug,
        image,
        price,
        countInStock,
        brand,
        rating,
        numReviews,
        description,
      });
      alert('Package created successfully!');
      navigate('/packages');
    } catch (err) {
      alert('Error creating package. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <Container className="py-4" style={{ maxWidth: '600px' }}>
        <Helmet>
          <title>Add Package</title>
          <meta
            name="description"
            content="Create a unique photography package with Lavendra. Add your details, price, and description, and launch your services to the world."
          />
        </Helmet>
        <h1
          className="text-center"
          style={{ marginTop: '20px', marginBottom: '30px', fontSize: '2rem' }}
        >
          Create Package
        </h1>
        <Form
          onSubmit={submitHandler}
          className="bg-light p-4 rounded shadow-sm"
        >
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter package name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Enter URL-friendly name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter image URL"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count in Stock</Form.Label>
            <Form.Control
              type="number"
              required
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              placeholder="Enter stock count"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Photographer</Form.Label>
            <Form.Control
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter photographer name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="rating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              required
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Enter rating"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="numReviews">
            <Form.Label>Number of Reviews</Form.Label>
            <Form.Control
              type="number"
              required
              value={numReviews}
              onChange={(e) => setNumReviews(e.target.value)}
              placeholder="Enter number of reviews"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter package description"
            />
          </Form.Group>

          <Button type="submit" variant="primary" block>
            Create Package
          </Button>
        </Form>
      </Container>
    </div>
  );
}
