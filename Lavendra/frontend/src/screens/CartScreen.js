import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import { FaTrash, FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { color } from '@mui/system';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div className="py-4">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>

      <h1
        className="text-center mb-4"
        style={{ 
          color: '#4a0072', 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        Shopping Cart
      </h1>
      <Row>
        {/* Left Side - Cart Items */}
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox variant="info">
              Your cart is empty. <Link to="/product" style={{ color: '#6a1b9a', fontWeight: '600' }}>Continue Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item
                  key={item._id}
                  className="border-0 shadow-sm rounded mb-3 p-3"
                  style={{ backgroundColor: '#f9f9f9' }}
                >
                  <Row className="align-items-center">
                    {/* Product Image and Name */}
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                        style={{ maxHeight: '150px', objectFit: 'cover' }}
                      />
                      <Link 
                        to={`/product/${item.slug}`} 
                        style={{ 
                          color: '#4a0072',
                          fontWeight: '600',
                          textDecoration: 'none',
                          ':hover': { textDecoration: 'underline' }
                        }}
                      >
                        <h5 className="mt-2">{item.name}</h5>
                      </Link>
                    </Col>

                    {/* Quantity Controls */}
                    <Col
                      md={3}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateCartHandler(item, item.quantity - 1)}
                        disabled={item.quantity === 1}
                        style={{ 
                          borderColor: '#6a1b9a',
                          color: '#6a1b9a',
                          ':hover': { backgroundColor: '#f3e5f5' }
                        }}
                      >
                        <FaMinusCircle />
                      </Button>
                      <span className="mx-3" style={{ fontSize: '1.2rem', fontWeight: '600' }}>{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateCartHandler(item, item.quantity + 1)}
                        disabled={item.quantity === item.countInStock}
                        style={{ 
                          borderColor: '#6a1b9a',
                          color: '#6a1b9a',
                          ':hover': { backgroundColor: '#f3e5f5' }
                        }}
                      >
                        <FaPlusCircle />
                      </Button>
                    </Col>

                    {/* Price */}
                    <Col md={3} className="text-center">
                      <h5 style={{ color: '#6a1b9a', fontWeight: 'bold' }}>LKR {item.price.toFixed(2)}</h5>
                    </Col>

                    {/* Remove Item Button */}
                    <Col md={2} className="text-center">
                      <Button
                        variant="outline-danger"
                        onClick={() => removeItemHandler(item)}
                        style={{ borderColor: '#dc3545', color: '#dc3545' }}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        {/* Right Side - Cart Summary */}
        <Col md={4}>
          <Card className="shadow-sm rounded mb-3 border-0" style={{ backgroundColor: '#f9f9f9' }}>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0">
                  <h3 style={{ color: '#4a0072' }}>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items): 
                    <br />
                    <span style={{ color: '#6a1b9a', fontWeight: 'bold' }}>
                      LKR {cartItems.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(2)}
                    </span>
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item className="border-0">
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                      style={{
                        backgroundColor: '#6a1b9a',
                        borderColor: '#6a1b9a',
                        fontWeight: '600',
                        padding: '0.75rem',
                        fontSize: '1.1rem',
                        color: '#fff',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        ':hover': {
                          backgroundColor: '#7b1fa2',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(123, 31, 162, 0.3)'
                        },
                        ':active': {
                          transform: 'translateY(0)'
                        }
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}