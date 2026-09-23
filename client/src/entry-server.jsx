// Used only at build time to pre-render every page to static HTML (great for SEO & speed).
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Writable } from 'node:stream';
import App from './App';
import { SeoContext, renderHead } from './utils/seo';

// Individual services and blog posts are no longer in this list — they're stored in
// the database and fetched at runtime (see context/ContentContext.jsx), so admin-added
// content shows up live without a rebuild. Their URLs still work in production via the
// SPA-fallback rewrites in netlify.toml / vercel.json. The category hub pages and the
// blog listing page keep their static shell here; only the items inside them are dynamic.
export const routes = [
  '/',
  '/about',
  '/services',
  '/services/app-development',
  '/services/website-development',
  '/careers',
  '/blog',
  '/contact',
  // '/login', // Login page temporarily disabled for users.
  '/admin',
  '/admin/dashboard',
  '/admin/enquiries',
  '/admin/contacts',
  '/admin/leads',
  '/admin/services',
  '/admin/blogs',
  '/privacy-policy',
];

export function render(url) {
  const seo = { data: null };
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _enc, cb) { html += chunk.toString(); cb(); },
    });
    sink.on('finish', () => resolve({ html, head: renderHead(seo.data) }));
    const stream = renderToPipeableStream(
      <SeoContext.Provider value={seo}>
        <StaticRouter location={url} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </StaticRouter>
      </SeoContext.Provider>,
      {
        onAllReady() { stream.pipe(sink); },
        onError(err) { reject(err); },
      }
    );
  });
}
