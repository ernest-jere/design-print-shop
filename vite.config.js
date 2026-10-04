import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Replaces the legacy __dirname warning with modern import.meta.dirname
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
