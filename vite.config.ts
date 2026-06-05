import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { viteAsyncCss } from './plugins/vite-async-css'

// https://vite.dev/config/
export default defineConfig({
  server: { open: false },
  plugins: [
    react(),
    viteAsyncCss(),
    ...(process.env.ANALYZE === 'true'
      ? [visualizer({
          open: false,
          filename: 'stats.html',
          gzipSize: true,
          brotliSize: false,
          template: 'treemap',
        })]
      : []),
  ],
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
