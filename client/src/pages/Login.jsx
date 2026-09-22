import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import Logo from '../components/Logo';
import { useFormState } from '../utils/useFormState';
import { Field, Honeypot, FormStatus, SubmitButton, Form } from '../components/FormKit';
import { getUser, saveUser, logout } from '../utils/auth';

export default function Login() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const sync = () => setUser(getUser());
    sync();
    window.addEventListener('wos-auth', sync);
    return () => window.removeEventListener('wos-auth', sync);
  }, []);

  const form = useFormState(
    'Login',
    { name: '', email: '', phone: '', company: '', purpose: '', consent: false },
    { name: ['required'], email: ['required', 'email'], phone: ['required', 'phone'], consent: ['required'] },
    (v) => saveUser(v)
  );

  return (
    <>
      <Seo title="Client Login | WebOnspark Technologies" description="Sign in to the WebOnspark Technologies client area to track your website or app project." path="/login" noindex />
      <section className="login-wrap">
        <Container>
          <Row className="g-0 login-card mx-auto">
            <Col lg={5} className="login-side">
              <Logo light />
              <h1 className="h3 mt-4 text-white">Welcome to your client area</h1>
              <p>Sign in to get project updates, share requirements and reach your WebOnspark project manager faster.</p>
              <ul className="list-unstyled login-points">
                <li><Icon name="check" size={18} /> Priority response from our team</li>
                <li><Icon name="check" size={18} /> Project status updates by email</li>
                <li><Icon name="check" size={18} /> Exclusive template & offer access</li>
              </ul>
            </Col>
            <Col lg={7} className="login-main">
              {user ? (
                <div className="text-center py-5">
                  <span className="why-icon light mx-auto mb-3"><Icon name="user" size={26} /></span>
                  <h2 className="h4">You're signed in, {user.name.split(' ')[0]}!</h2>
                  <p className="text-muted">{user.email} · {user.phone}</p>
                  <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                    <Link to="/services" className="btn btn-brand">Explore templates</Link>
                    <Link to="/contact" className="btn btn-outline-brand">Contact your team</Link>
                    <button type="button" className="btn btn-link text-danger" onClick={logout}>Logout</button>
                  </div>
                </div>
              ) : (
                <Form noValidate onSubmit={form.onSubmit}>
                  <h2 className="h4 mb-1">Client sign in</h2>
                  <p className="text-muted mb-4">Enter your details to continue.</p>
                  <Honeypot form={form} />
                  <div className="row g-3">
                    <Field form={form} name="name" label="Full name" required col={12} autoComplete="name" />
                    <Field form={form} name="email" label="Email address" type="email" required col={6} autoComplete="email" />
                    <Field form={form} name="phone" label="Mobile number" type="tel" required col={6} autoComplete="tel" />
                    <Field form={form} name="company" label="Company / business name" col={6} autoComplete="organization" />
                    <Field form={form} name="purpose" label="I am a…" options={['New client', 'Existing client', 'Partner / agency', 'Job applicant']} col={6} />
                  </div>
                  <Form.Check
                    className="mt-3"
                    id="f-consent"
                    name="consent"
                    checked={!!form.values.consent}
                    onChange={form.onChange}
                    isInvalid={!!form.errors.consent}
                    feedback="Please accept to continue"
                    feedbackType="invalid"
                    label={<>I agree to be contacted by WebOnspark and accept the <Link to="/privacy-policy">privacy policy</Link>.</>}
                  />
                  <SubmitButton status={form.status} className="w-100 mt-4">Sign in</SubmitButton>
                  <div className="mt-3">
                    <FormStatus status={form.status} successTitle="Signed in" successText="Welcome! Your details have been shared with our team." />
                  </div>
                </Form>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
