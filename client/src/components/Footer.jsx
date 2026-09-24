import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from './Logo';
import Icon from './Icons';
import { COMPANY, whatsappLink, mailLink } from '../config';
import { servicePath } from '../utils/paths';
import { useContent } from '../context/ContentContext';
import '../css/home.css';



export default function Footer() {
  const { services } = useContent();
  const appServices = services.filter((s) => s.category === 'app');
  const webServices = services.filter((s) => s.category === 'web');
  const year = new Date().getFullYear();
  const address = COMPANY.offices[0].lines.slice(1).join(', ');
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <Container className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <h2 className="h3 mb-1 text-white">Have an idea? Let's build it together.</h2>
            <p className="mb-0 text-white-75">Free consultation · Clear quote in 24 hours · No obligation</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <a className="btn btn-light btn-lg" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
            <Link className="btn btn-accent btn-lg" to="/contact">Get a free quote</Link>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4">
          <Col lg={4}>
            <Logo light />
            <p className="mt-3 text-white-75">
              WebOnspark Technologies is a web and mobile app development company. We design and
              build fast, secure and SEO-friendly websites, e-commerce stores and apps that help
              growing businesses succeed online.
            </p>

            {/* Icons only, single horizontal line */}
            <ul className="list-unstyled footer-icons">
              <li>
                <a href={mapLink} target="_blank" rel="noopener noreferrer" title={address} aria-label="Location">
                  <Icon name="pin" size={20} />
                </a>
              </li>
              <li>
                <a href={mailLink()} title={COMPANY.email} aria-label="Email">
                  <Icon name="mail" size={20} />
                </a>
              </li>
              <li>
                <a href={`tel:+${COMPANY.phoneRaw}`} title={COMPANY.phoneDisplay} aria-label="Phone">
                  <Icon name="phone" size={20} />
                </a>
              </li>
              <li>
                <span title={COMPANY.hours} aria-label="Working hours" role="img">
                  <Icon name="clock" size={20} />
                </span>
              </li>
            </ul>
          </Col>
          <Col sm={6} lg={2}>
            <h3 className="footer-title">Company</h3>
            <ul className="list-unstyled footer-links">
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy-policy">Privacy policy</Link></li>
            </ul>
          </Col>
          <Col sm={6} lg={2}>
            <h3 className="footer-title">App Development</h3>
            <ul className="list-unstyled footer-links">
              {appServices.map((s) => (
                <li key={s.slug}><Link to={servicePath(s)}>{s.name}</Link></li>
              ))}
            </ul>
          </Col>
          <Col lg={4}>
            <h3 className="footer-title">Website Development</h3>
            <ul className="list-unstyled footer-links two-col">
              {webServices.map((s) => (
                <li key={s.slug}><Link to={servicePath(s)}>{s.name}</Link></li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="footer-bottom">
        <Container className="d-flex flex-column flex-md-row justify-content-between gap-2">
          <span>© {year} {COMPANY.name}. All rights reserved.</span>
          <span>Website & App Development Company in Bengaluru · Tamil Nadu</span>
        </Container>
      </div>
    </footer>
  );
}