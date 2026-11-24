import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En développement, les appels /api sont redirigés vers le backend Spring Boot
    // (même comportement que le proxy Nginx en Docker).
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
