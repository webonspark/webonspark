import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import Icon, { WhatsAppIcon } from './Icons';
import { COMPANY, whatsappLink, mailLink } from '../config';

/** Fixed WhatsApp + Email buttons (bottom-right) and back-to-top */
export function FloatingContact() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="floating-contact" role="complementary" aria-label="Quick contact">
      <a
        className="fc-btn fc-mail"
        href={mailLink()}
        aria-label={`Email ${COMPANY.email}`}
        title={`Email: ${COMPANY.email}`}
      >
        <Icon name="mail" size={24} />
      </a>
      <a
        className="fc-btn fc-wa"
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title={`WhatsApp: ${COMPANY.phoneDisplay}`}
      >
        <WhatsAppIcon size={28} />
      </a>
      <button
        type="button"
        className={`fc-btn fc-top ${showTop ? 'show' : ''}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Icon name="chevron" size={22} className="rot-180" />
      </button>
    </div>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/** Page hero with breadcrumb */
export function PageHero({ eyebrow, title, text, crumbs = [], children }) {
  return (
    <section className="page-hero">
      <div className="hero-glow" aria-hidden="true" />
      <Container className="position-relative">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li><Link to="/">Home</Link></li>
              {crumbs.map(([label, to], i) => (
                <li key={i}>{to ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}</li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <span className="eyebrow eyebrow-light">{eyebrow}</span>}
        <h1 className="page-title">{title}</h1>
        {text && <p className="lead page-lead">{text}</p>}
        {children}
      </Container>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, text, center = true, light = false, as: H = 'h2' }) {
  return (
    <div className={`section-title ${center ? 'text-center mx-auto' : ''} ${light ? 'is-light' : ''}`}>
      {eyebrow && <span className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{eyebrow}</span>}
      <H className="h2">{title}</H>
      {text && <p>{text}</p>}
    </div>
  );
}

export function Faq({ items, defaultOpen = '0' }) {
  return (
    <Accordion defaultActiveKey={defaultOpen} className="faq">
      {items.map(([q, a], i) => (
        <Accordion.Item eventKey={String(i)} key={i}>
          <Accordion.Header as="h3">{q}</Accordion.Header>
          <Accordion.Body>{a}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export function CheckList({ items }) {
  return (
    <ul className="check-list">
      {items.map((it) => (
        <li key={it}><Icon name="check" size={18} /> {it}</li>
      ))}
    </ul>
  );
}

export function Loader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="spinner" /> <span className="visually-hidden">Loading…</span>
    </div>
  );
}
