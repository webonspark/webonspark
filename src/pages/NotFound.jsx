import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found | WebOnspark Technologies" description="The page you are looking for could not be found." path="/404" noindex />
      <section className="section text-center" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Container>
          <p className="display-1 fw-bold text-brand mb-0">404</p>
          <h1 className="h3">This page took a wrong turn</h1>
          <p className="text-muted">The link may be broken or the page may have moved.</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Link to="/" className="btn btn-brand">Go home</Link>
            <Link to="/services" className="btn btn-outline-brand">View services</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
