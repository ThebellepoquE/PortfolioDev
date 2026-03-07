import type { Plugin } from 'vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Hace el CSS principal no bloqueante (media="print" + script → "all")
 * y añade preload del CSS para que se pida en paralelo al JS.
 * Objetivo: reducir "Render blocking requests" y critical path en Lighthouse (móvil).
 */
export function viteAsyncCss(): Plugin {
  return {
    name: 'vite-async-css',
    apply: 'build',
    closeBundle() {
      const outDir = 'dist'
      const htmlPath = resolve(process.cwd(), outDir, 'index.html')
      let html: string
      try {
        html = readFileSync(htmlPath, 'utf-8')
      } catch {
        return
      }

      // Encontrar el <link rel="stylesheet" href="/assets/...css" ...> inyectado por Vite (puede llevar crossorigin)
      const linkRegex = /<link[^>]+rel="stylesheet"[^>]+href="(\/assets\/[^"]+\.css)"[^>]*>/i
      const match = html.match(linkRegex)
      if (!match) return

      const [, href] = match
      const preload = `<link rel="preload" as="style" href="${href}">`
      const asyncLink = `<link id="main-css-async" rel="stylesheet" href="${href}" media="print">`
      const script = `<script>(function(){var e=document.getElementById("main-css-async");if(e)e.media="all";})();</script>`

      const replacement = `${preload}\n    ${asyncLink}\n    ${script}`
      const newHtml = html.replace(linkRegex, replacement)

      writeFileSync(htmlPath, newHtml, 'utf-8')
    },
  }
}
