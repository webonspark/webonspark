import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import { breadcrumbSchema } from '../utils/seo';
import { PageHero, SectionTitle } from '../components/Common';
import Icon from '../components/Icons';
import { useFormState } from '../utils/useFormState';
import { Field, Honeypot, FormStatus, SubmitButton, Form } from '../components/FormKit';

// Edit this list to add / remove openings.
const jobs = [
  { title: 'React.js Developer', type: 'Full-time', exp: '1–3 years', loc: 'Bengaluru', desc: 'Build fast, accessible React interfaces with clean, reusable components and a sharp eye for performance.' },
  { title: 'Flutter / React Native Developer', type: 'Full-time', exp: '1–3 years', loc: 'Bengaluru', desc: 'Ship cross-platform mobile apps with smooth animations, offline support and payment integrations.' },
  { title: 'UI / UX Designer', type: 'Full-time', exp: '1–4 years', loc: 'Bengaluru / Tamil Nadu', desc: 'Turn business goals into clear user flows, wireframes and polished interfaces in Figma.' },
  { title: 'SEO & Content Executive', type: 'Full-time', exp: '0–2 years', loc: 'Tamil Nadu', desc: 'Write original, search-friendly content and handle on-page and local SEO for client websites.' },
  { title: 'Business Development Executive', type: 'Full-time', exp: '0–3 years', loc: 'Bengaluru', desc: 'Meet business owners, understand their needs and help them choose the right website or app solution.' },
  { title: 'Web Development Intern', type: 'Internship', exp: 'Freshers', loc: 'Bengaluru / Tamil Nadu', desc: 'Learn by doing on real client projects with mentorship in HTML, CSS, JavaScript and React.' },
];

const perks = [
  ['rocket', 'Real projects from week one'],
  ['users', 'Mentorship from senior developers'],
  ['clock', 'Flexible, humane working hours'],
  ['layers', 'Learning budget for courses'],
];

function ApplyForm({ role }) {
  const form = useFormState(
    'Career',
    { name: '', email: '', phone: '', role: role || '', experience: '', location: '', resumeLink: '', portfolio: '', message: '' },
    { name: ['required'], email: ['required', 'email'], phone: ['required', 'phone'], role: ['required'], resumeLink: ['required', 'url'], portfolio: ['url'] }
  );
  return (
    <Form noValidate onSubmit={form.onSubmit}>
      <Honeypot form={form} />
      <div className="row g-3">
        <Field form={form} name="name" label="Full name" required col={6} autoComplete="name" />
        <Field form={form} name="phone" label="Mobile number" type="tel" required col={6} autoComplete="tel" />
        <Field form={form} name="email" label="Email" type="email" required col={6} autoComplete="email" />
        <Field form={form} name="role" label="Position" options={jobs.map((j) => j.title)} required col={6} />
        <Field form={form} name="experience" label="Experience" options={['Fresher', '< 1 year', '1–2 years', '2–4 years', '4+ years']} col={6} />
        <Field form={form} name="location" label="Current city" col={6} />
        <Field form={form} name="resumeLink" label="Resume link (Google Drive / Dropbox)" type="url" required col={6} placeholder="https://" />
        <Field form={form} name="portfolio" label="Portfolio / GitHub / LinkedIn" type="url" col={6} placeholder="https://" />
        <Field form={form} name="message" label="Why do you want to join WebOnspark?" as="textarea" rows={3} col={12} />
      </div>
      <SubmitButton status={form.status} className="mt-4">Submit application</SubmitButton>
      <div className="mt-3">
        <FormStatus status={form.status} successTitle="Application received" successText="Thank you for applying. If your profile matches, our team will contact you within a week." />
      </div>
    </Form>
  );
}

export default function Careers() {
  const [role, setRole] = useState('');
  const apply = (title) => {
    setRole(title);
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <Seo
        title="Careers at WebOnspark Technologies | Web & App Developer Jobs in Bangalore"
        description="Join WebOnspark Technologies in Bengaluru or Tamil Nadu. Openings for React developers, Flutter developers, UI/UX designers, SEO executives and interns."
        path="/careers"
        jsonLd={breadcrumbSchema([['Home', '/'], ['Careers', '/careers']])}
      />
      <PageHero
        eyebrow="Careers"
        title="Build things people actually use — with us"
        text="We're a growing team of developers, designers and problem-solvers in Bengaluru and Tamil Nadu. If you enjoy shipping work you're proud of, we'd love to meet you."
        crumbs={[['Careers']]}
      />
      <section className="section">
        <Container>
          <Row className="g-3 mb-5">
            {perks.map(([icon, t]) => (
              <Col xs={6} lg={3} key={t}>
                <div className="perk"><Icon name={icon} size={22} /> <span>{t}</span></div>
              </Col>
            ))}
          </Row>
          <SectionTitle eyebrow="Open positions" title="Current openings" text="Don't see your role? Apply anyway — we're always happy to hear from talented people." />
          <Row className="g-4">
            {jobs.map((j) => (
              <Col md={6} key={j.title}>
                <article className="job-card">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <h3 className="h5 mb-1">{j.title}</h3>
                    <span className="badge-soft">{j.type}</span>
                  </div>
                  <p className="job-meta"><Icon name="pin" size={15} /> {j.loc} · <Icon name="briefcase" size={15} /> {j.exp}</p>
                  <p>{j.desc}</p>
                  <button type="button" className="btn btn-sm btn-brand" onClick={() => apply(j.title)}>Apply now</button>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <section className="section bg-soft" id="apply">
        <Container>
          <Row className="justify-content-center">
            <Col lg={9}>
              <div className="form-card">
                <SectionTitle eyebrow="Apply" title="Send us your application" />
                <ApplyForm role={role} key={role} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
