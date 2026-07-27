import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api-restcountries': {
        target: 'https://api.restcountries.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-restcountries/, '')
      },
      '/restcountries-v3': {
        target: 'https://restcountries.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/restcountries-v3/, '')
      }
    }
  }
})
