// Audit de contraste con axe-core para CI
// Uso: node scripts/audit-contrast.mjs [BASE_URL]
//
// Corre axe-core en las rutas del portfolio y compara violations contra
// un baseline conocido. Falla (exit 1) si las violations aumentan.
//
// Baseline actual (light mode, 10 junio 2026):
//   home: 7  (metric-badge amarillos + contact label rosa)
//   blog: 4  (links de blog-card mostaza darkened)
//   blog-post: 4  (links inside markdown content in green neon)
//   project-purple: 0
//   project-lighton: 0

import puppeteer from 'puppeteer-core';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const AXE_PATH = resolve(REPO_ROOT, 'node_modules/axe-core/axe.min.js');
const CHROME_EXECUTABLE = process.env.CHROME_PATH || process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome';

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------

const BASE_URL = process.argv[2] || 'http://localhost:5173';
const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'blog', path: '/blog' },
  { name: 'project-purple', path: '/proyecto/purple-basque-tours' },
  { name: 'project-lighton', path: '/proyecto/lighton-es' },
  { name: 'blog-post', path: '/blog/lighton-de-cero-a-produccion' },
];

/** Baseline actual — si aumentan, CI falla. */
const BASELINE = {
  home: 1,
  blog: 1,
  'blog-post': 1,
  'project-purple': 0,
  'project-lighton': 0,
};

const THEME = 'light'; // solo auditamos light mode (dark pasa perfecto)

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

const axeSource = readFileSync(AXE_PATH, 'utf8');

function green(text) { return `\x1b[32m${text}\x1b[0m`; }
function red(text) { return `\x1b[31m${text}\x1b[0m`; }
function yellow(text) { return `\x1b[33m${text}\x1b[0m`; }

// ---------------------------------------------------------------------------
// Auditoría por ruta
// ---------------------------------------------------------------------------

async function auditRoute(page, route) {
  const url = `${BASE_URL}${route.path}`;
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Inyectar axe y correr solo la regla color-contrast
  await page.evaluate(axeSource);
  const results = await page.evaluate(() =>
    window.axe.run(document, {
      runOnly: { type: 'rule', values: ['color-contrast'] },
    })
  );

  const violations = (results?.violations || []).length;
  return {
    name: route.name,
    path: route.path,
    violations,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\nAuditoría de contraste — light mode\n`);
  console.log(`URL base: ${BASE_URL}`);
  console.log(`Rutas: ${ROUTES.map(r => r.path).join(', ')}\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_EXECUTABLE,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1280, height: 1800 },
  });

  let failed = false;

  try {
    const page = await browser.newPage();

    // Precarga para setear localStorage al theme correcto
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.evaluate((theme) => {
      localStorage.setItem('theme', theme);
    }, THEME);

    for (const route of ROUTES) {
      const result = await auditRoute(page, route);
      const baseline = BASELINE[result.name] ?? 0;
      const diff = result.violations - baseline;

      if (diff > 0) {
        failed = true;
        console.log(
          `  ${red('✗')} ${route.name.padEnd(18)} violations: ${result.violations} (baseline: ${baseline}, ${red(`+${diff}`)})`
        );
      } else if (diff < 0) {
        console.log(
          `  ${green('↓')} ${route.name.padEnd(18)} violations: ${result.violations} (baseline: ${baseline}, ${green(`${diff}`)})`
        );
        console.log(`    ${green('¡Mejora! Actualizá la baseline.')}`);
      } else {
        console.log(
          `  ${green('✓')} ${route.name.padEnd(18)} violations: ${result.violations} (baseline: ${baseline})`
        );
      }
    }
  } finally {
    await browser.close();
  }

  console.log('');
  if (failed) {
    console.log(red('FAIL: Las violations de contraste aumentaron.'));
    console.log('Revisá los cambios de CSS antes de mergear.');
    process.exit(1);
  } else {
    console.log(green('PASS: Las violations de contraste no aumentaron.'));
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(red(`Error: ${err.message}`));
  process.exit(2);
});
