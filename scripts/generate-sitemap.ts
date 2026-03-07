/**
 * Genera public/sitemap.xml en cada build.
 * Incluye: home, blog, lista de proyectos, cada /proyecto/:id y cada /blog/:slug (excluye drafts).
 * Ejecutar con: pnpm run generate-sitemap (usa tsx para importar desde src).
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { projectsData } from '../src/lib/projects';
import { SITE_CONFIG } from '../src/lib/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const contentPostsDir = join(root, 'content', 'posts');

const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '');

// Prioridades y changefreq según especificación
const STATIC_PAGES = [
  { path: '', priority: '1.0', changefreq: 'weekly' as const },
  { path: 'blog', priority: '0.8', changefreq: 'daily' as const },
];

const PROJECT_PRIORITY = '0.8';
const PROJECT_CHANGEFREQ = 'monthly' as const;
const POST_PRIORITY = '0.7';
const POST_CHANGEFREQ = 'monthly' as const;

/** Normaliza valor de fecha desde YAML (quita comillas y espacios). */
function normalizeDate(raw: string): string {
  const s = raw.trim().replace(/^["']|["']$/g, '');
  return s.trim();
}

function toLastmod(date: string): string {
  const normalized = normalizeDate(date);
  // Acepta YYYY-MM o YYYY-MM-DD; sitemap exige YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
  if (/^\d{4}-\d{2}$/.test(normalized)) return `${normalized}-01`;
  return new Date().toISOString().slice(0, 10);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function readPostsFromFs(): { slug: string; date: string }[] {
  const entries: { slug: string; date: string }[] = [];
  try {
    const slugs = readdirSync(contentPostsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const slug of slugs) {
      const dirPath = join(contentPostsDir, slug);
      const files = readdirSync(dirPath).filter((f) => f.endsWith('-index.md'));
      const indexFile = files[0];
      if (!indexFile) continue;

      const content = readFileSync(join(dirPath, indexFile), 'utf-8');
      // \r?\n acepta LF y CRLF para no saltar posts en Windows
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!fmMatch) {
        console.warn(`[generate-sitemap] Sin frontmatter válido en ${slug}/${indexFile}; omitido.`);
        continue;
      }

      const fm = fmMatch[1];
      const draftMatch = fm.match(/draft:\s*(true|false)/);
      if (draftMatch?.[1] === 'true') continue;

      const dateMatch = fm.match(/date:\s*(.+)/);
      const rawDate = dateMatch?.[1] ?? '';
      const date = rawDate ? normalizeDate(rawDate) || new Date().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      entries.push({ slug, date });
    }
  } catch (err) {
    console.error('Error leyendo content/posts:', err);
  }
  return entries;
}

function buildXml(): string {
  const urls: string[] = [];

  // Páginas estáticas (sin lastmod propio; usamos hoy)
  const today = new Date().toISOString().slice(0, 10);
  for (const page of STATIC_PAGES) {
    const loc = page.path ? `${baseUrl}/${page.path}` : baseUrl;
    urls.push(
      `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`
    );
  }

  // Cada proyecto: /proyecto/:id
  for (const p of projectsData) {
    const loc = `${baseUrl}/proyecto/${encodeURIComponent(p.id)}`;
    const lastmod = toLastmod(p.date);
    urls.push(
      `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${PROJECT_CHANGEFREQ}</changefreq>\n    <priority>${PROJECT_PRIORITY}</priority>\n  </url>`
    );
  }

  // Cada post (no draft)
  const posts = readPostsFromFs();
  for (const post of posts) {
    const loc = `${baseUrl}/blog/${encodeURIComponent(post.slug)}`;
    const lastmod = toLastmod(post.date);
    urls.push(
      `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${POST_CHANGEFREQ}</changefreq>\n    <priority>${POST_PRIORITY}</priority>\n  </url>`
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

// Escribir en public/sitemap.xml (Vite copiará a dist en build)
const outPath = join(publicDir, 'sitemap.xml');
writeFileSync(outPath, buildXml(), 'utf-8');
console.log('Sitemap generado:', outPath);
