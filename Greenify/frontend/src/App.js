import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import './index.css';

/*************  ✨ Codeium Command ⭐  *************/
/**
 * The main App component, which wraps the entire site in a BrowserRouter
 * and lays out the header, main content, and footer.
 *
 * The header contains a dark navbar with a link to the home page.
 *
 * The main content is a container that holds the routes.
 *
 * The footer is a simple div that says "All rights reserved".
 *
 * @returns {React.ReactElement} The rendered App component.
 */
/******  8e88628a-c5e4-4f5c-a465-2dad71b617f2  *******/
function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header className="paddingSet">
          <Navbar bg="dark" variant="dark">
            <Container className="mt-3">
              <LinkContainer to="/">
                <Navbar.Brand>Greenify</Navbar.Brand>
              </LinkContainer>
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
