# Claude project guide

## Project overview
This repository is a React + Vite business website for WebOnspark Technologies, with a small
Node/Express + MySQL backend.

- `client/` — the entire front-end app (React + Vite).
- `server/` — Express API backed by MySQL. Handles form submissions and admin login.

Inside `client/`:
- App entry: `src/App.jsx`
- Main content pages: `src/pages/`
- Shared UI: `src/components/`
- Static data and marketing content: `src/data/`
- Styling: `src/styles/global.css` and `src/css/`
- Build config: `vite.config.js`
- API base URL config: `src/config.js` → `API_URL`

Inside `server/`:
- Entry point: `index.js`
- DB connection: `config/db.js` (reads `DB_*` from `.env`)
- Routes: `routes/forms.js` (`POST /api/forms`), `routes/admin.js` (`POST /api/admin/login`)
- Controllers: `controllers/formsController.js`, `controllers/adminController.js`
- Admin seed script: `scripts/seedAdmin.js` (upserts the admin account from `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`)

## Core commands
Backend (from `server/`):

```bash
cd server
npm install
npm run dev
```

Frontend (from `client/`, separate terminal):

```bash
cd client
npm install
npm run dev
```

Production build (frontend):

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Important implementation notes
- Frontend: React Router with code-splitting via lazy-loaded pages, pre-rendered to static HTML at build time.
- Forms (Enquiry, Contact, Career, Question) POST JSON to `${API_URL}/forms`, which the backend inserts into
  the `webonspark.form_submissions` MySQL table. No email notification is sent on submission currently.
- `/admin` is a real, database-backed login (bcrypt password hash in `webonspark.admins`, JWT on success).
  The client `Login` page (`src/pages/Login.jsx`, lead-capture, no password) is intentionally disabled —
  its route/nav link are commented out in `client/src/App.jsx` and `client/src/components/Header.jsx`.
- SEO metadata, canonical URLs, JSON-LD snippets, and prerendering are handled during the Vite build.
- `npm run build` (in `client/`) runs both the client build and SSR/prerender steps, as defined in `client/package.json`.
- The README contains deployment, DB setup, and content-editing instructions: `README.md`.

## Where to edit content
- Business details / domain / API URL: `client/src/config.js`
- Services and template content: `client/src/data/services.js`
- Blog content: `client/src/data/blogs.js`
- Home page marketing copy: `client/src/data/home.js`
- Design tokens: `client/src/styles/global.css`

## Working style for this repo
- Prefer small, targeted changes.
- Keep React component logic readable and consistent with the existing structure.
- Do not break the pre-rendering and route assumptions when editing pages or SEO metadata.
- When changing forms, preserve the existing DB-backed submission and validation patterns (`server/routes/forms.js`, `client/src/utils/submitForm.js`).

## Verification
Before claiming the fix works, run the relevant validation command and confirm it exits successfully.

Typical verification for this project:

```bash
# frontend
cd client && npm run build

# backend
cd server && node index.js   # check for "MySQL connected" in the log
```
