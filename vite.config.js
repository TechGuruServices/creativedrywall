import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

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
  ],
})
