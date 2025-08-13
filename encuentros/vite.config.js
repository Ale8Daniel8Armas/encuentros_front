import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy al API Gateway del backend
      "/api": "http://localhost:8080",
      // Proxy al servidor de subida (Cloudinary signer)
      "/upload": "http://localhost:5000",
    },
  },
})
