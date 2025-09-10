import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Remove the tailwindcss import - it's not needed here
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})