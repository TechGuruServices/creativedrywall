import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://creativedrywall.buzz',
      // For SPA with only one true page, we list only the homepage
      // Google will discover content via JavaScript rendering
      dynamicRoutes: [],
      // Sitemap configuration
      exclude: [],
      outDir: 'dist',
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date(),
      // Readable XML output
      readable: true,
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: "Creative Drywall Missoula",
        short_name: "Creative Drywall",
        description: "Missoula's premier drywall contractor since 1976. Expert installation, repair & texturing for homes and businesses. Free estimates!",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0a0f",
        theme_color: "#0f172a",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/favicon-48x48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react']
        }
      }
    }
  }
})
