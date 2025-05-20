import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

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
    navigate('/custom');
  };

  return (
    <div className="py-3">
      <Helmet>
        <title>Lavendra</title>
      </Helmet>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="featured-title">Featured Packages</h1>
          <Button 
            onClick={handleCustomizeClick}
            className="customize-btn"
          >
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

      <style jsx>{`
        .featured-title {
          font-size: 2rem;
          font-weight: bold;
          color: #4a0072;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        
        .customize-btn {
          background-color: #6a1b9a;
          border-color: #6a1b9a;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
          box-shadow: none;
          color: #fff;
        }
        
        .customize-btn:hover {
          background-color: #7b1fa2;
          border-color: #7b1fa2;
          transform: translateY(-2px);
          color:#000;
          box-shadow: 0 4px 8px rgba(123, 31, 162, 0.3);
        }
        
        .customize-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 3px rgba(123, 31, 162, 0.3);
        }
        
        .customize-btn:focus {
          box-shadow: 0 0 0 0.25rem rgba(123, 31, 162, 0.5);
        }
      `}</style>
    </div>
  );
}

export default HomeScreen;