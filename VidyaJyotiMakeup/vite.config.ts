import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssMinify: 'lightningcss',
    // Cinematic media is served from /public and streamed, never bundled.
    assetsInlineLimit: 2048,
  },
})
