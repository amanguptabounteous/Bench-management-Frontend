// GlobalNav.jsx
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './GlobalNav.css';

function GlobalNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="https://content.energage.com/company-images/SE89325/SE89325_logo_orig.png"
            alt="Bounteous Logo"
            height="30"
          />
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/assessmentcomp" className="gradient-hover">
            Assessment
          </Nav.Link>
          <Nav.Link as={Link} to="/dashboard" className="gradient-hover">
            Dashboard
          </Nav.Link>
          <Nav.Link href="#logout" className="gradient-hover">
            Log Out
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default GlobalNavbar;
