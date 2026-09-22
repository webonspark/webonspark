import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import logo from '../images/webonspark_logo.svg';
import { getAdmin, adminLogout } from '../utils/adminAuth';

/** Minimal top bar for /admin/* pages: logo left, sign in/out on the right. No site nav, no footer. */
export default function AdminHeader() {
  const admin = getAdmin();
  const navigate = useNavigate();

  const onLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  return (
    <header className="site-header admin-top-header">
      <Container className="d-flex justify-content-between align-items-center py-2">
        <Link to={admin ? '/admin/dashboard' : '/admin'} aria-label="WebOnspark admin" className="d-inline-flex">
          <img src={logo} alt="WebOnspark Technologies" className="site-logo" height="44" />
        </Link>
        <div className="d-flex align-items-center gap-3">
          {admin ? (
            <>
              <span className="text-muted small d-none d-sm-inline">Signed in as {admin.email}</span>
              <button type="button" className="btn btn-sm btn-outline-brand" onClick={onLogout}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/admin" className="btn btn-sm btn-brand">Sign in</Link>
          )}
        </div>
      </Container>
    </header>
  );
}
