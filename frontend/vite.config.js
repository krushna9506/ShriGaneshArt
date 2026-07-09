// Updated for free deployment: Vercel + Render + Neon
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Detect whether we are building for a native app shell (Capacitor)
const isNative = process.env.CAPACITOR_PLATFORM !== undefined;

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ganesh Arts',
        short_name: 'GaneshArts',
        description: 'Premium Operational Portal & Billing for Shri Ganesh Art Studio',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'https://img.icons8.com/color/192/ganesh.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'https://img.icons8.com/color/512/ganesh.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\/api\/(?:dashboard|orders)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              networkTimeoutSeconds: 3
            }
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['axios'],
        }
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: !isNative ? {
      '/api': 'http://localhost:3000'
    } : undefined
  }
});
