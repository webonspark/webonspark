// SEO helpers (head tags + structured data). Kept separate from components for fast refresh.
import { createContext } from 'react';
import { SITE_URL, COMPANY } from '../config';

// On the server (pre-render) this context collects head data for each page.
export const SeoContext = createContext(null);

export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function buildTags({ title, description, path = '/', type = 'website', image = DEFAULT_IMAGE, noindex }) {
  const url = `${SITE_URL}${path === '/' ? '/' : path}`;
  return {
    title,
    canonical: url,
    meta: [
      ['name', 'description', description],
      ['name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'],
      ['property', 'og:type', type],
      ['property', 'og:site_name', COMPANY.name],
      ['property', 'og:title', title],
      ['property', 'og:description', description],
      ['property', 'og:url', url],
      ['property', 'og:image', image],
      ['property', 'og:locale', 'en_IN'],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', title],
      ['name', 'twitter:description', description],
      ['name', 'twitter:image', image],
    ],
  };
}

/** Used by scripts/prerender.js to write head tags into static HTML */
export function renderHead(data) {
  if (!data) return '';
  const tags = buildTags(data);
  return [
    `<title>${esc(tags.title)}</title>`,
    `<link rel="canonical" href="${esc(tags.canonical)}" />`,
    ...tags.meta.map(([attr, key, val]) => `<meta ${attr}="${key}" content="${esc(val)}" />`),
  ].join('\n    ');
}

// ---------- Reusable structured-data builders ----------
const hq = COMPANY.offices[0];

export const orgSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: COMPANY.name,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  image: DEFAULT_IMAGE,
  email: COMPANY.email,
  telephone: COMPANY.phoneDisplay,
  priceRange: '₹₹',
  description:
    'Website and mobile app development company in Bangalore offering SEO-friendly websites, e-commerce stores and Android/iOS apps.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: hq.street,
    addressLocality: hq.city,
    addressRegion: hq.region,
    postalCode: hq.postal,
    addressCountry: 'IN',
  },
  areaServed: ['Bengaluru', 'Karnataka', 'Tamil Nadu', 'India'],
  openingHours: 'Mo-Sa 09:30-19:00',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: COMPANY.phoneDisplay,
    email: COMPANY.email,
    contactType: 'sales',
    availableLanguage: ['English', 'Kannada', 'Tamil', 'Hindi'],
  },
});

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: `${SITE_URL}${path}`,
  })),
});
