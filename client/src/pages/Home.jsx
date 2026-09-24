import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import { orgSchema, faqSchema } from '../utils/seo';
import Icon from '../components/Icons';
import { SectionTitle, Faq } from '../components/Common';
import { SkeletonLine, SkeletonBlock, SkeletonCard } from '../components/Skeleton';
import TemplateMockup from '../components/TemplateMockup';
import { useFormState } from '../utils/useFormState';
import { Field, Honeypot, FormStatus, SubmitButton, Form } from '../components/FormKit';
import { servicePath, blogPath } from '../utils/paths';
import { useContent } from '../context/ContentContext';
import { whatsappLink, SITE_URL, COMPANY } from '../config';

const whyUs = [
  ['bolt', 'Built for speed', 'Lean code, pre-rendered pages and optimised assets. Our sites load in a blink, even on a crowded 4G network.'],
  ['search', 'SEO from day one', 'Titles, schema, sitemaps, clean URLs and original content are part of every build — not a paid add-on later.'],
  ['shield', 'Secure by default', 'HTTPS, security headers, spam-protected forms and minimal third-party scripts keep your platform safe.'],
  ['mobile', 'Mobile-first design', 'We design for the phone in your customer\'s hand first, then scale up beautifully to desktop.'],
  ['users', 'One team, start to finish', 'Strategy, design, development and launch under one roof — one point of contact, no hand-off confusion.'],
  ['headset', 'Honest support', 'Clear quotes, weekly updates and friendly support after launch. You always know what is happening.'],
];

// ⚠️ SAMPLE testimonials — replace with genuine reviews from your clients.
// While `sample: true`, a small "Sample" tag is shown on the card. Remove the flag once real.
const testimonials = [
  {
    sample: true,
    name: 'Your client\'s name',
    role: 'Restaurant owner · Bengaluru',
    text: 'Replace this with a real quote from a client — for example how their new website or app changed the number of enquiries or orders they receive.',
  },
  {
    sample: true,
    name: 'Your client\'s name',
    role: 'Clinic founder · Chennai',
    text: 'Real testimonials build trust and help conversions. Ask happy clients for two or three sentences and add their name, business and city here.',
  },
  {
    sample: true,
    name: 'Your client\'s name',
    role: 'Coaching institute · Coimbatore',
    text: 'Keep each testimonial specific: what the problem was, what WebOnspark built, and the result they noticed after launch.',
  },
];

const homeFaqs = [
  ['How long does it take to build a website or app?', 'A business website usually takes 2–4 weeks and a landing page about a week. Mobile apps typically take 8–14 weeks depending on features. We share a clear timeline with milestones before we begin.'],
  ['Do you work with businesses outside Bangalore?', 'Yes. Our head office is in BTM Layout, Bengaluru, and we have a branch in Tamil Nadu. We work with clients across India through video calls, WhatsApp and shared project boards.'],
  ['Will my website be SEO-friendly?', 'Every website we build includes on-page SEO: unique titles and descriptions, proper headings, schema markup, sitemap, fast loading and mobile optimisation. We also help you set up Google Search Console and Google Business Profile.'],
  ['Who owns the website or app after launch?', 'You do. The domain, hosting accounts, source code and content belong to your business. We hand over access and documentation at launch.'],
  ['Can I start with a template and customise it?', 'Absolutely. Our templates are starting points. We change colours, content, layout and features to match your brand, so the final result feels unique to you.'],
  ['Do you provide support after the website goes live?', 'Yes. Every project includes a support period after launch, and we offer affordable maintenance plans for updates, backups, security and SEO improvements.'],
];

const SHOWCASE_PICKS = [
  { kind: 'web', slug: 'restaurant-websites', i: 0 },
  { kind: 'app', slug: 'delivery-apps', i: 0 },
  { kind: 'web', slug: 'hospital-clinic-websites', i: 0 },
  { kind: 'app', slug: 'booking-apps', i: 2 },
  { kind: 'web', slug: 'real-estate-websites', i: 1 },
  { kind: 'app', slug: 'education-apps', i: 0 },
];

// Hero: one solid colour, no gradient
const heroStyle = { background: '#2F2065' };

// Button text scales down on small screens so both buttons fit on one line
const heroBtnStyle = { fontSize: 'clamp(0.85rem, 3.9vw, 1.25rem)' };

// ---------- Auto-scrolling service chips (no CSS file needed) ----------
const MARQUEE_SECONDS = 45; // higher = slower, lower = faster

const marqueeCss = `
.svc-marquee {
  position: relative;
  overflow: hidden;
  padding: 6px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%);
}
.svc-marquee-track {
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
  animation: svcMarquee ${MARQUEE_SECONDS}s linear infinite;
  will-change: transform;
}
.svc-marquee:hover .svc-marquee-track,
.svc-marquee:focus-within .svc-marquee-track {
  animation-play-state: paused;
}
.svc-marquee-group {
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  gap: 14px;
  padding-right: 14px;
}
.svc-marquee .svc-chip {
  flex-shrink: 0;
  white-space: nowrap;
  transition: transform .25s ease, box-shadow .25s ease;
}
.svc-marquee .svc-chip:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(49, 33, 105, .16);
}
@keyframes svcMarquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .svc-marquee { overflow-x: auto; -webkit-mask-image: none; mask-image: none; }
  .svc-marquee-track { animation: none; }
}
/* Stack two marquee rows with a small gap between them */
.svc-marquee-rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
`;

// One scrolling row — identical markup/styling to the original single-line marquee,
// just reused twice so we can render two lines.
function MarqueeRow({ services, label }) {
  return (
    <div className="svc-marquee" aria-label={label}>
      <div className="svc-marquee-track">
        {/* Group 1: real links */}
        <div className="svc-marquee-group">
          {services.map((s) => (
            <Link key={s.slug} to={servicePath(s)} className="svc-chip">
              <Icon name={s.icon} size={18} /> {s.name}
            </Link>
          ))}
        </div>
        {/* Group 2: exact copy so the loop is seamless (hidden from screen readers / tab order) */}
        <div className="svc-marquee-group" aria-hidden="true">
          {services.map((s) => (
            <Link key={s.slug + '-copy'} to={servicePath(s)} className="svc-chip" tabIndex={-1}>
              <Icon name={s.icon} size={18} /> {s.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceMarquee({ services }) {
  const all = services;
  // Split into two roughly-equal rows, same chip/marquee design on each line
  const mid = Math.ceil(all.length / 2);
  const row1 = all.slice(0, mid);
  const row2 = all.slice(mid);

  return (
    <div className="svc-marquee-rows">
      <style>{marqueeCss}</style>
      <MarqueeRow services={row1} label="Our website and app development services, line 1" />
      <MarqueeRow services={row2} label="Our website and app development services, line 2" />
    </div>
  );
}

function AskQuestion() {
  const form = useFormState(
    'Question',
    { name: '', email: '', phone: '', question: '' },
    { name: ['required'], email: ['required', 'email'], phone: ['phone'], question: ['required', 'min:10'] }
  );
  return (
    <Form noValidate onSubmit={form.onSubmit} className="ask-card">
      <h3 className="h4 mb-1">Didn't find your answer?</h3>
      <p className="text-muted">Ask us anything about websites, apps, SEO or pricing. A real person replies — usually the same day.</p>
      <Honeypot form={form} />
      <div className="row g-3">
        <Field form={form} name="name" label="Your name" required col={6} autoComplete="name" />
        <Field form={form} name="phone" label="Mobile (optional)" type="tel" col={6} autoComplete="tel" />
        <Field form={form} name="email" label="Email" type="email" required col={12} autoComplete="email" />
        <Field form={form} name="question" label="Your question" as="textarea" rows={3} required col={12} />
      </div>
      <SubmitButton status={form.status} className="mt-3 w-100">Ask our team</SubmitButton>
      <div className="mt-3">
        <FormStatus status={form.status} successTitle="Question received" successText="Thanks! We'll reply to your email shortly." />
      </div>
    </Form>
  );
}

function HomeSkeleton() {
  return (
    <>
      <section className="hero" style={heroStyle}>
        <Container className="position-relative">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <SkeletonLine width="90%" height={44} className="skel-light mb-2" />
              <SkeletonLine width="70%" height={44} className="skel-light mb-3" />
              <SkeletonLine width="95%" className="skel-light mb-2" />
              <SkeletonLine width="60%" className="skel-light mb-4" />
              <div className="d-flex gap-3">
                <SkeletonBlock width={140} height={48} className="skel-light" />
                <SkeletonBlock width={160} height={48} className="skel-light" />
              </div>
            </Col>
            <Col lg={6}>
              <SkeletonBlock height={320} className="skel-light" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="stats-strip">
        <Container>
          <Row className="g-3 text-center">
            {[0, 1, 2, 3].map((i) => (
              <Col xs={6} md={3} key={i}><SkeletonBlock height={56} /></Col>
            ))}
          </Row>
        </Container>
      </section>
      <section className="section">
        <Container>
          <Row className="g-4">
            {[0, 1, 2].map((i) => <Col md={4} key={i}><SkeletonCard /></Col>)}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default function Home() {
  const [tab, setTab] = useState('all');
  const { services, blogs, processSteps, status } = useContent();

  if (status !== 'ready') return <HomeSkeleton />;

  const webServices = services.filter((s) => s.category === 'web');
  const appServices = services.filter((s) => s.category === 'app');
  const showcase = SHOWCASE_PICKS
    .map(({ kind, slug, i }) => ({ kind, i, svc: services.find((s) => s.slug === slug) }))
    .filter((s) => s.svc);
  const items = showcase.filter((s) => tab === 'all' || s.kind === tab);

  return (
    <>
      <Seo
        title="Website & App Development Company in Bangalore | WebOnspark Technologies"
        description="WebOnspark Technologies builds fast, secure and SEO-friendly websites and mobile apps for businesses in Bangalore and Tamil Nadu. Explore 90 templates and get a free quote."
        path="/"
        jsonLd={[
          orgSchema(),
          { '@context': 'https://schema.org', '@type': 'WebSite', name: COMPANY.name, url: SITE_URL },
          faqSchema(homeFaqs),
        ]}
      />

      {/* 1. HERO BANNER (solid #2F2065 background) */}
      <section className="hero" style={heroStyle}>
        {/* hero-glow removed: it was the gradient overlay */}
        <div className="hero-grid" aria-hidden="true" />
        <Container className="position-relative">
          <Row className="align-items-center g-5">
            <Col lg={6}>

              <h1 className="hero-title">
                Turn your idea into <span className="text-spark"> High-performing Digital product<br/></span> That converts
              </h1>
              <p className="hero-lead">
                WebOnspark Technologies Our team plans, designs and builds custom websites and mobile apps with speed, security and search
  visibility in mind.
              </p>

              {/* Buttons: side by side on mobile too (flex-nowrap) */}
              <div className="d-flex flex-nowrap gap-2 gap-md-3 mt-4">
                <Link
                  to="/contact"
                  className="btn btn-accent flex-fill flex-md-grow-0 d-inline-flex align-items-center justify-content-center gap-1 text-nowrap px-2 px-sm-3 px-md-4 py-2 py-md-3"
                  style={heroBtnStyle}
                >
                  Let's talk <Icon name="arrow" size={18} />
                </Link>
                <Link
                  to="/services"
                  className="btn btn-outline-light flex-fill flex-md-grow-0 d-inline-flex align-items-center justify-content-center text-nowrap px-2 px-sm-3 px-md-4 py-2 py-md-3"
                  style={heroBtnStyle}
                >
                  Explore services
                </Link>
              </div>

              <ul className="hero-points">
                <li><Icon name="check" size={16} /> Free consultation</li>
                <li><Icon name="check" size={16} /> SEO included</li>
                <li><Icon name="check" size={16} /> You own the code</li>
              </ul>
            </Col>
            <Col lg={6}>
              <div className="hero-visual">
                <div className="hv-browser float-slow">
                  <TemplateMockup kind="web" tpl={webServices[0].templates[0]} mock={webServices[0].mock} size="md" useImage={false} />
                </div>
                <div className="hv-phone float-fast">
                  <TemplateMockup kind="app" tpl={appServices[0].templates[0]} mock={appServices[0].mock} size="sm" useImage={false} />
                </div>
                <div className="hv-badge hv-badge-1"><Icon name="bolt" size={18} /> <span><b>Fast</b> pre-rendered pages</span></div>
                <div className="hv-badge hv-badge-2"><Icon name="search" size={18} /> <span><b>SEO</b> ready on launch</span></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. HIGHLIGHTS STRIP */}
      <section className="stats-strip">
        <Container>
          <Row className="g-3 text-center">
            {[
              ['15', 'Industry solutions'],
              ['90', 'Ready-to-customise templates'],
              ['24 hrs', 'To receive your quote'],
              ['100%', 'Code & content ownership'],
            ].map(([n, l]) => (
              <Col xs={6} md={3} key={l}>
                <div className="stat"><strong>{n}</strong><span>{l}</span></div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 3. SERVICES */}
      <section className="section">
        <Container>
          <SectionTitle
            eyebrow="What we do"
            title="Website and mobile app development for every kind of business"
            text="Two core services, fifteen industry-ready solutions. Pick what fits your business today and grow into the rest when you are ready."
          />
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Link to="/services/website-development" className="big-service">
                <span className="bs-icon"><Icon name="globe" size={28} /></span>
                <h3>Website Development</h3>
                <p>Business sites, corporate portals, landing pages and online stores that load fast and rank on Google.</p>
                <span className="link-arrow">10 website types <Icon name="arrow" size={16} /></span>
              </Link>
            </Col>
            <Col md={6}>
              <Link to="/services/app-development" className="big-service is-dark">
                <span className="bs-icon"><Icon name="mobile" size={28} /></span>
                <h3>App Development</h3>
                <p>Android and iOS apps for delivery, booking, learning, shopping and healthcare — built for daily use.</p>
                <span className="link-arrow">5 app types <Icon name="arrow" size={16} /></span>
              </Link>
            </Col>
          </Row>

          {/* Two-line auto-scroll (each line same chip/marquee UI, pauses on hover) */}
          <ServiceMarquee services={services} />
        </Container>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="section bg-brand text-white">
        <Container>
          <SectionTitle
            light
            eyebrow="Why WebOnspark"
            title="Why businesses choose us as their website and app partner"
            text="We care about the things you only notice later: how fast the site feels, whether customers find it on Google, and whether you can reach us when you need a change."
          />
          <Row className="g-4">
            {whyUs.map(([icon, title, text]) => (
              <Col md={6} lg={4} key={title}>
                <div className="why-card">
                  <span className="why-icon"><Icon name={icon} size={24} /></span>
                  <h3 className="h5">{title}</h3>
                  <p>{text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 5. PROCESS */}
      <section className="section">
        <Container>
          <SectionTitle eyebrow="How we work" title="A simple five-step process with no surprises" text="You see progress every week and approve each stage before we move to the next." />
          <div className="process">
            {processSteps.map(([title, text], i) => (
              <div className="process-step" key={title}>
                <span className="ps-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h6">{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. TEMPLATE SHOWCASE */}
      <section className="section bg-soft">
        <Container>
          <SectionTitle eyebrow="Templates" title="Start faster with templates built for your industry" text="Every template is a starting point — we tailor colours, content and features to your brand." />
          <div className="tabs-pill" role="tablist" aria-label="Template type">
            {[['all', 'All'], ['web', 'Websites'], ['app', 'Apps']].map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
          <Row className="g-4">
            {items.map(({ kind, svc, i }) => {
              const tpl = svc.templates[i];
              return (
                <Col sm={6} lg={4} key={svc.slug + tpl.name}>
                  <Link to={servicePath(svc)} className="tpl-card">
                    <div className={`tpl-preview ${kind === 'app' ? 'is-app' : ''}`}>
                      <TemplateMockup kind={kind} tpl={tpl} mock={svc.mock} useImage={false} />
                    </div>
                    <div className="tpl-body">
                      <span className="tpl-tag">{svc.name}</span>
                      <h3 className="h6 mb-1">{tpl.name}</h3>
                      <p className="mb-0">{tpl.desc}</p>
                    </div>
                  </Link>
                </Col>
              );
            })}
          </Row>
          <div className="text-center mt-4">
            <Link to="/services" className="btn btn-brand btn-lg">Browse all 90 templates</Link>
          </div>
        </Container>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="section">
        <Container>
          <SectionTitle eyebrow="Client stories" title="What our clients say about working with us" />
          <Row className="g-4">
            {testimonials.map((t, i) => (
              <Col md={4} key={i}>
                <figure className="testimonial">
                  {t.sample && <span className="sample-tag">Sample</span>}
                  <div className="stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((s) => <Icon key={s} name="star" size={16} />)}</div>
                  <blockquote>“{t.text}”</blockquote>
                  <figcaption>
                    <span className="avatar">{t.name.charAt(0)}</span>
                    <span><strong>{t.name}</strong><small>{t.role}</small></span>
                  </figcaption>
                </figure>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 8. FAQ + ASK ANY QUESTION */}
      <section className="section bg-soft" id="faq">
        <Container>
          <Row className="g-5">
            <Col lg={7}>
              <SectionTitle center={false} eyebrow="Ask any question" title="Frequently asked questions" text="Straight answers to what business owners ask us most before starting a project." />
              <Faq items={homeFaqs} />
            </Col>
            <Col lg={5}>
              <AskQuestion />
            </Col>
          </Row>
        </Container>
      </section>

      {/* 9. BLOG */}
      <section className="section">
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <SectionTitle center={false} eyebrow="Insights" title="Guides to grow your business online" />
            <Link to="/blog" className="link-arrow mb-4">All articles <Icon name="arrow" size={16} /></Link>
          </div>
          <Row className="g-4">
            {blogs.slice(0, 3).map((b) => (
              <Col md={4} key={b.slug}>
                <Link to={blogPath(b)} className="blog-card">
                  <span className="blog-cat">{b.category}</span>
                  <h3 className="h5">{b.title}</h3>
                  <p>{b.excerpt}</p>
                  <span className="blog-meta">{b.readTime} min read</span>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 10. WHATSAPP STRIP */}
      <section className="wa-strip">
        <Container className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <p className="mb-0"><strong>Prefer chatting?</strong> Send us your requirement on WhatsApp and get a quick response from our team.</p>
          <a href={whatsappLink()} className="btn btn-wa" target="_blank" rel="noopener noreferrer">WhatsApp {COMPANY.phoneDisplay}</a>
        </Container>
      </section>
    </>
  );
}
