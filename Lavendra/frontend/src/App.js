import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CreatePackageScreen from './screens/CreatePackageScreen'; // Import the CreatePackageScreen
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import './index.css';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import AddressScreen from './screens/PhotographyVenueScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import CheckoutForm from './components/CheckoutForm';
import PaymentList from './components/PaymentList';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import InquiryForm from './components/InquiryForm';
import InquiryDashboard from './components/InquiryDashboard';
import Calendar from './Calendar';
import HeroPage from './components/HeroPage';
import Admin from './Admin';
import Home from './components/Home';
import BookingForm from './components/BookingForm';
import UpdateReviewPage from './components/UpdateReviewPage';
import ReviewForm from './components/ReviewForm';
import ReviewDisplay from './components/ReviewDisplay';
const stripePromise = loadStripe(
  'pk_test_51Qt4VIGaVSNorcZ7k77Ea074NYwqQAEED5jVr77L6HL3q0ZhUIQK6kl6eNrKKmDDl2EBB27Box0zSm3seGGuxUnq00zJs87snB'
);

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
  };
  localStorage.removeItem('paymentMethod');

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        {/* Fixed header */}
        <header className="header paddingSet">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container className="mt-3">
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>

              {/* Logo Image in the Navbar */}
              <LinkContainer to="/">
                <Navbar.Brand>
                  <img
                    src="/images/logo.png"
                    alt="Lavendra Logo"
                    style={{ height: '80px', width: 'auto' }}
                  />
                </Navbar.Brand>
              </LinkContainer>
              <LinkContainer to="/">
                <Navbar.Brand>Lavendra</Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  <Link to="/create-package" className="nav-link">
                    Create Package
                  </Link>
                  <Link to="/PaymentList" className="nav-link">
                    Payments
                  </Link>
                  <Link to="/inquiryForm" className="nav-link">
                    Inquiry Form
                  </Link>
                  <Link to="/inquiryDashboard" className="nav-link">
                    Inquiry Dashboard
                  </Link>
                  <Link to="/hero" className="nav-link">
                    heropage
                  </Link>
                  <Link to="/home" className="nav-link">
                    Home
                  </Link>

                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          //sidebar
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>

            <Nav.Item>
              <LinkContainer
                to="/product"
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>Packages</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item>
              <LinkContainer
                to="/calendar"
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>Calendar</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item>
              <LinkContainer
                to="/admin"
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>Admin</Nav.Link>
              </LinkContainer>
            </Nav.Item>

            <Nav.Item>
              <LinkContainer
                to="/custom"
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>customize your Package</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer
                to="/reviews"
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>Reviews display</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer
                to="/addReview"
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>Add Reviews</Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer
                to="/update-review"
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>Update review</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Elements stripe={stripePromise}>
              <Routes>
                <Route path="/CheckoutForm" element={<CheckoutForm />} />
                <Route path="/payments" element={<PaymentList />} />
              </Routes>
            </Elements>
            <Routes>
              <Route path="/hero" element={<HeroPage />} />
              <Route path="/product" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />}></Route>
              <Route path="/shipping" element={<AddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              <Route path="/paymentList" element={<PaymentList />}></Route>
              <Route path="/inquiryForm" element={<InquiryForm />}></Route>
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/home" element={<Home />} />
              <Route path="/custom" element={<BookingForm />} />
              <Route path="/reviews" element={<ReviewDisplay />} />
              <Route path="/addReview" element={<ReviewForm />} />
              <Route path="/update-review" element={<UpdateReviewPage />} />
              <Route
                path="/inquiryDashboard"
                element={<InquiryDashboard />}
              ></Route>
              <Route
                path="/orderhistory"
                element={<OrderHistoryScreen />}
              ></Route>
              <Route path="/create-package" element={<CreatePackageScreen />} />{' '}
              {/* Add this route */}
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center"> All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
