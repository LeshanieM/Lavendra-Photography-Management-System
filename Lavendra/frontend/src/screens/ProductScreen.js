import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../components/Rating';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Package is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="product-screen">
      <Row>
        <Col md={6}>
          <img
            className="img-large rounded shadow-sm"
            src={product.image}
            alt={product.name}
          />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush" className="shadow-sm rounded">
            <ListGroup.Item className="product-header">
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1 className="product-title">{product.name}</h1>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              />
            </ListGroup.Item>

            <ListGroup.Item className="price-item">
              <span className="price-label">Price:</span>
              <span className="price-value">{product.price} LKR</span>
            </ListGroup.Item>

            <ListGroup.Item className="description-item">
              <h5 className="description-title">Description:</h5>
              <p className="description-text">{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm rounded">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col className="price-label">Price:</Col>
                    <Col className="price-value">{product.price} LKR</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success" pill>Available</Badge>
                      ) : (
                        <Badge bg="danger" pill>Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button 
                        onClick={addToCartHandler} 
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .product-screen {
          padding: 2rem 0;
        }
        
        .img-large {
          max-width: 100%;
          height: auto;
          object-fit: cover;
        }
        
        .product-header {
          background-color: #f8f9fa;
        }
        
        .product-title {
          color: #4a0072;
          font-size: 1.8rem;
          font-weight: bold;
        }
        
        .price-item {
          font-size: 1.2rem;
          padding: 1rem 0;
        }
        
        .price-label {
          font-weight: 600;
          color: #6a1b9a;
        }
        
        .price-value {
          font-weight: bold;
          color: #4a0072;
        }
        
        .description-item {
          padding: 1rem 0;
        }
        
        .description-title {
          color: #6a1b9a;
          margin-bottom: 0.5rem;
        }
        
        .description-text {
          color: #555;
          line-height: 1.6;
        }
        
        .add-to-cart-btn {
          background-color: #6a1b9a;
          border-color: #6a1b9a;
          padding: 0.75rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
          color: #fff;
        }
        
        .add-to-cart-btn:hover {
          background-color: #7b1fa2;
          border-color: #7b1fa2;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(123, 31, 162, 0.3);
           color: #000;
        }
        
        .add-to-cart-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 3px rgba(123, 31, 162, 0.3);
        }
      `}</style>
    </div>
  );
}

export default ProductScreen;