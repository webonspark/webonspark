import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import { orgSchema, breadcrumbSchema } from '../utils/seo';
import { PageHero, SectionTitle } from '../components/Common';
import Icon, { WhatsAppIcon } from '../components/Icons';
import { useFormState } from '../utils/useFormState';
import { Field, Honeypot, FormStatus, SubmitButton, Form } from '../components/FormKit';
import { COMPANY, whatsappLink, mailLink } from '../config';
import { useContent } from '../context/ContentContext';

function ContactForm() {
  const { services } = useContent();
  const form = useFormState(
    'Contact',
    { name: '', email: '', phone: '', subject: '', service: '', message: '' },
    { name: ['required'], email: ['required', 'email'], phone: ['required', 'phone'], message: ['required', 'min:10'] }
  );
  return (
    <Form noValidate onSubmit={form.onSubmit}>
      <Honeypot form={form} />
      <div className="row g-3">
        <Field form={form} name="name" label="Full name" required col={6} autoComplete="name" />
        <Field form={form} name="phone" label="Mobile / WhatsApp" type="tel" required col={6} autoComplete="tel" />
        <Field form={form} name="email" label="Email" type="email" required col={6} autoComplete="email" />
        <Field form={form} name="service" label="Interested in" options={[...services.map((s) => s.name), 'SEO / Maintenance', 'Other']} col={6} />
        <Field form={form} name="subject" label="Subject" col={12} />
        <Field form={form} name="message" label="Message" as="textarea" rows={5} required col={12} />
      </div>
      <SubmitButton status={form.status} className="mt-4">Send message</SubmitButton>
      <div className="mt-3">
        <FormStatus status={form.status} successTitle="Message sent" successText="Thank you for contacting WebOnspark Technologies. We'll get back to you within one working day." />
      </div>
    </Form>
  );
}

export default function Contact() {
  const hq = COMPANY.offices[0];
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(hq.mapQuery)}&output=embed`;
  return (
    <>
      <Seo
        title="Contact WebOnspark Technologies | Web Design Company in BTM Layout, Bangalore"
        description="Visit or contact WebOnspark Technologies at BTM Layout 2nd Stage, Bengaluru 560076. Email webonspark@gmail.com or WhatsApp +91 96865 95916 for a free quote."
        path="/contact"
        jsonLd={[orgSchema(), breadcrumbSchema([['Home', '/'], ['Contact', '/contact']])]}
      />
      <PageHero
        eyebrow="Contact us"
        title="Let's talk about your website or app"
        text="Call, WhatsApp, email or drop by our Bengaluru office. We usually reply within a few hours on working days."
        crumbs={[['Contact']]}
      />

      <section className="section">
        <Container>
          <Row className="g-4 mb-5">
            <Col md={6} lg={3}>
              <div className="contact-tile">
                <span className="ct-icon wa"><WhatsAppIcon size={24} /></span>
                <strong>WhatsApp</strong>
                <a className="ct-value" href={whatsappLink()} target="_blank" rel="noopener noreferrer">{COMPANY.phoneDisplay}</a>
                <a className="ct-value" href={whatsappLink(undefined, COMPANY.phoneRaw2)} target="_blank" rel="noopener noreferrer">{COMPANY.phoneDisplay2}</a>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="contact-tile">
                <span className="ct-icon"><Icon name="phone" /></span>
                <strong>Call us</strong>
                <a className="ct-value" href={`tel:+${COMPANY.phoneRaw}`}>{COMPANY.phoneDisplay}</a>
                <a className="ct-value" href={`tel:+${COMPANY.phoneRaw2}`}>{COMPANY.phoneDisplay2}</a>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <a className="contact-tile" href={mailLink()}>
                <span className="ct-icon"><Icon name="mail" /></span>
                <strong>Email</strong><span className="ct-value">{COMPANY.email}</span>
              </a>
            </Col>
            <Col md={6} lg={3}>
              <div className="contact-tile">
                <span className="ct-icon"><Icon name="clock" /></span>
                <strong>Working hours</strong><span className="ct-value">{COMPANY.hours}</span>
              </div>
            </Col>
          </Row>

          <Row className="g-5">
            <Col lg={5}>
              <SectionTitle center={false} eyebrow="Our offices" title="Where to find us" />
              {COMPANY.offices.map((o, i) => (
                <address className={`office-card ${i === 0 ? 'is-main' : ''}`} key={o.label}>
                  <span className="office-label">{o.label}</span>
                  {o.lines.map((l, j) => <span key={j} className={j === 0 ? 'fw-bold' : ''}>{l}</span>)}
                </address>
              ))}
              <div className="map-wrap">
                <iframe
                  title="WebOnspark Technologies office location on Google Maps"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Col>
            <Col lg={7}>
              <div className="form-card">
                <SectionTitle center={false} eyebrow="Send a message" title="Get a free consultation" text="Fill in the form and our team will reach out with ideas and a clear quote." />
                <ContactForm />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
