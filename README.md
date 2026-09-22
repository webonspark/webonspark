# WebOnspark Technologies — Website (React + React-Bootstrap)

Front-end only business website for **WebOnspark Technologies** (Bengaluru HQ · Tamil Nadu branch).
React 18 · React-Bootstrap 5 · plain CSS & JS · Vite.

## What's inside
| Page | URL |
|---|---|
| Home (10 sections: banner, highlights, services, why us, process, templates, testimonials, FAQ + ask a question, blog, WhatsApp strip) | `/` |
| About | `/about` |
| Services (highlighted, blinking nav item with mega dropdown) | `/services` |
| App Development + 5 app pages | `/services/app-development/...` |
| Website Development + 10 website pages | `/services/website-development/...` |
| Careers (openings + application form) | `/careers` |
| Blog + 5 original SEO articles | `/blog` |
| Contact (offices, map, form) | `/contact` |
| Login | `/login` |
| Privacy policy | `/privacy-policy` |

Every one of the 15 service pages has the **same heading structure**: Overview → Key features →
6 templates (with preview + "Use this template") → Process → FAQs → **Enquiry form** → Related.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build + pre-renders all 30 pages + sitemap.xml
npm run preview    # test the production build
```

## Connect forms to Excel + Email (important — 10 minutes, free)
All forms (Login, Enquiry, Contact, Career, Question) post to one Google Apps Script. It
**saves each submission as a row in a Google Sheet** (one tab per form; File → Download → Microsoft Excel .xlsx anytime)
and **emails the details to info.webonspark@gmail.com**.

1. Sign in to **inf@gmail.com** → create a new Google Sheet named "WebOnspark Leads".
2. In the sheet: **Extensions → Apps Script**. Delete the sample code and paste `google-apps-script/Code.gs`. Save.
3. Click **Deploy → New deployment → type: Web app**.
   - Execute as: **Me** · Who has access: **Anyone** → Deploy → allow permissions.
4. Copy the Web app URL (ends with `/exec`).
5. Paste it into `src/config.js` → `SHEET_ENDPOINT` (or create `.env` with `VITE_SHEET_ENDPOINT=...`).
6. `npm run build` and redeploy. Submit a test form — you'll get an email and a new row.

> Gmail's free limit is about 100 emails/day from Apps Script. Visitors also get a polite auto-reply
> (turn off with `SEND_AUTO_REPLY = false` in Code.gs).

## About the login
There is no backend, so the login is a **lead-capture sign-in**: name, email, mobile, company.
The details are emailed + saved to the "Login" sheet, and the visitor stays signed in on that browser
for 7 days (shown in the navbar). Passwords are deliberately **not** collected — a front-end-only site
can't verify them, and emailing passwords would be unsafe. For real accounts later, add Firebase Auth or a backend.

## SEO built in
- Every page is **pre-rendered to static HTML** at build time → Google sees full content instantly.
- Unique title, meta description, canonical, Open Graph / Twitter tags per page.
- JSON-LD: ProfessionalService (with BTM Layout address), FAQPage, BreadcrumbList, Service, BlogPosting.
- `sitemap.xml` + `robots.txt` generated automatically.
- Original, human-written copy for all pages and blogs.

**After going live:** set your real domain in `src/config.js` → `SITE_URL`, rebuild, then submit
`https://yourdomain/sitemap.xml` in Google Search Console and create/verify your Google Business Profile
with the same address & phone. Replace the 3 **sample testimonials** in `src/data/home.js` with real client reviews.

## Speed & security
- Code-split pages (each page loads only its own JS), no images to download (templates are pure CSS), inline SVG icons.
- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer & Permissions Policy) in `public/_headers` (Netlify) and `vercel.json` (Vercel).
- Form safety: input sanitising, spreadsheet-formula injection guard, honeypot anti-bot field, 30-second resubmit cooldown, server-side re-validation in Apps Script.

## Deploy (recommended: Netlify or Vercel, free)
- **Netlify:** connect the repo or drag the `dist` folder → build `npm run build`, publish `dist` (already in `netlify.toml`).
- **Vercel:** import the project — settings come from `vercel.json`.

## Where to edit content
| What | File |
|---|---|
| Phone, email, address, domain, form URL | `src/config.js` |
| 15 services, templates, FAQs | `src/data/services.js` |
| Blogs | `src/data/blogs.js` |
| Home "why us", testimonials, FAQs | `src/data/home.js` |
| Job openings | `src/pages/Careers.jsx` |
| Colours & design | `src/styles/global.css` (`:root` variables) |


