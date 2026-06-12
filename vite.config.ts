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
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'markdown-vendor';
            }
            if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
              return 'react-vendor';
            }
          }
        },
      },
    },
    minify: 'esbuild',
    cssMinify: 'lightningcss',
  },
})
