
// ============================================================
//  WebOnspark Technologies — site configuration
//  Change values here and they update across the whole website.
// ============================================================

// 1) Paste your Google Apps Script Web App URL here (see README → "Connect forms").
//    Every form (Login, Enquiry, Contact, Career, Question) posts to this URL,
//    which saves the row into your Google Sheet (downloadable as Excel .xlsx)
//    and emails the details to COMPANY.email.
//    You can also set it with an env variable: VITE_SHEET_ENDPOINT=...
export const SHEET_ENDPOINT =
  import.meta.env.VITE_SHEET_ENDPOINT || 'https://script.google.com/macros/s/AKfycbxg9FRg6Jsyq_fmHmVOucY_ggOytm4zyGdNXI1vzWQShnEVaxpO1pfMU8DLAgqMOkE/exec';

// 2) Your live domain (no trailing slash). Used for canonical URLs, sitemap & social tags.
export const SITE_URL = 'https://www.webonspark.com';

export const COMPANY = {
  name: 'WebOnspark Technologies',
  shortName: 'WebOnspark',
  email: 'info.webonspark@gmail.com',
  phoneDisplay: '+91 86081 45177',
  phoneRaw: '918608145177',
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

export const whatsappLink = (text = COMPANY.whatsappMessage) =>
  `https://wa.me/${COMPANY.phoneRaw}?text=${encodeURIComponent(text)}`;

export const mailLink = (subject = 'Project enquiry — WebOnspark') =>
  `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}`;





