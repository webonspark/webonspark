// Used only at build time to pre-render every page to static HTML (great for SEO & speed).
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Writable } from 'node:stream';
import App from './App';
import { SeoContext, renderHead } from './utils/seo';
import { allServices, servicePath } from './data/services';
import { blogs, blogPath } from './data/blogs';

export const routes = [
  '/',
  '/about',
  '/services',
  '/services/app-development',
  '/services/website-development',
  ...allServices.map(servicePath),
  '/careers',
  '/blog',
  ...blogs.map(blogPath),
  '/contact',
  '/login',
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
