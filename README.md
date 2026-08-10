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
