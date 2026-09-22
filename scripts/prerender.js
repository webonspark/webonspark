// Pre-renders every route into dist/<route>/index.html and writes sitemap.xml.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, routes } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const configSrc = fs.readFileSync(path.join(root, 'src/config.js'), 'utf8');
const SITE_URL = (configSrc.match(/SITE_URL\s*=\s*'([^']+)'/) || [])[1] || 'https://www.example.com';

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const headRe = /<!--app-head-->[\s\S]*?<!--\/app-head-->/;

for (const url of routes) {
  const { html, head } = await render(url);
  const page = template.replace(headRe, head).replace('<!--app-html-->', html);
  const outDir = url === '/' ? dist : path.join(dist, url);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page);
  // also write /about.html style files so hosts serve /about without a trailing-slash redirect
  if (url !== '/') fs.writeFileSync(`${outDir}.html`, page);
  console.log('  ✓ prerendered', url);
}

// 404 page (served by Netlify / Vercel for unknown URLs)
{
  const { html, head } = await render('/__404__');
  fs.writeFileSync(path.join(dist, '404.html'), template.replace(headRe, head).replace('<!--app-html-->', html));
}

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const priority = (u) => (u === '/' ? '1.0' : u.split('/').length <= 2 ? '0.9' : '0.8');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((u) => u !== '/login')
  .map((u) => `  <url><loc>${SITE_URL}${u === '/' ? '/' : u}</loc><lastmod>${today}</lastmod><priority>${priority(u)}</priority></url>`)
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /login\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`\n✔ ${routes.length} pages pre-rendered · sitemap.xml & robots.txt written`);
