# Aloha, soy Ione

**Desarrolladora Web · TypeScript, React, Next.js, Python & Automatizaciones**

Este es el código de mi portfolio personal en [thebellepoque.dev](https://www.thebellepoque.dev). Construido desde cero con Next.js 15, React 19 y TypeScript, sin plantillas. Cada decisión técnica tiene una razón.

## Que hay aqui

- **Portfolio interactivo** con tema oscuro/claro, diseño neón y secciones animadas
- **Blog** con posts en Markdown, renderizado via `react-markdown`
- **4 proyectos** con métricas, badges y páginas de caso de estudio (`/proyecto/:id`)
- **SEO completo**: Open Graph, Twitter Cards, JSON-LD por ruta, sitemap dinámico, imágenes WebP/AVIF
- **Formulario de contacto** serverless con Resend
- **135 tests** (Vitest + Testing Library + axe-core a11y)
- **CSP estricta**, headers de seguridad, bloqueo de bots IA, `security.txt`

## Stack

| Capa       | Tecnología                                                                |
|------------|---------------------------------------------------------------------------|
| Framework  | Next.js 15 App Router · React 19 · TypeScript 5.9                        |
| Estilos    | SCSS modular (BEM) · CSS custom properties · temas dark/light             |
| SEO        | Next.js Metadata API · JSON-LD · sitemap · imágenes WebP/AVIF             |
| Testing    | Vitest · Testing Library · axe-core (a11y) · puppeteer (contrast CI)     |
| CI/CD      | GitHub Actions (tests, lint, a11y, build) · Vercel deploy                 |
| Infra      | Vercel serverless (Resend) · CSP headers · HSTS · security.txt            |

## Correr localmente

```bash
# Requisitos: Node.js 22+, npm
npm install
npm run dev         # http://localhost:3000

# Tests
pnpm test:run
pnpm test:coverage

# Validación pre-deploy
pnpm run check:preprod   # tests + lint + build + audit
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

CSP con hashes SHA-256, COOP/COEP, HSTS, bloqueo de bots IA en `robots.txt`, `security.txt` para reportes. Sin `unsafe-inline`.

## Licencia

MIT. El código es público para que puedas ver cómo está construido. Si algo te inspira, úsalo.
