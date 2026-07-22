import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load .env into process.env for build-time replacements
dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL)
  }
})
