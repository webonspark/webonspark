// The actual list of blog posts is stored in the database (see server/models/blog.js)
// and fetched at runtime via ContentContext (client/src/context/ContentContext.jsx).
// Block types used in a post's `content` array: ['h2', text] ['h3', text] ['p', text] ['ul', [items]] ['ol', [items]] ['tip', text]

export const blogPath = (b) => `/blog/${b.slug}`;
