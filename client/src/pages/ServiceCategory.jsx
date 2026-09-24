import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import { breadcrumbSchema } from '../utils/seo';
import { PageHero, SectionTitle, CheckList } from '../components/Common';
import EnquiryForm from '../components/EnquiryForm';
import { ServiceGrid } from './Services';
import { useContent } from '../context/ContentContext';
import { SkeletonLine, SkeletonBlock } from '../components/Skeleton';

const extras = {
  app: ['Android & iOS from one codebase', 'Admin panel for your team', 'Payment gateway integration', 'Push notifications', 'Play Store & App Store publishing', 'Analytics & crash reporting'],
  web: ['Mobile-first responsive design', 'On-page & technical SEO', 'Enquiry forms to email + sheet', 'WhatsApp & call buttons', 'Security headers & HTTPS', 'Fast CDN hosting setup'],
};

export default function ServiceCategory({ type }) {
  const { services, serviceCategories, status } = useContent();
  const c = serviceCategories[type];

  if (status !== 'ready' || !c) {
    return (
      <section className="section">
        <Container>
          <SkeletonLine width={220} height={14} className="mb-3" />
          <SkeletonLine width="60%" height={34} className="mb-4" />
          <SkeletonBlock height={160} />
        </Container>
      </section>
    );
  }

  const items = services.filter((s) => s.category === type);
  const path = `/services/${c.slug}`;
  return (
    <>
      <Seo
        title={c.seoTitle}
        description={c.seoDesc}
        path={path}
        jsonLd={[
          breadcrumbSchema([['Home', '/'], ['Services', '/services'], [c.name, path]]),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: c.name,
            provider: { '@type': 'Organization', name: 'WebOnspark Technologies' },
            areaServed: 'India',
          },
        ]}
      />
      <PageHero eyebrow={c.name} title={c.headline} text={c.intro} crumbs={[['Services', '/services'], [c.name]]} />

      <section className="section">
        <Container>
          <SectionTitle eyebrow="Choose your industry" title={`${c.name} solutions we offer`} />
          <ServiceGrid items={items} loading={status !== 'ready'} count={type === 'web' ? 10 : 5} />
        </Container>
      </section>

      <section className="section bg-soft">
        <Container>
          <Row className="g-5 align-items-center">
            <Col lg={6}>
              <span className="eyebrow">Included as standard</span>
              <h2>Everything a modern {type === 'app' ? 'app' : 'website'} needs — from day one</h2>
              <p>
                We don't sell essentials as extras. Every {type === 'app' ? 'app' : 'website'} project includes the
                foundations that make it fast, secure and easy to grow.
              </p>
            </Col>
            <Col lg={6}><CheckList items={extras[type]} /></Col>
          </Row>
        </Container>
      </section>

      <section className="section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={9}>
              <div className="form-card">
                <SectionTitle eyebrow="Enquiry" title={`Get a quote for ${c.name.toLowerCase()}`} />
                <EnquiryForm serviceOptions={[...items.map((s) => s.name), 'Something else']} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
