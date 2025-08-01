import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// 1. Import the useAuth hook to access the user's role and logout function.
import { useAuth } from '../context/authContext';
import './GlobalNav.css';

function GlobalNavbar() {
  // UI state for the navbar's hide/show scroll effect
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 2. Get the current user and the logout function from the AuthContext.
  const { user, logout } = useAuth();

  // This useEffect handles the UI behavior of the navbar on scroll. No changes needed here.
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
      className={`custom-navbar ${showNavbar ? 'show' : 'hide'} navbar-light`}
      fixed="top"
    >
      <Container>
        {/* 3. Make the logo link dynamic. It now points to the user's default dashboard. */}
        <Navbar.Brand as={Link} to={user?.role === 'admin' ? '/home' : '/assessmentcomp'} className="d-flex align-items-center">
          <img
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI4LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkFydHdvcmsiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1NDM1LjMgNTA5LjIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU0MzUuMyA1MDkuMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8Zz4KCTxnPgoJCTxnPgoJCQk8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjM3MTkuOSw0MzUuNyAzNjA0LjgsMTAyIDM1MzUsMzAzLjUgMzQ2Ni4yLDI5MS43IDM1NjcuNSwxMy42IDM2NDEuNSwxMy42IDM3OTUuMyw0MzUuNyAJCQkiLz4KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTM5NTUuNCw0NDMuNGMtOTUuOSwwLTE2NS42LTY5LjktMTY1LjYtMTY2LjJjMC05NC43LDcwLjktMTY2LjIsMTY1LTE2Ni4yYzUwLjIsMCw4NS4yLDIxLjEsMTA1LjYsMzguOQoJCQkJbDIuMiwxLjlsLTIyLjcsNjMuNGwtNC44LTQuNmMtMTAuMi05LjgtMzguMi0zMi41LTc4LjUtMzIuNWMtNTQuOCwwLTkzLjEsNDAuNy05My4xLDk5LjFjMCw1Ny4xLDQxLjEsMTAwLjIsOTUuNSwxMDAuMgoJCQkJYzI3LjIsMCw1My4yLTExLjEsNzcuNC0zMy4xbDQuOS00LjRsMjEuNCw2Mi4xbC0yLjIsMS45QzQwNDcuMSw0MTUuOCw0MDEwLDQ0My40LDM5NTUuNCw0NDMuNHoiLz4KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyMzcuNSw0NDMuNGMtOTUuOSwwLTE2NS42LTY5LjktMTY1LjYtMTY2LjJjMC05NC43LDcwLjktMTY2LjIsMTY1LTE2Ni4yYzUwLjIsMCw4NS4yLDIxLjEsMTA1LjYsMzguOQoJCQkJbDIuMiwxLjlsLTIyLjcsNjMuNGwtNC44LTQuNmMtMTAuMi05LjgtMzguMi0zMi41LTc4LjUtMzIuNWMtNTQuOCwwLTkzLjEsNDAuNy05My4xLDk5LjFjMCw1Ny4xLDQxLjEsMTAwLjIsOTUuNSwxMDAuMgoJCQkJYzI3LjIsMCw1My4yLTExLjEsNzcuNC0zMy4xbDQuOS00LjRsMjEuNCw2Mi4xbC0yLjIsMS45QzQzMjkuMSw0MTUuOCw0MjkyLDQ0My40LDQyMzcuNSw0NDMuNHoiLz4KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ1MjEuMyw0NDMuNGMtOTcsMC0xNjcuNC02OS42LTE2Ny40LTE2NS42YzAtOTUuMSw3MS45LTE2Ni44LDE2Ny40LTE2Ni44Yzk3LjMsMCwxNjcuOSw2OS45LDE2Ny45LDE2Ni4yCgkJCQlDNDY4OS4yLDM3Miw0NjE3LDQ0My40LDQ1MjEuMyw0NDMuNHogTTQ1MjEuMywxNzdjLTU0LjMsMC05My43LDQyLjQtOTMuNywxMDAuOGMwLDU4LjcsMzguNSw5OS42LDkzLjcsOTkuNgoJCQkJYzU1LDAsOTQuOS00Mi4yLDk0LjktMTAwLjJTNDU3Ni4zLDE3Nyw0NTIxLjMsMTc3eiIvPgoJCQk8cmVjdCB4PSI0NzI2LjMiIGNsYXNzPSJzdDAiIHdpZHRoPSI3MyIgaGVpZ2h0PSI0MzUuNyIvPgoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDg1NCw0MzUuN3YtMzE3aDczdjMxN0g0ODU0eiBNNDg5MC4yLDkxLjRjLTI0LjksMC00NC41LTE5LjUtNDQuNS00NC41czE5LjUtNDQuNSw0NC41LTQ0LjUKCQkJCWMyNC45LDAsNDQuNSwxOS41LDQ0LjUsNDQuNVM0OTE1LjEsOTEuNCw0ODkwLjIsOTEuNHoiLz4KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUwODguMyw0MzkuOWMtOTEuMiwwLTEwMS44LTc0LjMtMTAxLjgtMTMwLjFWMTgwLjZoLTM0LjN2LTYxLjhoMzQuM1Y1NC40aDcyLjR2NjQuNGg2Mi42djYxLjhoLTYyLjZ2MTM5LjIKCQkJCWMwLDQ1LjgsMTYuMiw1NC4yLDQ4LjIsNTQuMmM1LjEsMCwxMi0wLjYsMTIuMS0wLjZsNC43LTAuNHY2My43bC0zLjQsMC43QzUxMjAsNDM3LjUsNTEwOC42LDQzOS45LDUwODguMyw0MzkuOXoiLz4KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUyOTIuNyw0NDMuNGMtOTYuOCwwLTE2NC40LTY3LjktMTY0LjQtMTY1YzAtOTUuNCw2Ni40LTE2Ny40LDE1NC40LTE2Ny40Yzk0LjEsMCwxNTIuNiw2My41LDE1Mi42LDE2NS42CgkJCQljMCw1LjMsMCwxMC45LTAuNiwxNi40bC0wLjQsMy44aC0yMzEuNWMzLjEsNDkuMSwzOS4yLDgxLjcsOTEuMiw4MS43YzQ3LjksMCw3Mi45LTI4LjgsODEuNS00MS4ybDIuNi0zLjdsNDkuMiwzNi45bC0xLjksMy4zCgkJCQlDNTQxOC41LDM4NS41LDUzODAuNCw0NDMuNCw1MjkyLjcsNDQzLjR6IE01MzYwLjcsMjQ0Yy0zLjktNDMtMzMuOS03MC41LTc3LjUtNzAuNWMtNDEuNSwwLTcyLjMsMjguMS03Ny45LDcwLjVINTM2MC43eiIvPgoJCTwvZz4KCQk8Zz4KCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTMyOTkuOCw1MDkuMmMtNzQuMSwwLTExOS41LTMzLjUtMTQ0LjUtNjEuNmMtMzAuNS0zNC4yLTQ4LjEtNzkuNS00OC4xLTEyNAoJCQkJYzAtMTIxLjUsMTE5LjctMjA2LjIsMjI3LjItMjA2LjJjMTkyLjEsMCwzMDcuMSwxNTcuMSwzNTAuMSwyMTUuOGwzNS4zLDEwMi41Yy0xLjYtMi41LTE2NS40LTI1My40LTM4MS43LTI1My40CgkJCQljLTk5LjQsMC0xNTguOCw2OS41LTE1OC44LDEzNi43YzAsNjIuNCwzNy43LDEyNS40LDEyMiwxMjUuNGM5NS4xLDAsMTM5LTg0LjMsMTY2LjYtMTU3LjdsMS4zLTMuM2w2OC42LDExLjhsLTEuNiw0LjgKCQkJCUMzNDg4LjgsNDM4LjgsMzQwOS4yLDUwOS4yLDMyOTkuOCw1MDkuMnoiLz4KCQk8L2c+Cgk8L2c+Cgk8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjI5NjIuMSwzMzkuMSAyOTA1LjMsMjgyLjMgMjk2Mi4xLDIyNS41IDI5MjkuMiwxOTIuNSAyODcyLjMsMjQ5LjMgMjgxNS41LDE5Mi41IDI3ODIuNSwyMjUuNSAKCQkyODM5LjMsMjgyLjMgMjc4Mi41LDMzOS4xIDI4MTUuNSwzNzIuMSAyODcyLjMsMzE1LjMgMjkyOS4xLDM3Mi4xIAkiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMzU4LjksMjk2LjNjMCwyMS45LDE3LjgsMzkuNywzOS42LDM5LjdoNi4xdjEwMy44bC0zLjksMC4xYy0zLjksMC4xLTYuOSwwLjItOSwwLjIKCQljLTIyLjksMC00NC44LTUuNC02NS4xLTE2Yy0yMC4zLTEwLjYtMzYuOC0yNS4zLTQ5LjEtNDMuNWMtMTUuNS0yMy4zLTIzLjQtNTQuNS0yMy40LTkyLjhWODBoMTAzLjNsLTAuNyw3Mi41aDQ3djEwMmgtNDUuNAoJCUwxMzU4LjksMjk2LjMgTTQ3My4yLDE0My41YzgyLjgsMCwxNTAuMSw2Ny4zLDE1MC4xLDE1MC4xUzU1Niw0NDMuNyw0NzMuMiw0NDMuN3MtMTUwLjEtNjcuMy0xNTAuMS0xNTAuMQoJCUMzMjMuMSwyMTAuOCwzOTAuNSwxNDMuNSw0NzMuMiwxNDMuNSBNNDczLjIsMjQzYy0yNy45LDAtNTAuNiwyMi43LTUwLjYsNTAuNnMyMi43LDUwLjYsNTAuNiw1MC42YzI3LjksMCw1MC42LTIyLjcsNTAuNi01MC42CgkJUzUwMS4xLDI0Myw0NzMuMiwyNDN6IE0wLDI5My4yVjEzLjloOTguMnYxMzguM2gwLjFjMTYuNi02LjEsMzQtOS4yLDUxLjgtOS4yYzgyLjgsMCwxNTAuMSw2Ny4zLDE1MC4xLDE1MC4xCgkJcy02Ny4zLDE1MC4xLTE1MC4xLDE1MC4xQzY3LjMsNDQzLjMsMCwzNzUuOSwwLDI5My4yIE0xNTAuMSwyNDIuNmMtMjcuOSwwLTUwLjYsMjIuNy01MC42LDUwLjZzMjIuNyw1MC42LDUwLjYsNTAuNgoJCXM1MC42LTIyLjcsNTAuNi01MC42QzIwMC43LDI2NS4zLDE3OCwyNDIuNiwxNTAuMSwyNDIuNnogTTY0OS4xLDMxMC4zYzAsNzQuOCw2MC45LDEzNS43LDEzNS43LDEzNS43czEzNS43LTYwLjksMTM1LjctMTM1LjcKCQlWMTU4LjVIODE3LjZsMC4xLDE1Ny43YzAsMTguMi0xNC44LDMyLjktMzIuOSwzMi45Yy0xOC4yLDAtMzIuOS0xNC44LTMyLjktMzIuOVYxNTguNUg2NDlMNjQ5LjEsMzEwLjMgTTIwNjAuMywyOTMuNgoJCWMwLDgyLjgtNjcuMywxNTAuMS0xNTAuMSwxNTAuMXMtMTUwLjEtNjcuMy0xNTAuMS0xNTAuMXM2Ny4zLTE1MC4xLDE1MC4xLTE1MC4xUzIwNjAuMywyMTAuOCwyMDYwLjMsMjkzLjZ6IE0xOTYwLjgsMjkzLjYKCQljMC0yNy45LTIyLjctNTAuNi01MC42LTUwLjZjLTI3LjksMC01MC42LDIyLjctNTAuNiw1MC42czIyLjcsNTAuNiw1MC42LDUwLjZjMTMuOSwwLDI2LjYtNS43LDM1LjgtMTQuOAoJCUMxOTU1LjEsMzIwLjIsMTk2MC44LDMwNy41LDE5NjAuOCwyOTMuNnogTTIyNTguMywzMTAuMmMwLDE4LjItMTQuOCwzMi45LTMyLjksMzIuOWMtMTguMiwwLTMyLjktMTQuOC0zMi45LTMyLjlWMTUyLjVoLTEwMi45djE0OQoJCWwwLjEsMi43YzAsNzQuOCw2MC45LDEzNS43LDEzNS43LDEzNS43czEzNS43LTYwLjksMTM1LjctMTM1LjdWMTUyLjRoLTEwMi45TDIyNTguMywzMTAuMiBNMTA4NC43LDE0Ni4zCgkJYy03NC44LDAtMTM1LjcsNjAuOS0xMzUuNywxMzUuN3YxNTQuNGgxMDIuOWwtMC4xLTE2MC4zYzAtMTguMiwxNC44LTMyLjksMzIuOS0zMi45YzE4LjIsMCwzMi45LDE0LjgsMzIuOSwzMi45djE2MC4zaDEwMi45CgkJbC0wLjEtMTU0LjRDMTIyMC40LDIwNy4yLDExNTkuNSwxNDYuMywxMDg0LjcsMTQ2LjMgTTI1OTIsMjg1LjRjLTEzLjQtMTQtMzMuOC0yMy44LTYwLjQtMjkuMWMtOS4zLTIuMS0xNi43LTMuOC0yMi40LTUuMQoJCWMtNS4yLTEuMi05LTIuNi0xMS41LTQuMWMtMi44LTEuNi0zLjQtMi44LTMuNi0zLjFjLTAuNC0wLjgtMC44LTIuNC0wLjgtNS4zYzAtNC4xLDEuOC03LjEsNS42LTkuNmM0LjUtMi45LDEwLjYtNC4zLDE4LjEtNC4zCgkJYzE1LjYsMCwzMS44LDQuMyw0OC4yLDEyLjhsNC42LDIuNGwzNi41LTcwLjZsLTUuMi0yLjJjLTI4LTExLjYtNTcuNC0xNy40LTg3LjItMTcuNGMtMTguMywwLTM1LjIsMi4zLTUwLjMsNi45CgkJYy0xNS4yLDQuNi0yOC40LDExLjQtMzkuMiwyMGMtMTAuOSw4LjctMTkuNCwxOS41LTI1LjIsMzIuMWMtNS44LDEyLjUtOC43LDI2LjctOC43LDQyLjJjMCwyMS42LDYuMywzOSwxOC44LDUxLjQKCQljMTIuNCwxMi40LDMzLjEsMjEuNCw2My4zLDI3LjVjOC40LDEuNywxNS4zLDMuMywyMC41LDQuOGM0LjgsMS40LDguNCwyLjksMTAuNiw0LjVjMS44LDEuMywzLjEsMi42LDMuNSwzLjhjMC42LDEuNywxLDMuOSwxLDYuNwoJCWMwLDQuMS0xLjksNy40LTYsMTAuMmMtNC42LDMuMi0xMC43LDQuOC0xOC4yLDQuOGMtMjIuMiwwLTQ2LjMtOC43LTcxLjQtMjUuOWwtNC44LTMuM2wtMzksNzUuN2w0LjIsMi41CgkJYzM1LjQsMjAuNyw3MS45LDMxLjIsMTA4LjUsMzEuMmMxOSwwLDM2LjctMi40LDUyLjYtNy4yYzE2LTQuOCwzMC0xMS43LDQxLjQtMjAuNWMxMS42LTguOSwyMC44LTIwLDI3LjMtMzMKCQljNi41LTEzLjEsOS44LTI3LjksOS44LTQ0LjFDMjYxMi41LDMxNy45LDI2MDUuNiwyOTkuNiwyNTkyLDI4NS40IE0xNzMyLjYsMzI4aC0xODVjMS44LDIyLDE5LDMyLjQsMzguNywzMi40CgkJYzE1LjYsMCwyOS4xLTYuOCwzNS4yLTE4LjlsOTEuNCwzMi42Yy0yNi43LDQxLjgtNzMuMiw2OS43LTEyNi41LDY5LjdjLTgzLDAtMTUwLjMtNjcuMy0xNTAuMy0xNTAuM3M2Ny4zLTE1MC4zLDE1MC4zLTE1MC4zCgkJczE1MC4zLDY3LjMsMTUwLjMsMTUwLjNDMTczNi43LDMwNS40LDE3MzUuMiwzMTYuOSwxNzMyLjYsMzI4eiBNMTYyNy44LDI2Mi41bC0wLjMtMi42Yy0xLjgtMTguOC0xOC40LTMxLjQtNDEuMi0zMS40CgkJYy0yMi44LDAtMzkuNCwxMi42LTQxLjIsMzEuNGwtMC4zLDIuNkgxNjI3Ljh6Ii8+CjwvZz4KPC9zdmc+Cg=="
            alt="Bounteous Logo"
            height="30"
            className="logo-img"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="custom-toggler">
          <FontAwesomeIcon icon={faBars} color="white" />
        </Navbar.Toggle>

        {/* Collapsible links */}
        <Navbar.Collapse id="responsive-navbar-nav" className="bg-navbar" data-bs-theme="dark">
          <Nav className="ms-auto gap-3">

            {/* 4. Conditionally render links based on user role. */}

            {/* Admin-only links */}
            {user?.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/manage-users" className="gradient-hover">
                  Admin Manage
                </Nav.Link>
                <Nav.Link as={Link} to="/bench-report" className="gradient-hover">
                  Generate Report
                </Nav.Link>
              </>
            )}

            {/* Links for both Admin and Trainer */}
            {(user?.role === 'admin' || user?.role === 'trainer') && (
              <Nav.Link as={Link} to="/assessmentcomp" className="gradient-hover">
                Assessment
              </Nav.Link>
            )}

            {/* Logout link is always visible if the user is logged in */}
            {user && (
              <Nav.Link onClick={logout} className="gradient-hover">
                Log Out
              </Nav.Link>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default GlobalNavbar;