import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Icon from './Icons';
import { appServices, webServices, servicePath } from '../data/services';
import { getUser, logout } from '../utils/auth';

// 👇 NEW LOGO: put your file at src/assets/logo.png (or .svg / .webp) and update the name here
import logo from '../images/webonspark_logo.svg'
import '../css/home.css';

export default function Header() {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => setExpanded(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const sync = () => setUser(getUser());
    sync();
    window.addEventListener('wos-auth', sync);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wos-auth', sync);
    };
  }, []);

  const servicesActive = pathname.startsWith('/services');

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Navbar expand="lg" expanded={expanded} onToggle={setExpanded} className="py-2">
        <Container>
          <Navbar.Brand as={Link} to="/" aria-label="WebOnspark Technologies home">
            {/* 👇 NEW LOGO (replaces <Logo />) */}
            <img
              src={logo}
              alt="WebOnspark Technologies"
              className="site-logo"
              height="44"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" aria-label="Toggle navigation" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto align-items-lg-center gap-lg-1">
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/about">About</Nav.Link>

              <NavDropdown
                id="services-menu"
                className={`mega nav-services ${servicesActive ? 'active' : ''}`}
                title={
                  <span className="services-title">
                    Services <span className="blink-dot" aria-hidden="true" />
                  </span>
                }
              >
                <div className="mega-inner">
                  <div className="mega-col">
                    <Link className="mega-head" to="/services/app-development">
                      <Icon name="mobile" size={18} /> App Development
                    </Link>
                    {appServices.map((s) => (
                      <NavDropdown.Item as={Link} key={s.slug} to={servicePath(s)}>
                        {s.name}
                      </NavDropdown.Item>
                    ))}
                  </div>
                  <div className="mega-col mega-col-wide">
                    <Link className="mega-head" to="/services/website-development">
                      <Icon name="globe" size={18} /> Website Development
                    </Link>
                    <div className="mega-grid">
                      {webServices.map((s) => (
                        <NavDropdown.Item as={Link} key={s.slug} to={servicePath(s)}>
                          {s.name}
                        </NavDropdown.Item>
                      ))}
                    </div>
                  </div>
                  <div className="mega-foot">
                    <Link to="/services">View all services →</Link>
                  </div>
                </div>
              </NavDropdown>

              <Nav.Link as={NavLink} to="/careers">Careers</Nav.Link>
              <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
              <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>

              {user ? (
                <div className="d-flex align-items-center gap-2 ms-lg-2 mt-2 mt-lg-0">
                  <span className="user-chip" title={user.email}>
                    <Icon name="user" size={16} /> Hi, {user.name.split(' ')[0]}
                  </span>
                  <button type="button" className="btn btn-sm btn-outline-brand" onClick={logout}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-brand ms-lg-2 mt-2 mt-lg-0">
                  <Icon name="user" size={16} /> Login
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}