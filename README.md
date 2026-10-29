# Aloha, soy Ione

**Desarrolladora Web · TypeScript, React, Next.js, Python & Automatizaciones**

Este es el código de mi portfolio personal en [thebellepoque.dev](https://www.thebellepoque.dev). Construido desde cero con Next.js 16, React 19 y TypeScript, sin plantillas. Cada decisión técnica tiene una razón.

## Que hay aqui

- **Portfolio interactivo** con tema oscuro/claro, diseño neón y secciones animadas
- **Blog** con posts en Markdown, renderizado via `react-markdown`
- **4 proyectos** con métricas, badges y páginas de caso de estudio (`/proyecto/:id`)
- **SEO completo**: Open Graph, Twitter Cards, JSON-LD por ruta, sitemap dinámico, imágenes WebP/AVIF
- **Formulario de contacto** serverless con SMTP de Namecheap Private Email (`nodemailer`)
- **150 tests** (Vitest + Testing Library + axe-core a11y)
- **Headers de seguridad** (HSTS, COOP, anti-clickjacking) y `security.txt`

## Stack

| Capa       | Tecnología                                                                |
|------------|---------------------------------------------------------------------------|
| Framework  | Next.js 16 App Router · React 19 · TypeScript 5.9                        |
| Estilos    | SCSS modular (BEM) · CSS custom properties · temas dark/light             |
| SEO        | Next.js Metadata API · JSON-LD · sitemap · imágenes WebP/AVIF             |
| Testing    | Vitest · Testing Library · axe-core (a11y) · puppeteer (contrast CI)     |
| CI/CD      | GitHub Actions (tests, lint, a11y, build) · Vercel deploy                 |
| Infra      | Vercel serverless · SMTP Private Email · HSTS · COOP · security.txt       |

## Correr localmente

```bash
# Requisitos: Node.js 22+, pnpm
pnpm install
pnpm run dev        # http://localhost:3000

# Tests
pnpm test:run
pnpm test:coverage

# Validación pre-deploy
pnpm run check:preprod   # tests + lint + build + audit

# Variantes de imagen (manual; no corre en CI ni en el build)
# Solo hace falta tras añadir o reemplazar fuentes en public/images/blog/
# o public/og-image-default.jpg. Las variantes *-600 / *-900 van en el repo.
pnpm run optimize:images
```

## Estructura

```text
src/
  components/   # Componentes React (BEM), co-localizados con tests
  hooks/        # useTheme, useActiveSection
  lib/          # Lógica: proyectos, posts (Markdown), fechas, imágenes
  app/          # Páginas Next.js App Router
  styles/       # SCSS por capas: base → utilities → themes → components
  types/        # Tipos TypeScript
api/            # Serverless functions (Vercel)
content/        # Posts del blog en Markdown
scripts/        # Sitemap, auditoría de contraste, imágenes
```

## Seguridad

Headers aplicados a todas las respuestas desde `next.config.ts` —versionados con el código, no en `vercel.json`—: `Strict-Transport-Security` con `includeSubDomains`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin` y una `Permissions-Policy` restrictiva. `X-Powered-By` deshabilitado. Reporte de vulnerabilidades vía `security.txt` (RFC 9116) en `/security.txt`.

**Pendiente: Content-Security-Policy.** Todavía no hay CSP. `experimental.inlineCss` inyecta etiquetas `<style>` en el HTML, así que `style-src 'self'` las bloquearía: primero hay que generar hashes en build (o migrar a nonce) y recién después activar la política con `default-src 'self'`. Nada de `unsafe-inline` en `script-src`.

## Licencia

MIT. El código es público para que puedas ver cómo está construido. Si algo te inspira, úsalo.
