import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})