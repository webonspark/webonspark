import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Seo from '../components/Seo';
import Logo from '../components/Logo';
import { isEmail } from '../utils/submitForm';
import { API_URL } from '../config';
import { getAdmin, saveAdmin } from '../utils/adminAuth';

export default function Admin() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  // Already signed in → skip the form and go straight to the dashboard.
  useEffect(() => {
    if (getAdmin()) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!values.email.trim()) errs.email = 'Enter your admin email address';
    else if (!isEmail(values.email)) errs.email = 'Enter a valid email address';
    if (!values.password) errs.password = 'Enter your password';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus({ state: 'sending', msg: '' });
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email.trim(), password: values.password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus({ state: 'error', msg: data.error || 'Invalid email or password.' });
        return;
      }
      saveAdmin({ token: data.token, email: data.email });
      navigate('/admin/dashboard');
    } catch {
      setStatus({ state: 'error', msg: 'Could not reach the server. Please try again.' });
    }
  };

  return (
    <>
      <Seo
        title="Admin Login | WebOnspark Technologies"
        description="Restricted admin sign-in for WebOnspark Technologies staff."
        path="/admin"
        noindex
      />
      <section className="login-wrap">
        <Container>
          <Row className="justify-content-center">
            <Col md={7} lg={5}>
              <div className="login-card login-main">
                <div className="text-center mb-4">
                  <Logo />
                  <h1 className="h4 mt-3 mb-1">Admin sign in</h1>
                  <p className="text-muted mb-0">Restricted area for WebOnspark staff only.</p>
                </div>
                <Form noValidate onSubmit={onSubmit}>
                  <Form.Group className="mb-3" controlId="admin-email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={onChange}
                      isInvalid={!!errors.email}
                      autoComplete="username"
                      required
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="admin-password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={onChange}
                      isInvalid={!!errors.password}
                      autoComplete="current-password"
                      required
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <button type="submit" className="btn btn-brand w-100" disabled={status.state === 'sending'}>
                    {status.state === 'sending' ? 'Signing in…' : 'Sign in'}
                  </button>
                  {status.state === 'error' && (
                    <div className="form-error mt-3" role="alert">{status.msg}</div>
                  )}
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
