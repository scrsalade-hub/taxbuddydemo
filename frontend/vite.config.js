import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 'taxbuddydemo.vercel.app',
    proxy: {
      '/api': {
        target: 'https://taxbuddydemo.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
