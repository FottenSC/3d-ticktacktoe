import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/3d-ticktacktoe/', // GitHub Pages repository name
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000, // Three.js is large, this is expected
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
})
