# Aloha, soy Ione

**Desarrolladora Web · Formación Full-stack · Python, JavaScript, React, MySQL, TypeScript & Automatizaciones**

Este es el código de mi portfolio personal en [thebellepoque.dev](https://thebellepoque.dev). Construido desde cero con React 19, Vite 7 y TypeScript, sin plantillas. Cada decisión técnica tiene una razón.

## Que hay aqui

- **Portfolio interactivo** con tema oscuro/claro, diseño neón y secciones animadas
- **Blog** con posts en Markdown, renderizado via `react-markdown`
- **6 proyectos** con métricas, badges y páginas de caso de estudio (`/proyecto/:id`)
- **SEO completo**: Open Graph, Twitter Cards, JSON-LD por ruta, sitemap dinámico, imágenes WebP/AVIF
- **Formulario de contacto** serverless con Resend
- **135 tests** (Vitest + Testing Library + axe-core a11y)
- **CSP estricta**, headers de seguridad, bloqueo de bots IA, `security.txt`

## Stack

| Capa       | Tecnología                                                                |
|------------|---------------------------------------------------------------------------|
| Frontend   | React 19 · TypeScript 5.9 · Vite 7                                       |
| Estilos    | SCSS modular (BEM) · CSS custom properties · temas dark/light             |
| SEO        | react-helmet-async · JSON-LD · sitemap · imágenes WebP/AVIF               |
| Testing    | Vitest · Testing Library · axe-core (a11y) · puppeteer (contrast CI)     |
| CI/CD      | GitHub Actions (tests, lint, a11y, build) · Vercel deploy                 |
| Infra      | Vercel serverless (Resend) · CSP headers · HSTS · security.txt            |

## Correr localmente

```bash
# Requisitos: Node.js 22+, pnpm
pnpm install
pnpm run dev        # http://localhost:5173

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
  pages/        # Páginas (lazy-loaded por ruta)
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
