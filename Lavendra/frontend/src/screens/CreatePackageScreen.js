// CreatePackageScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

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
      navigate('/packages'); // Redirect to the packages screen
    } catch (err) {
      alert('Error creating package. Please try again.');
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Create Package</title>
      </Helmet>
      <h1 className="my-3">Create Package</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        {/* Slug is a URL friendly name */}
        <Form.Group className="mb-3" controlId="slug">
          <Form.Label>Slug</Form.Label>
          <Form.Control
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </Form.Group>

        {/*1:1 ratio image */}
        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            required
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="countInStock">
          <Form.Label>Count in Stock</Form.Label>
          <Form.Control
            type="number"
            required
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="brand">
          <Form.Label>Photographer</Form.Label>
          <Form.Control
            type="text"
            required
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="rating">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            required
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="numReviews">
          <Form.Label>Number of Reviews</Form.Label>
          <Form.Control
            type="number"
            required
            value={numReviews}
            onChange={(e) => setNumReviews(e.target.value)}
          />
        </Form.Group>

        {/* Description includes number of hours of shooting, no of edited photos, no of locations  */}
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Create Package</Button>
        </div>
      </Form>
    </Container>
  );
}
