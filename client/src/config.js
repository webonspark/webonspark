
// ============================================================
//  WebOnspark Technologies — site configuration
//  Change values here and they update across the whole website.
// ============================================================

// 1) Base URL of the WebOnspark backend API (see server/).
//    Every form (Login, Enquiry, Contact, Career, Question) posts to this API,
//    which saves the submission in the MySQL database.
//    Set it with an env variable: VITE_API_URL=...
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 2) Your live domain (no trailing slash). Used for canonical URLs, sitemap & social tags.
export const SITE_URL = 'https://www.webonspark.com';

export const COMPANY = {
  name: 'WebOnspark Technologies',
  shortName: 'WebOnspark',
  email: 'webonspark@gmail.com',
  // Primary number — used everywhere a single phone/WhatsApp number is shown.
  phoneDisplay: '+91 96865 95916',
  phoneRaw: '919686595916',
  // Second number — shown alongside the primary on the Contact page.
  phoneDisplay2: '+91 86081 45177',
  phoneRaw2: '918608145177',
  whatsappMessage: "Hi WebOnspark, I'd like to discuss a website / app project.",
  hours: 'Mon – Sat, 9:30 AM – 7:00 PM',
  offices: [
    {
      label: 'Head Office — Bengaluru',
      lines: [
        'WebOnspark Technologies',
        'Service Road 1',
        'HAL Old Airport Rd',
        'Domlur I Stage, 1st Stage',
        'Domlur, Bengaluru',
        'Karnataka 560071'
      ],
      street: 'Service Road, 1, HAL Old Airport Rd, Domlur I Stage, 1st Stage, Domlur, Bengaluru, Karnataka 560071',
      city: 'Bengaluru',
      region: 'Karnataka',
      postal: '560076',
      mapQuery:
        'WJ62+GCH, 3rd Cross Rd, BTM Layout 2nd Stage, Bengaluru, Karnataka 560076',
    },
    {
      label: 'Branch — Tamil Nadu',
      lines: ['WebOnspark Technologies', 'Tamil Nadu, India'],
      region: 'Tamil Nadu',
    },
  ],
};

export const whatsappLink = (text = COMPANY.whatsappMessage, raw = COMPANY.phoneRaw) =>
  `https://wa.me/${raw}?text=${encodeURIComponent(text)}`;

export const mailLink = (subject = 'Project enquiry — WebOnspark') =>
  `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}`;





