import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons/apple-touch-icon.png',
        'icons/icon.svg',
        'icons/shortcut-sleep.png',
        'icons/shortcut-wake.png',
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
        start_url: '/',
        scope: '/',
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
        shortcuts: [
          {
            name: 'Start sleep',
            short_name: 'Sleep',
            description: 'Start a sleep session now',
            url: '/?action=sleep',
            icons: [
              {
                src: 'icons/shortcut-sleep.png',
                sizes: '192x192',
                type: 'image/png',
              },
            ],
          },
          {
            name: 'Wake up',
            short_name: 'Wake',
            description: 'End the current sleep session',
            url: '/?action=wake',
            icons: [
              {
                src: 'icons/shortcut-wake.png',
                sizes: '192x192',
                type: 'image/png',
              },
            ],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,txt,xml,woff2}'],
        navigateFallback: '/index.html',
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
