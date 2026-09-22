import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import { breadcrumbSchema } from '../utils/seo';
import { PageHero, SectionTitle } from '../components/Common';
import Icon from '../components/Icons';
import EnquiryForm from '../components/EnquiryForm';
import { serviceCategories, servicePath, processSteps, allServices } from '../data/services';

export function ServiceGrid({ items }) {
  return (
    <Row className="g-4">
      {items.map((s) => (
        <Col sm={6} lg={4} key={s.slug}>
          <Link to={servicePath(s)} className="service-card">
            <span className="sc-icon"><Icon name={s.icon} size={24} /></span>
            <h3 className="h5">{s.name}</h3>
            <p>{s.short}</p>
            <span className="link-arrow">View 6 templates <Icon name="arrow" size={16} /></span>
          </Link>
        </Col>
      ))}
    </Row>
  );
}

export default function Services() {
  return (
    <>
      <Seo
        title="Website & Mobile App Development Services in Bangalore | WebOnspark"
        description="Explore WebOnspark's website development and mobile app development services — 15 industry solutions with 90 ready-to-customise templates. Free quote in 24 hours."
        path="/services"
        jsonLd={breadcrumbSchema([['Home', '/'], ['Services', '/services']])}
      />
      <PageHero
        eyebrow="Our services"
        title="Website & app development services built around your industry"
        text="Choose a service to explore ready-made templates, features and FAQs — then send an enquiry in under a minute."
        crumbs={[['Services']]}
      >
        <div className="d-flex flex-wrap gap-2 mt-4">
          <a href="#web" className="btn btn-light">Website Development</a>
          <a href="#app" className="btn btn-outline-light">App Development</a>
        </div>
      </PageHero>

      {['web', 'app'].map((k, idx) => {
        const c = serviceCategories[k];
        return (
          <section className={`section ${idx ? 'bg-soft' : ''}`} id={k} key={k}>
            <Container>
              <div className="d-flex flex-wrap justify-content-between align-items-end gap-3">
                <SectionTitle center={false} eyebrow={c.name} title={c.headline} text={c.intro} />
                <Link to={`/services/${c.slug}`} className="btn btn-outline-brand mb-4">
                  All {c.name.toLowerCase()} <Icon name="arrow" size={16} />
                </Link>
              </div>
              <ServiceGrid items={c.items} />
            </Container>
          </section>
        );
      })}

      <section className="section bg-brand text-white">
        <Container>
          <SectionTitle light eyebrow="Process" title="From first call to launch day" />
          <div className="process is-dark">
            {processSteps.map(([t, d], i) => (
              <div className="process-step" key={t}>
                <span className="ps-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h6">{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section" id="enquiry">
        <Container>
          <Row className="justify-content-center">
            <Col lg={9}>
              <div className="form-card">
                <SectionTitle eyebrow="Enquiry" title="Tell us what you want to build" text="Share a few details and we'll send a clear, itemised quote within 24 hours." />
                <EnquiryForm serviceOptions={[...allServices.map((s) => s.name), 'Something else']} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
