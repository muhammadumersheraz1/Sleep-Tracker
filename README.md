# Lumen Sleep — Sleep Tracker

A Progressive Web App to track sleep and wake cycles, notes, and monthly sleep patterns.

**Live app:** [https://sleep-tracker-nine-pi.vercel.app/](https://sleep-tracker-nine-pi.vercel.app/)

## Features

- Sleep / Wake toggle with live session timer
- Optional notes per session
- Multiple sleep cycles per day
- Monthly bar chart of daily sleep duration
- Daily totals with expandable session details per date
- Export data as JSON or CSV
- Installable PWA with offline support

## Getting started

```bash
npm install
cp .env.example .env
```

Fill in your Firebase web app keys in `.env`, then:

```bash
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Firebase setup

1. Create a Firebase project and enable **Authentication → Email/Password**
2. Create a **Cloud Firestore** database
3. Create a collection named exactly `sleeping logs` (documents are created by the app)
4. Deploy the rules in `firestore.rules` (or paste them into the Firebase console)
5. Add the same `VITE_FIREBASE_*` values in Vercel Environment Variables for production

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build (includes PWA assets) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run oxlint |

## Install as PWA

1. Open [the live app](https://sleep-tracker-nine-pi.vercel.app/) (or run `npm run build && npm run preview`)
2. Use **Install** / Add to Home Screen in your browser

## SEO & deploy

Deployed on Vercel with SEO meta tags, Open Graph/Twitter cards, JSON-LD, `robots.txt`, and `sitemap.xml`.

Canonical site URL: `https://sleep-tracker-nine-pi.vercel.app/`

## Tech stack

- React + TypeScript
- Vite
- Recharts
- vite-plugin-pwa
- Local storage for persistence
