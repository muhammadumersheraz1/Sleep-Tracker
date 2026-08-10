import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command }) => ({
  // GitHub Pages project site needs a subpath; local/dev stays at root.
  base: command === 'build' ? '/Sleep-Tracker/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons/apple-touch-icon.png',
        'icons/icon.svg',
        'robots.txt',
        'sitemap.xml',
      ],
      manifest: {
        name: 'Lumen Sleep — Sleep Tracker',
        short_name: 'Lumen Sleep',
        description:
          'Free sleep tracker to log sleep and wake cycles, notes, and monthly sleep patterns.',
        theme_color: '#0a2a32',
        background_color: '#0a2a32',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        scope: './',
        lang: 'en',
        categories: ['health', 'lifestyle', 'productivity'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,txt,xml,woff2}'],
        navigateFallback: 'index.html',
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
}))
