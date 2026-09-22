import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import { breadcrumbSchema } from '../utils/seo';
import { PageHero } from '../components/Common';
import Icon from '../components/Icons';
import { blogs, blogPath } from '../data/blogs';
import { SITE_URL } from '../config';
import { fmtDate } from '../utils/format';

export default function Blog() {
  const [first, ...rest] = blogs;
  return (
    <>
      <Seo
        title="Blog | Website, App & SEO Guides for Businesses – WebOnspark"
        description="Practical guides on website costs, SEO, page speed and mobile app planning — written by the WebOnspark Technologies team in Bangalore."
        path="/blog"
        jsonLd={[
          breadcrumbSchema([['Home', '/'], ['Blog', '/blog']]),
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'WebOnspark Technologies Blog',
            url: `${SITE_URL}/blog`,
            blogPost: blogs.map((b) => ({ '@type': 'BlogPosting', headline: b.title, url: `${SITE_URL}${blogPath(b)}`, datePublished: b.date })),
          },
        ]}
      />
      <PageHero
        eyebrow="Blog"
        title="Guides to grow your business online"
        text="Clear, practical advice on websites, apps, SEO and performance — no jargon, no fluff."
        crumbs={[['Blog']]}
      />
      <section className="section">
        <Container>
          <Link to={blogPath(first)} className="blog-feature">
            <div className="bf-art" aria-hidden="true"><Icon name="rocket" size={64} strokeWidth={1.2} /></div>
            <div className="bf-body">
              <span className="blog-cat">{first.category} · Featured</span>
              <h2 className="h3">{first.title}</h2>
              <p>{first.excerpt}</p>
              <span className="blog-meta">{fmtDate(first.date)} · {first.readTime} min read</span>
            </div>
          </Link>
          <Row className="g-4 mt-1">
            {rest.map((b) => (
              <Col md={6} key={b.slug}>
                <Link to={blogPath(b)} className="blog-card">
                  <span className="blog-cat">{b.category}</span>
                  <h2 className="h5">{b.title}</h2>
                  <p>{b.excerpt}</p>
                  <span className="blog-meta">{fmtDate(b.date)} · {b.readTime} min read</span>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}
