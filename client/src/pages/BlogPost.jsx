import { Link, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Seo from '../components/Seo';
import { breadcrumbSchema } from '../utils/seo';
import { PageHero } from '../components/Common';
import Icon from '../components/Icons';
import NotFound from './NotFound';
import { SkeletonLine } from '../components/Skeleton';
import { blogPath } from '../utils/paths';
import { useContent } from '../context/ContentContext';
import { fmtDate } from '../utils/format';
import { SITE_URL, whatsappLink } from '../config';

function BlogPostSkeleton() {
  return (
    <>
      <section className="page-hero">
        <Container>
          <SkeletonLine width={160} height={14} className="skel-light mb-3" />
          <SkeletonLine width="70%" height={34} className="skel-light" />
        </Container>
      </section>
      <section className="section">
        <Container>
          <Row className="g-5">
            <Col lg={8}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonLine key={i} width={`${95 - (i % 3) * 15}%`} className="mb-3" />)}
            </Col>
            <Col lg={4}><SkeletonLine height={160} /></Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

function Block({ block }) {
  const [type, val] = block;
  if (type === 'h2') return <h2>{val}</h2>;
  if (type === 'h3') return <h3>{val}</h3>;
  if (type === 'ul') return <ul>{val.map((v) => <li key={v}>{v}</li>)}</ul>;
  if (type === 'ol') return <ol>{val.map((v) => <li key={v}>{v}</li>)}</ol>;
  if (type === 'tip') return <aside className="post-tip"><Icon name="bolt" size={20} /> <p className="mb-0">{val}</p></aside>;
  return <p>{val}</p>;
}

export default function BlogPost() {
  const { slug } = useParams();
  const { blogs, status } = useContent();
  if (status !== 'ready') return <BlogPostSkeleton />;
  const post = blogs.find((b) => b.slug === slug);
  if (!post) return <NotFound />;
  const path = blogPath(post);
  const related = blogs.filter((b) => b.slug !== slug).slice(0, 3);
  const words = post.content.reduce((n, [, v]) => n + (Array.isArray(v) ? v.join(' ') : v).split(/\s+/).length, 0);

  return (
    <>
      <Seo
        title={`${post.seoTitle} | WebOnspark Blog`}
        description={post.description}
        path={path}
        type="article"
        jsonLd={[
          breadcrumbSchema([['Home', '/'], ['Blog', '/blog'], [post.title, path]]),
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            wordCount: words,
            keywords: post.tags.join(', '),
            mainEntityOfPage: `${SITE_URL}${path}`,
            author: { '@type': 'Organization', name: 'WebOnspark Technologies', url: SITE_URL },
            publisher: { '@type': 'Organization', name: 'WebOnspark Technologies', logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } },
          },
        ]}
      />
      <PageHero eyebrow={post.category} title={post.title} crumbs={[['Blog', '/blog'], [post.category]]}>
        <p className="post-meta">
          <span>By WebOnspark Team</span> · <time dateTime={post.date}>{fmtDate(post.date)}</time> · <span>{post.readTime} min read</span>
        </p>
      </PageHero>
      <section className="section">
        <Container>
          <Row className="g-5">
            <Col lg={8}>
              <article className="post-body">
                <p className="post-intro">{post.description}</p>
                {post.content.map((b, i) => <Block key={i} block={b} />)}
                <div className="post-tags">
                  {post.tags.map((t) => <span key={t} className="badge-soft">#{t}</span>)}
                </div>
              </article>
            </Col>
            <Col lg={4}>
              <aside className="post-side">
                <div className="side-cta">
                  <h2 className="h5 text-white">Need help with your website or app?</h2>
                  <p>Get free advice and a clear quote from our team within 24 hours.</p>
                  <Link to="/contact" className="btn btn-accent w-100 mb-2">Get a free quote</Link>
                  <a href={whatsappLink()} className="btn btn-outline-light w-100" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
                </div>
                <h2 className="h6 mt-4 mb-3">Related articles</h2>
                {related.map((b) => (
                  <Link key={b.slug} to={blogPath(b)} className="side-link">
                    <strong>{b.title}</strong>
                    <small>{b.readTime} min read</small>
                  </Link>
                ))}
              </aside>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
