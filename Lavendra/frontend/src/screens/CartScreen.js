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
import { FaTrash, FaMinusCircle, FaPlusCircle } from 'react-icons/fa'; // Use icons for better visuals

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
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>

      <h1
        className="text-center my-4"
        style={{ color: 'black', fontSize: '2.5rem', marginBottom: '20px' }}
      >
        Shopping Cart
      </h1>
      <Row>
        {/* Left Side - Cart Items */}
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox variant="info">
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item
                  key={item._id}
                  className="border-0 shadow-sm rounded mb-3"
                >
                  <Row className="align-items-center">
                    {/* Product Image and Name */}
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      />
                      <Link to={`/product/${item.slug}`} className="text-dark">
                        <h5>{item.name}</h5>
                      </Link>
                    </Col>

                    {/* Quantity Controls */}
                    <Col
                      md={3}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <FaMinusCircle />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <FaPlusCircle />
                      </Button>
                    </Col>

                    {/* Price */}
                    <Col md={3} className="text-center">
                      <h5>LKR {item.price}</h5>
                    </Col>

                    {/* Remove Item Button */}
                    <Col md={2} className="text-center">
                      <Button
                        variant="danger"
                        onClick={() => removeItemHandler(item)}
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
          <Card className="shadow-sm rounded mb-3">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0">
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items): LKR{' '}
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item className="border-0">
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
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
