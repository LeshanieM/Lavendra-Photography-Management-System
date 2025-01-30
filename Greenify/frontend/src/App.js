import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import { LinkContainer } from 'react-router-bootstrap';
import './index.css';
import { useContext } from 'react';
import { Store } from './Store';

function App() {

  const { state } = useContext(Store);
  const { cart } = state;


  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header className="paddingSet">
          <Navbar bg="dark" variant="dark">
            <Container className="mt-3">
              <LinkContainer to="/">
                <Navbar.Brand>Greenify</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.length}
                  </Badge>
                )}
                </Link>
              </Nav>

            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
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
