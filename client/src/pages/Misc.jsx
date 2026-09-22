import Container from 'react-bootstrap/Container';
import Seo from '../components/Seo';
import { PageHero } from '../components/Common';
import { COMPANY } from '../config';

export function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy | WebOnspark Technologies" description="How WebOnspark Technologies collects, uses and protects the information you share through our website forms." path="/privacy-policy" />
      <PageHero title="Privacy Policy" crumbs={[['Privacy Policy']]} />
      <section className="section">
        <Container className="post-body" style={{ maxWidth: 820 }}>
          <p>This policy explains what information {COMPANY.name} collects through this website and how we use it.</p>
          <h2>Information we collect</h2>
          <p>When you fill in a form (login, enquiry, contact, career application or question), we collect the details you enter — such as your name, email address, phone number, company name and message.</p>
          <h2>How we use it</h2>
          <ul>
            <li>To respond to your enquiry and send quotes or project updates.</li>
            <li>To process job applications.</li>
            <li>To improve our services and website.</li>
          </ul>
          <p>We do not sell or rent your personal information to anyone.</p>
          <h2>How it is stored</h2>
          <p>Form submissions are stored in our private database, accessible only to authorised team members. The client sign-in on this website remembers your name in your own browser for up to 7 days; you can log out at any time to remove it.</p>
          <h2>Your choices</h2>
          <p>You can ask us to update or delete your information at any time by writing to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>
          <h2>Contact</h2>
          <p>{COMPANY.name}, {COMPANY.offices[0].lines.slice(1).join(', ')}.</p>
        </Container>
      </section>
    </>
  );
}
