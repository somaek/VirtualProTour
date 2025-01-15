import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/virtual-pro-tour/', // Replace with your repo name
  build: {
    outDir: 'docs' // Change build output to 'docs' instead of 'dist'
  }
})
