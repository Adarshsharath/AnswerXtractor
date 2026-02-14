import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                 // 👈 IMPORTANT (accept external hosts)
    port: 3000,
    strictPort: true,
    allowedHosts: [
      '.trycloudflare.com'      // 👈 allows ALL Cloudflare tunnel URLs
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})