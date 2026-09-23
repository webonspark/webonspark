// Category-level page copy (SEO/marketing text) and shared helpers.
// The actual list of services is stored in the database (see server/models/service.js)
// and fetched at runtime via ContentContext (client/src/context/ContentContext.jsx).

export const serviceCategories = {
  app: {
    key: 'app',
    slug: 'app-development',
    name: 'App Development',
    seoTitle: 'Mobile App Development Company in Bangalore | Android & iOS Apps',
    seoDesc:
      'Android and iOS app development for delivery, booking, education, e-commerce and healthcare businesses. Explore templates and get a free quote from WebOnspark.',
    headline: 'Mobile apps people open every day.',
    intro:
      'We design and build Android and iOS apps that feel quick, look modern and solve one real problem for your customers really well. Pick an industry below to explore ready-to-customise templates, or tell us about your idea and we will shape something new.',
  },
  web: {
    key: 'web',
    slug: 'website-development',
    name: 'Website Development',
    seoTitle: 'Website Development Company in Bangalore | SEO-Friendly Websites',
    seoDesc:
      'Fast, secure and SEO-friendly website development for businesses, clinics, schools, restaurants, real estate and e-commerce. Explore 60+ templates by WebOnspark.',
    headline: 'Websites that load fast, rank well and bring enquiries.',
    intro:
      'From a single landing page to a full corporate site or online store, every website we build is mobile-first, search-ready and made to convert. Choose your industry to explore templates designed for it.',
  },
};

export const servicePath = (s) =>
  `/services/${s.category === 'app' ? 'app-development' : 'website-development'}/${s.slug}`;

export const processSteps = [
  ['Discover', 'A free call to understand your business, customers and goals.'],
  ['Plan & design', 'Sitemap, wireframes and a visual design you approve before coding.'],
  ['Build', 'Clean, fast, secure development with weekly progress updates.'],
  ['Test & launch', 'Checks on real phones and browsers, then a smooth launch.'],
  ['Grow', 'SEO, updates and support so your platform keeps improving.'],
];
