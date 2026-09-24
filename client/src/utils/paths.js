// URL builders for dynamic content (services/blogs now live in the database — see ContentContext).
export const servicePath = (s) =>
  `/services/${s.category === 'app' ? 'app-development' : 'website-development'}/${s.slug}`;

export const blogPath = (b) => `/blog/${b.slug}`;
