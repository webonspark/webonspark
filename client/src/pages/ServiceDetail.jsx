import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Seo from '../components/Seo';
import { breadcrumbSchema, faqSchema } from '../utils/seo';
import { PageHero, SectionTitle, Faq, CheckList } from '../components/Common';
import Icon from '../components/Icons';
import TemplateMockup from '../components/TemplateMockup';
import EnquiryForm from '../components/EnquiryForm';
import NotFound from './NotFound';
import { SkeletonLine, SkeletonBlock } from '../components/Skeleton';
import { servicePath } from '../utils/paths';
import { useContent } from '../context/ContentContext';
import { SITE_URL } from '../config';

function ServiceDetailSkeleton() {
  return (
    <>
      <section className="page-hero">
        <Container>
          <SkeletonLine width={220} height={14} className="skel-light mb-3" />
          <SkeletonLine width="60%" height={38} className="skel-light mb-2" />
          <SkeletonLine width="40%" height={20} className="skel-light" />
        </Container>
      </section>
      <section className="section">
        <Container>
          <Row className="g-5">
            <Col lg={7}>
              <SkeletonLine width="100%" className="mb-2" />
              <SkeletonLine width="95%" className="mb-2" />
              <SkeletonLine width="80%" />
            </Col>
            <Col lg={5}><SkeletonBlock height={160} /></Col>
          </Row>
        </Container>
      </section>
      <section className="section" id="templates">
        <Container>
          <Row className="g-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Col sm={6} lg={4} key={i}>
                <SkeletonBlock height={200} className="mb-2" />
                <SkeletonLine width="50%" />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default function ServiceDetail({ type }) {
  const { slug } = useParams();
  const { services, serviceCategories, processSteps, status } = useContent();
  const [preview, setPreview] = useState(null);
  const [chosen, setChosen] = useState('');

  if (status !== 'ready') return <ServiceDetailSkeleton />;
  const svc = services.find((s) => s.slug === slug && s.category === type);
  if (!svc) return <NotFound />;

  const cat = serviceCategories[type];
  const path = servicePath(svc);
  const kind = type === 'app' ? 'app' : 'web';
  const related = services.filter((s) => s.category === type && s.slug !== svc.slug).slice(0, 3);

  const choose = (name) => {
    setChosen(name);
    setPreview(null);
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Seo
        title={svc.seoTitle}
        description={svc.seoDesc}
        path={path}
        jsonLd={[
          breadcrumbSchema([['Home', '/'], ['Services', '/services'], [cat.name, `/services/${cat.slug}`], [svc.name, path]]),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: svc.name,
            serviceType: `${svc.name} development`,
            description: svc.seoDesc,
            url: `${SITE_URL}${path}`,
            provider: { '@type': 'Organization', name: 'WebOnspark Technologies', url: SITE_URL },
            areaServed: ['Bengaluru', 'Tamil Nadu', 'India'],
          },
          faqSchema(svc.faqs),
        ]}
      />

      <PageHero
        eyebrow={`${cat.name} · ${svc.name}`}
        title={`${svc.name.replace(/s$/, "")} Development in Bangalore`}
        text={`${svc.headline} ${svc.short}`}
        crumbs={[['Services', '/services'], [cat.name, `/services/${cat.slug}`], [svc.name]]}
      >
        <div className="d-flex flex-wrap gap-2 mt-4">
          <a href="#templates" className="btn btn-accent btn-lg">View templates</a>
          <a href="#enquiry" className="btn btn-outline-light btn-lg">Enquire now</a>
        </div>
      </PageHero>

      {/* Overview */}
      <section className="section">
        <Container>
          <Row className="g-5">
            <Col lg={7}>
              <span className="eyebrow">Overview</span>
              <h2>Why your business needs {svc.name.toLowerCase()}</h2>
              {svc.intro.map((p, i) => <p key={i}>{p}</p>)}
            </Col>
            <Col lg={5}>
              <div className="ideal-card">
                <h3 className="h5">Ideal for</h3>
                <CheckList items={svc.idealFor} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section className="section bg-soft">
        <Container>
          <SectionTitle eyebrow="Key features" title={`What's included in our ${svc.name.toLowerCase()}`} />
          <Row className="g-4">
            {svc.features.map(([t, d]) => (
              <Col md={6} lg={4} key={t}>
                <div className="feature-card">
                  <Icon name="check" size={20} className="fc-check" />
                  <h3 className="h6">{t}</h3>
                  <p className="mb-0">{d}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Templates */}
      <section className="section" id="templates">
        <Container>
          <SectionTitle
            eyebrow="Templates"
            title={`Choose your ${svc.name.toLowerCase().replace(/s$/, '')} template`}
            text="Six starting designs, each fully customisable to your brand colours, content and features. Pick one you like, or ask for a completely custom design."
          />
          <Row className="g-4">
            {svc.templates.map((tpl) => (
              <Col sm={6} lg={4} key={tpl.name}>
                <article className="tpl-card static">
                  <div className={`tpl-preview ${kind === 'app' ? 'is-app' : ''}`}>
                    <TemplateMockup kind={kind} tpl={tpl} mock={svc.mock} />
                  </div>
                  <div className="tpl-body">
                    <span className="tpl-tag">{svc.name}</span>
                    <h3 className="h6 mb-1">{tpl.name}</h3>
                    <p>{tpl.desc}</p>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-sm btn-outline-brand" onClick={() => setPreview(tpl)}>
                        <Icon name="eye" size={16} /> Preview
                      </button>
                      <button type="button" className="btn btn-sm btn-brand" onClick={() => choose(tpl.name)}>
                        Use this template
                      </button>
                    </div>
                  </div>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Process */}
      <section className="section bg-brand text-white">
        <Container>
          <SectionTitle light eyebrow="Our process" title={`How we build your ${svc.name.toLowerCase().replace(/s$/, '')}`} />
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

      {/* FAQ */}
      <section className="section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={9}>
              <SectionTitle eyebrow="FAQs" title={`Questions about ${svc.name.toLowerCase()}`} />
              <Faq items={svc.faqs} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Enquiry */}
      <section className="section bg-soft" id="enquiry">
        <Container>
          <Row className="justify-content-center">
            <Col lg={9}>
              <div className="form-card">
                <SectionTitle
                  eyebrow="Enquiry form"
                  title={`Start your ${svc.name.toLowerCase().replace(/s$/, '')} project`}
                  text="Tell us a little about your business. We'll reply within one working day with ideas, timeline and a clear quote."
                />
                <EnquiryForm
                  service={svc.name}
                  templates={svc.templates.map((t) => t.name)}
                  selectedTemplate={chosen}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Related */}
      <section className="section">
        <Container>
          <SectionTitle eyebrow="Related" title={`More ${cat.name.toLowerCase()} solutions`} />
          <Row className="g-4">
            {related.map((s) => (
              <Col md={4} key={s.slug}>
                <Link to={servicePath(s)} className="service-card">
                  <span className="sc-icon"><Icon name={s.icon} size={24} /></span>
                  <h3 className="h5">{s.name}</h3>
                  <p>{s.short}</p>
                  <span className="link-arrow">Explore <Icon name="arrow" size={16} /></span>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Modal show={!!preview} onHide={() => setPreview(null)} size="lg" centered aria-labelledby="tpl-modal-title">
        {preview && (
          <>
            <Modal.Header closeButton>
              <Modal.Title id="tpl-modal-title" className="h5">{preview.name} — {svc.name} template</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className={`tpl-modal-preview ${kind === 'app' ? 'is-app' : ''}`}>
                <TemplateMockup kind={kind} tpl={preview} mock={svc.mock} size="lg" />
              </div>
              <p className="mt-3 mb-0">{preview.desc} Colours, fonts, sections and features can all be tailored to your brand.</p>
              {preview.url && (
                <a href={preview.url} target="_blank" rel="noopener noreferrer" className="d-inline-block mt-2">
                  Visit sample site: {preview.url} <Icon name="arrow" size={14} />
                </a>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button type="button" className="btn btn-outline-brand" onClick={() => setPreview(null)}>Close</button>
              <button type="button" className="btn btn-accent" onClick={() => choose(preview.name)}>Enquire about {preview.name}</button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
