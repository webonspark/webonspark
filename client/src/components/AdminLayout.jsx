import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { getAdmin } from '../utils/adminAuth';

/** Wraps every /admin/* page: requires a signed-in admin. Page-to-page nav lives only on the Dashboard. */
export default function AdminLayout({ title, children }) {
  const admin = getAdmin();

  if (!admin) {
    return (
      <section className="section">
        <Container style={{ maxWidth: 480 }} className="text-center">
          <h1 className="h4 mb-2">Sign in required</h1>
          <p className="text-muted mb-4">You need to sign in as an admin to view this page.</p>
          <Link to="/admin" className="btn btn-brand">Go to admin sign in</Link>
        </Container>
      </section>
    );
  }

  return (
    <section className="section admin-area">
      <Container>
        <h1 className="h4 mb-4">{title}</h1>
        {children}
      </Container>
    </section>
  );
}
