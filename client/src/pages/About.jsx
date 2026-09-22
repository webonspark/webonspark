import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import { orgSchema, breadcrumbSchema } from '../utils/seo';
import { PageHero, SectionTitle, CheckList } from '../components/Common';
import Icon from '../components/Icons';

const values = [
  ['target', 'Outcome over output', 'A beautiful website that brings no enquiries is a failed project. We measure success by calls, orders and bookings.'],
  ['chat', 'Plain language', 'No jargon, no hidden costs. We explain choices clearly so you can make confident decisions.'],
  ['shield', 'Craft & care', 'Clean code, secure setups and careful testing — the invisible details that keep your platform healthy.'],
  ['users', 'Partnership', 'We stay reachable after launch. Many of our relationships start with one page and grow from there.'],
];

export default function About() {
  return (
    <>
      <Seo
        title="About WebOnspark Technologies | Web & App Developers in Bangalore"
        description="Meet WebOnspark Technologies — a Bengaluru-based website and mobile app development team with a branch in Tamil Nadu, focused on fast, secure, SEO-ready digital products."
        path="/about"
        jsonLd={[orgSchema(), breadcrumbSchema([['Home', '/'], ['About', '/about']])]}
      />
      <PageHero
        eyebrow="About us"
        title="A small, focused team that treats your business like our own"
        text="WebOnspark Technologies started in Bengaluru with a simple belief: every business deserves a website or app that is fast, honest and genuinely useful to its customers."
        crumbs={[['About']]}
      />

      <section className="section">
        <Container>
          <Row className="g-5 align-items-center">
            <Col lg={6}>
              <span className="eyebrow">Our story</span>
              <h2>Why we started WebOnspark</h2>
              <p>
                We kept meeting business owners who had paid for websites that looked fine but did nothing — pages that
                took forever to load, never appeared on Google and made it hard for customers to get in touch. Others
                had app ideas but no one who would explain the trade-offs honestly.
              </p>
              <p>
                So we built a studio around the opposite approach. We listen first, recommend only what you need, and
                build every product with speed, search visibility and security baked in. Our head office sits in BTM
                Layout, Bengaluru, and our Tamil Nadu branch helps us serve clients across South India with the same
                care.
              </p>
              <CheckList items={['Head office in BTM Layout, Bengaluru', 'Branch office in Tamil Nadu', 'Serving clients across India', 'Websites, web apps & mobile apps']} />
            </Col>
            <Col lg={6}>
              <div className="about-panel">
                <div className="ap-item"><strong>Mission</strong><p>Help growing businesses win customers online with digital products that are fast, findable and dependable.</p></div>
                <div className="ap-item"><strong>Vision</strong><p>To be the most trusted technology partner for small and mid-size businesses in South India.</p></div>
                <div className="ap-item"><strong>Promise</strong><p>Clear quotes, weekly updates, and full ownership of everything we build for you.</p></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section bg-soft">
        <Container>
          <SectionTitle eyebrow="What we value" title="The principles behind every project" />
          <Row className="g-4">
            {values.map(([icon, t, d]) => (
              <Col md={6} lg={3} key={t}>
                <div className="value-card">
                  <span className="why-icon light"><Icon name={icon} size={22} /></span>
                  <h3 className="h6">{t}</h3>
                  <p className="mb-0">{d}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionTitle eyebrow="Our expertise" title="What our team brings to the table" />
          <Row className="g-4">
            {[
              ['code', 'Front-end engineering', 'React, modern JavaScript and performance-first builds that feel instant.'],
              ['mobile', 'Mobile apps', 'Cross-platform Android and iOS apps with smooth, native-feeling interfaces.'],
              ['layers', 'UI / UX design', 'Research-backed layouts, clean visual systems and accessible interfaces.'],
              ['search', 'SEO & content', 'Technical SEO, local SEO and original content that search engines trust.'],
              ['cart', 'E-commerce', 'Catalogues, payments, shipping and order management that scale.'],
              ['shield', 'Security & hosting', 'Secure deployments, CDN hosting, backups and ongoing maintenance.'],
            ].map(([icon, t, d]) => (
              <Col md={6} lg={4} key={t}>
                <div className="feature-row">
                  <span className="fr-icon"><Icon name={icon} size={22} /></span>
                  <div><h3 className="h6 mb-1">{t}</h3><p className="mb-0">{d}</p></div>
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Link to="/contact" className="btn btn-accent btn-lg me-2">Work with us</Link>
            <Link to="/careers" className="btn btn-outline-brand btn-lg">Join our team</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
