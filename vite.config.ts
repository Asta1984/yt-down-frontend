import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
   build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // add other heavy libs here, e.g. state management, charting
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
  alias: {
    "@": path.resolve(import.meta.dirname, "./src"),
  },
},
})
