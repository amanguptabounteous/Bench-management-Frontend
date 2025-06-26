// GlobalNav.jsx
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function GlobalNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Bounteous</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="#logout">Log Out</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default GlobalNavbar;
