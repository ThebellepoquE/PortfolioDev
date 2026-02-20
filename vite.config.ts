import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'markdown-vendor';
            }
          }
        },
      },
    },
    minify: 'esbuild',
    cssMinify: 'lightningcss',
  },
})
