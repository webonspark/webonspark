import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import { breadcrumbSchema } from '../utils/seo';
import { PageHero } from '../components/Common';
import Icon from '../components/Icons';
import { SkeletonLine, SkeletonBlock } from '../components/Skeleton';
import { blogPath } from '../utils/paths';
import { useContent } from '../context/ContentContext';
import { SITE_URL } from '../config';
import { fmtDate } from '../utils/format';

function BlogSkeleton() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Guides to grow your business online" crumbs={[['Blog']]} />
      <section className="section">
        <Container>
          <SkeletonBlock height={220} className="mb-4" />
          <Row className="g-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Col md={6} key={i}>
                <SkeletonLine width="30%" className="mb-2" />
                <SkeletonLine width="90%" height={22} className="mb-2" />
                <SkeletonLine width="100%" />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default function Blog() {
  const { blogs, status } = useContent();

  if (status !== 'ready') return <BlogSkeleton />;
  if (blogs.length === 0) {
    return (
      <>
        <PageHero eyebrow="Blog" title="Guides to grow your business online" crumbs={[['Blog']]} />
        <section className="section"><Container><p className="text-muted">No posts yet — check back soon.</p></Container></section>
      </>
    );
  }

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
