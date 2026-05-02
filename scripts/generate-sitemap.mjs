/**
 * Genera public/sitemap.xml en cada build.
 * Incluye: home, blog, cada /proyecto/:id y cada /blog/:slug (excluye drafts).
 * Ejecutar con: pnpm run generate-sitemap.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const contentPostsDir = join(root, 'content', 'posts');
const projectsFile = join(root, 'src', 'lib', 'projects.ts');
const configFile = join(root, 'src', 'lib', 'config.ts');

const STATIC_PAGES = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: 'blog', priority: '0.8', changefreq: 'daily' },
];

const PROJECT_PRIORITY = '0.8';
const PROJECT_CHANGEFREQ = 'monthly';
const POST_PRIORITY = '0.7';
const POST_CHANGEFREQ = 'monthly';

function readBaseUrl() {
  const content = readFileSync(configFile, 'utf-8');
  const match = content.match(/baseUrl:\s*["']([^"']+)["']/);
  if (!match) {
    throw new Error('[generate-sitemap] No se pudo leer SITE_CONFIG.baseUrl.');
  }
  return match[1].replace(/\/$/, '');
}

function readProjectsFromSource() {
  const content = readFileSync(projectsFile, 'utf-8');
  const projects = [];
  const projectMatcher = /id:\s*['"]([^'"]+)['"][\s\S]*?date:\s*['"]([^'"]+)['"]/g;
  let match;

  while ((match = projectMatcher.exec(content)) !== null) {
    projects.push({ id: match[1], date: match[2] });
  }

  if (projects.length === 0) {
    throw new Error('[generate-sitemap] No se encontraron proyectos en src/lib/projects.ts.');
  }

  return projects;
}

function normalizeDate(raw) {
  return raw.trim().replace(/^["']|["']$/g, '').trim();
}

function toLastmod(date) {
  const normalized = normalizeDate(date);
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
  if (/^\d{4}-\d{2}$/.test(normalized)) return `${normalized}-01`;
  return new Date().toISOString().slice(0, 10);
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function readPostsFromFs() {
  const entries = [];
  try {
    const slugs = readdirSync(contentPostsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const slug of slugs) {
      const dirPath = join(contentPostsDir, slug);
      const indexFile = readdirSync(dirPath).find((file) => file.endsWith('-index.md'));
      if (!indexFile) continue;

      const content = readFileSync(join(dirPath, indexFile), 'utf-8');
      const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatterMatch) {
        console.warn(`[generate-sitemap] Sin frontmatter válido en ${slug}/${indexFile}; omitido.`);
        continue;
      }

      const frontmatter = frontmatterMatch[1];
      const draftMatch = frontmatter.match(/draft:\s*(true|false)/);
      if (draftMatch?.[1] === 'true') continue;

      const dateMatch = frontmatter.match(/date:\s*(.+)/);
      const rawDate = dateMatch?.[1] ?? '';
      const date = rawDate ? normalizeDate(rawDate) || new Date().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      entries.push({ slug, date });
    }
  } catch (error) {
    console.error('Error leyendo content/posts:', error);
  }
  return entries;
}

function buildUrl({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildXml() {
  const baseUrl = readBaseUrl();
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  for (const page of STATIC_PAGES) {
    urls.push(buildUrl({
      loc: page.path ? `${baseUrl}/${page.path}` : baseUrl,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    }));
  }

  for (const project of readProjectsFromSource()) {
    urls.push(buildUrl({
      loc: `${baseUrl}/proyecto/${encodeURIComponent(project.id)}`,
      lastmod: toLastmod(project.date),
      changefreq: PROJECT_CHANGEFREQ,
      priority: PROJECT_PRIORITY,
    }));
  }

  for (const post of readPostsFromFs()) {
    urls.push(buildUrl({
      loc: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastmod: toLastmod(post.date),
      changefreq: POST_CHANGEFREQ,
      priority: POST_PRIORITY,
    }));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

const outPath = join(publicDir, 'sitemap.xml');
writeFileSync(outPath, buildXml(), 'utf-8');
console.log('Sitemap generado:', outPath);
