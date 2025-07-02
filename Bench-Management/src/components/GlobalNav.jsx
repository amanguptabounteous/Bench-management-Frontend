import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './GlobalNav.css';

function GlobalNavbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setShowNavbar(true); // Always show at top
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false); // Hide on scroll down
      } else {
        setShowNavbar(true); // Show on scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <Navbar
      bg="light"
      expand="lg"
      className={`custom-navbar ${showNavbar ? 'show' : 'hide'}`}
      fixed="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
          <img
            src="https://content.energage.com/company-images/SE89325/SE89325_logo_orig.png"
            alt="Bounteous Logo"
            height="30"
          />
        </Navbar.Brand>
        <Nav className="ms-auto gap-3">
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
