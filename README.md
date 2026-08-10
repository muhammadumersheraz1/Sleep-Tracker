# Lumen Sleep — Sleep Tracker

A Progressive Web App to track sleep and wake cycles, notes, and monthly sleep patterns.

## Features

- Sleep / Wake toggle with live session timer
- Optional notes per session
- Multiple sleep cycles per day
- Monthly bar chart of daily sleep duration
- Daily totals with expandable session details per date
- Export data as JSON or CSV
- Installable PWA with offline support
- Demo data for quick testing

## Getting started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build (includes PWA assets) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run oxlint |

## Install as PWA

1. Run `npm run build && npm run preview`
2. Open the preview URL in Chrome/Edge/Safari
3. Use **Install** / Add to Home Screen

## SEO & deploy

The app includes SEO-friendly HTML meta tags, Open Graph/Twitter cards, JSON-LD, `robots.txt`, and `sitemap.xml`.

Production builds use the GitHub Pages base path `/Sleep-Tracker/`. After deploying to GitHub Pages, the public URL is:

`https://muhammadumersheraz1.github.io/Sleep-Tracker/`

If you use a custom domain, update the canonical/Open Graph URLs in `index.html`, `public/robots.txt`, and `public/sitemap.xml`, and set `base: '/'` in `vite.config.ts`.

## Tech stack

- React + TypeScript
- Vite
- Recharts
- vite-plugin-pwa
- Local storage for persistence
