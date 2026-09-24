# WebOnspark Technologies — Website (React + React-Bootstrap)

Business website for **WebOnspark Technologies** (Bengaluru HQ · Tamil Nadu branch), with a small
Node/Express + MySQL backend for forms and admin login.
React 18 · React-Bootstrap 5 · plain CSS & JS · Vite · Express · MySQL.

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
| Admin login (staff only, not indexed) | `/admin` |
| Privacy policy | `/privacy-policy` |

Every one of the 15 service pages has the **same heading structure**: Overview → Key features →
6 templates (with preview + "Use this template") → Process → FAQs → **Enquiry form** → Related.

> The visitor-facing client "Login" page (name/email/phone lead capture, no password) exists in the
> code at `client/src/pages/Login.jsx` but is currently disabled — its route and nav link are commented
> out in `client/src/App.jsx` and `client/src/components/Header.jsx`.

## Folder structure
```
client/   All front-end code (React + Vite app).
server/   Backend API (Express + MySQL) — forms storage and admin login.
```

## Run it
Backend (from `server/`):
```bash
cd server
npm install
cp .env.example .env   # fill in DB_* and JWT_SECRET
mysql -u <user> -p <database> < config/dbschema.sql   # create all tables (safe to re-run)
mysql -u <user> -p <database> < config/db.data.sql    # optional: load the real services/blogs content
npm run dev             # http://localhost:5000
```

Frontend (from `client/`, in a separate terminal):
```bash
cd client
npm install
npm run dev        # http://localhost:5173
npm run build      # production build + pre-renders all pages + sitemap.xml
npm run preview    # test the production build
```

## Forms → database
All forms (Enquiry, Contact, Career, Question) POST as JSON to the backend API, configured in
`client/src/config.js` → `API_URL` (or `client/.env` → `VITE_API_URL`, default `http://localhost:5000/api`).
The Express route `POST /api/forms` (`server/routes/forms.js`) saves every submission into the
`webonspark.form_submissions` MySQL table (`form_type`, `page`, `payload` JSON, `created_at`) — query it
directly, or build an admin view on top of it later.

> There is currently no email notification on new submissions (the old Google Apps Script setup sent
> one automatically). Add that back with something like `nodemailer` in `server/controllers/formsController.js`
> if you want it.

## Admin login
`/admin` is a real, database-backed login for WebOnspark staff — separate from the disabled client
"Login" page above. Credentials live in the `webonspark.admins` table (`email`, `password_hash`,
bcrypt-hashed); `POST /api/admin/login` (`server/controllers/adminController.js`) verifies the password
and returns a signed JWT (`JWT_SECRET` in `server/.env`) which the client stores in `localStorage`.

To create or reset the admin account, set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env` and run:
```bash
cd server
node scripts/seedAdmin.js
```

## SEO built in
- Every page is **pre-rendered to static HTML** at build time → Google sees full content instantly.
- Unique title, meta description, canonical, Open Graph / Twitter tags per page.
- JSON-LD: ProfessionalService (with BTM Layout address), FAQPage, BreadcrumbList, Service, BlogPosting.
- `sitemap.xml` + `robots.txt` generated automatically (`/admin` is excluded from both, same as the disabled `/login`).
- Original, human-written copy for all pages and blogs.

**After going live:** set your real domain in `client/src/config.js` → `SITE_URL`, rebuild, then submit
`https://yourdomain/sitemap.xml` in Google Search Console and create/verify your Google Business Profile
with the same address & phone. Replace the 3 **sample testimonials** in `client/src/data/home.js` with real client reviews.

## Speed & security
- Code-split pages (each page loads only its own JS), no images to download (templates are pure CSS), inline SVG icons.
- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer & Permissions Policy) in `client/public/_headers` (Netlify) and `client/vercel.json` (Vercel).
- Form safety: input sanitising, spreadsheet-formula-style injection guard (kept in case data is ever exported to CSV/Excel), honeypot anti-bot field, 30-second resubmit cooldown, server-side re-validation in the Express API.
- Admin passwords are bcrypt-hashed in the database, never stored or logged in plain text; login issues a JWT rather than a long-lived session cookie.

## Deploy (recommended: Netlify or Vercel, free, for the frontend)
- **Netlify:** connect the repo → set **Base directory** to `client` in site settings (already reflected in `client/netlify.toml` with `base = "client"`), build `npm run build`, publish `dist`.
- **Vercel:** import the project → set **Root Directory** to `client` in project settings — settings then come from `client/vercel.json`.
- The `server/` API needs a Node host (Railway, Render, a VPS, etc.) with a reachable MySQL database — point `client`'s `VITE_API_URL` at its deployed URL.

## Where to edit content
| What | File |
|---|---|
| Phone, email, address, domain, API URL | `client/src/config.js` |
| 15 services, templates, FAQs | `client/src/data/services.js` |
| Blogs | `client/src/data/blogs.js` |
| Home "why us", testimonials, FAQs | `client/src/data/home.js` |
| Job openings | `client/src/pages/Careers.jsx` |
| Colours & design | `client/src/styles/global.css` (`:root` variables) |
| Database connection | `server/config/db.js`, `server/.env` |
| Forms API | `server/routes/forms.js`, `server/controllers/formsController.js` |
| Admin login | `server/routes/admin.js`, `server/controllers/adminController.js` |
