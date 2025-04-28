import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';  // Import Button from react-bootstrap
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import '../index.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  const navigate = useNavigate();  // Initialize the navigate function

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const handleCustomizeClick = () => {
    navigate('/custom');  // Navigate to /custom when the button is clicked
  };

  return (
    <div className="py-3">
      <Helmet>
        <title>Lavendra</title>
      </Helmet>
      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: '1rem',
              marginBottom: '1rem',
            }}
          >
            Featured Packages
          </h1>
          <Button variant="primary" style={{ marginLeft: '10px' }} onClick={handleCustomizeClick}>
            Customize Packages
          </Button>
        </div>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default HomeScreen;
