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
import MapComponent from './components/delivery/MapComponent';
import DeliveryPage from './components/delivery/DeliveryPage';
import DeliveryForm from './components/delivery/DeliveryForm';
import CustomerTracking from './components/delivery/CustomerTracking';
import OrderSuccess from './components/delivery/OrderSuccess';

import Team from './scenes/team';
import Contacts from './scenes/contacts';
import Bar from './scenes/bar';
import Form from './scenes/form';
import Line from './scenes/line';
import Pie from './scenes/pie';
import FAQ from './scenes/faq/faq';
import UserInquiriesPage from './components/userInquiriesPage';
import AdminPaymentView from './components/AdminPaymentView';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Log from './pages/SigninScreen';
import Register from './pages/SignupScreen';
import AdminDashboard from './pages/AdminDashboard';
import PhotographerHome from './pages/PhotographerHome';
import UserHome from './pages/UserHome';
import Profile from './pages/Profile';
import AddBlog from './components/AddBlog';
import ViewBlogs from './components/ViewBlogs';
import ManageBlogs from './components/ManageBlogs';
import EditBlog from './components/EditBlog';

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
      <AuthProvider>
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
            <nav
              style={{
                backgroundColor: '#343a40', // Dark background for navbar
                color: 'white',
                boxShadow: '0 4px 2px -2px gray',
                padding: '15px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <button
                  style={{
                    backgroundColor: '#343a40',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                  onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                >
                  <i className="fas fa-bars"></i>
                </button>

                {/* Logo Image in the Navbar */}
                <LinkContainer to="/product">
                  <div>
                    <img
                      src="/images/logo.png"
                      alt="Lavendra Logo"
                      style={{ height: '80px', width: 'auto' }}
                    />
                  </div>
                </LinkContainer>
                <LinkContainer to="/product">
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginLeft: '10px',
                    }}
                  >
                    Lavendra
                  </div>
                </LinkContainer>

                <div>
                  <SearchBox />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link
                      to="/cart"
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        paddingRight: '20px',
                      }}
                    >
                      Cart
                      {cart.cartItems.length > 0 && (
                        <span
                          style={{
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '5px 10px',
                            fontSize: '12px',
                            marginLeft: '5px',
                          }}
                        >
                          {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/inquiryForm"
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        paddingRight: '20px',
                      }}
                    >
                      Inquiry Form
                    </Link>

                    <Link
                      to="/reviews"
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        paddingRight: '20px',
                      }}
                    >
                      Reviews
                    </Link>

                    <Link
                      to="/view-blogs"
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        paddingRight: '20px',
                      }}
                    >
                      Blogs
                    </Link>

                    <Link
                      to="/login"
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                      }}
                    >
                      Login
                    </Link>

                    {userInfo ? (
                      <div style={{ position: 'relative' }}>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            paddingRight: '20px',
                          }}
                        >
                          {userInfo.name}
                        </button>
                        <div
                          style={{
                            position: 'absolute',
                            right: '0',
                            top: '100%',
                            backgroundColor: 'white',
                            color: 'black',
                            boxShadow: '0 4px 2px -2px gray',
                            borderRadius: '4px',
                            width: '150px',
                            display: 'none',
                          }}
                        >
                          <Link
                            to="/orderhistory"
                            style={{
                              display: 'block',
                              padding: '10px',
                              fontSize: '14px',
                              textDecoration: 'none',
                              color: 'black',
                            }}
                          >
                            Order History
                          </Link>
                          <hr />
                          <button
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '10px',
                              fontSize: '14px',
                              textDecoration: 'none',
                              color: 'red',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                            onClick={signoutHandler}
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to="/signin"
                        style={{
                          color: 'white',
                          textDecoration: 'none',
                        }}
                      >
                        User
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </nav>
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
                  to="/calendar"
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>Calendar</Nav.Link>
                </LinkContainer>
              </Nav.Item>

              <Nav.Item>
                <LinkContainer
                  to="/track-order"
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>Track My Order</Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item>
                <LinkContainer
                  to="/add-delivery"
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>Add Delivery</Nav.Link>
                </LinkContainer>
              </Nav.Item>

              <Nav.Item>
                <LinkContainer
                  to="/userinquirypage"
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>Inquiry List</Nav.Link>
                </LinkContainer>
              </Nav.Item>

              <Nav.Item>
                <LinkContainer
                  to="/PaymentList"
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>Payment List</Nav.Link>
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
                <Route
                  path="/payment"
                  element={<PaymentMethodScreen />}
                ></Route>
                <Route path="/paymentList" element={<PaymentList />}></Route>
                <Route path="/inquiryForm" element={<InquiryForm />}></Route>
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/admin1" element={<Admin />} />
                <Route path="/home" element={<Home />} />
                <Route path="/custom" element={<BookingForm />} />
                <Route path="/reviews" element={<ReviewDisplay />} />
                <Route path="/addReview" element={<ReviewForm />} />
                <Route path="/update-review" element={<UpdateReviewPage />} />
                <Route path="/Map" element={<MapComponent />} />
                <Route path="/deliveries" element={<DeliveryPage />} />
                <Route path="/add-delivery" element={<DeliveryForm />} />
                <Route path="/track-order" element={<CustomerTracking />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/line" element={<Line />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<PaymentList />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/faq" element={<FAQ />} />
                <Route
                  path="/adminpaymentview"
                  element={<AdminPaymentView />}
                />
                <Route path="/add-blog" element={<AddBlog />} />
                <Route path="/view-blogs" element={<ViewBlogs />} />
                <Route path="/manage-blogs" element={<ManageBlogs />} />
                <Route path="/edit-blog/:id" element={<EditBlog />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Log />} />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute role="admin">
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/photographer/*"
                  element={
                    <PrivateRoute role="photographer">
                      <PhotographerHome />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/user/*"
                  element={
                    <PrivateRoute role="user">
                      <UserHome />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/inquiryDashboard"
                  element={<InquiryDashboard />}
                ></Route>
                <Route
                  path="/userinquirypage"
                  element={<UserInquiriesPage />}
                ></Route>
                <Route
                  path="/adminpaymentview"
                  element={<AdminPaymentView />}
                ></Route>
                <Route
                  path="/orderhistory"
                  element={<OrderHistoryScreen />}
                ></Route>
                <Route
                  path="/create-package"
                  element={<CreatePackageScreen />}
                />{' '}
                {/* Add  route */}
                <Route path="/" element={<HeroPage />} />
              </Routes>
            </Container>
          </main>
          <footer>
            <div className="text-center"> All rights reserved</div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
