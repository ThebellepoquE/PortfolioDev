# thebellepoque · React Portfolio

Portfolio personal en **React + Vite + TypeScript** con sistema de estilos SCSS modular, formulario de contacto con **Resend**, SEO dinámico con **react-helmet-async**, proyectos con métricas y páginas de detalle.

## Estado actual (actualizado)

- **Gestión de paquetes:** pnpm (versión fijada con Corepack en `packageManager`).
- Tema oscuro/claro consolidado en SCSS (`:root` + `:root.light`).
- Estilos modularizados por componentes y por capas (`base`, `utilities`, `themes`, `components/*`).
- Lint de estilos activo con Stylelint + SCSS (`pnpm run lint:styles`).
- Flujo de contacto vía serverless en `/api/contact` usando Resend.
- **SEO:** meta dinámicos por ruta (Home, Blog, posts, proyectos) con Open Graph y Twitter Cards.
- **Proyectos:** modelo enriquecido con métricas, enlaces (live/repo) y página de detalle `/proyecto/:id`.
- Build, lint y tests preparados para checks de preproducción. Suite de **74 tests** en 7 archivos (Vitest + Testing Library); cobertura con `pnpm run test:coverage`.
- **Proyectos:** modelo con campo opcional `status?: 'live' | 'wip'`; si `status === 'wip'` se muestra el badge "En construcción" en la tarjeta (ej. Discográfica).

## Stack

- React 19 + React DOM 19
- Vite 7
- TypeScript 5.9
- Sass/SCSS (arquitectura modular)
- react-helmet-async (SEO)
- Stylelint (SCSS), ESLint
- Vitest + Testing Library

## Requisitos

- **Node.js** 18+ (recomendado 20+)
- **pnpm** (o activar Corepack: `corepack enable` para usar la versión fijada en `package.json`)

## Scripts principales

```bash
pnpm run dev
pnpm run build
pnpm run preview

pnpm run lint
pnpm run lint:styles

pnpm run test -- --run
pnpm run test:coverage

pnpm run audit:prod
pnpm run check:preprod
```

`check:preprod` ejecuta: tests, eslint, build y auditoría de dependencias de producción.

El build (`pnpm run build`) ejecuta `generate-sitemap` antes de compilar.

## Estructura relevante

```text
src/
  App.tsx
  main.tsx
  lib/
    config.ts
    projects.ts
    posts.ts
    formatDate.ts
  types/
    project.ts
  components/
    Navbar.tsx
    Hero.tsx
    Projects.tsx
    ProjectCard.tsx
    MetricBadge.tsx
    SEO.tsx
    Contact.tsx
    __tests__/
      ProjectCard.test.tsx
      MetricBadge.test.tsx
    SectionTitle.test.tsx
    Contact.test.tsx
    ErrorBoundary.test.tsx
    Blog/
      BlogList.tsx
      BlogList.test.tsx
      BlogPost.tsx
      __tests__/
        BlogPost.test.tsx
  pages/
    ProjectPage.tsx
  styles/
    _variables.scss
    main.scss
    base/
    utilities/
    themes/
    components/
      Navbar.scss
      Hero.scss
      Projects.scss
      MetricBadge.scss
      ProjectPage.scss
      ...
api/
  contact.js
content/
  posts/          # Markdown del blog
public/
  sitemap.xml
  robots.txt
```

## Rutas

- `/` — Home (Hero, Proyectos, Contacto)
- `/blog` — Lista de posts
- `/blog/:slug` — Post individual
- `/proyecto/:id` — Detalle de proyecto (SEO y contenido enriquecido)

## Contacto (Resend)

El formulario (`src/components/Contact.tsx`) envía a `/api/contact`.

Variables necesarias:

```env
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_EMAIL=tu-email@ejemplo.com
```

Referencia local: `.env.example`.

## Desarrollo local y troubleshooting

### Puertos y servidor

- **Puerto por defecto:** `5173` (Vite).
- **Vercel CLI:** Se recomienda evitar `vercel dev` para desarrollo de UI por conflictos de caché y puertos. Usa `pnpm run dev` para una experiencia más rápida y aislada.

### API y backend

Las funciones en `/api/` (como el contacto) son **Serverless Functions** de Vercel. En `pnpm run dev` (Vite) estas rutas no están activas localmente. Para probar el flujo de email completo se requiere el entorno de Vercel o un despliegue de Preview.

### Favicon en caché

Si ves un favicon antiguo: prueba en pestaña de incógnito o limpia datos del sitio (F12 > Application > Storage > Clear site data).

## Calidad

- **Tests:** 74 tests en 7 archivos (ProjectCard, MetricBadge, BlogPost, SectionTitle, BlogList, ErrorBoundary, Contact). Cobertura: `pnpm run test:coverage`.
- Lint estilos estricto con `declaration-no-important: true`.
- Convención BEM en selectores SCSS.
- Validar antes de merge: `pnpm run lint:styles && pnpm run lint && pnpm run test -- --run && pnpm run build`.

## Dependencias

- Registrar en PR/commit toda alta o baja de dependencias (y motivo técnico).
- Tras limpieza, ejecutar `pnpm run check:preprod`.
- **packageManager:** En `package.json` está fijado `"packageManager": "pnpm@10.28.0"` para Corepack.
- **Auditoría:** `pnpm run check:preprod` incluye `pnpm run audit:prod`. Para revisar en cualquier momento: `pnpm run audit:prod`.

## Seguridad

- **CSP** en `vercel.json` con hashes SHA-256 para scripts inline (incluye el script de activación de fuentes async).
- Headers **COOP/COEP**; HSTS y resto de cabeceras de seguridad.
- `robots.txt` válido (sin comentarios, newline final); bloqueo de bots de IA.
- ErrorBoundary: `console.error` solo en DEV.
- `public/security.txt` para reporte de vulnerabilidades.

## Deploy sugerido

1. Configurar variables (`RESEND_API_KEY`, `CONTACT_EMAIL`) en Vercel.
2. Ejecutar `pnpm run check:preprod` antes de desplegar.
3. Deploy con output `dist`.

## Mejoras recientes (Mar 2026)

### Rendimiento y LCP

- **Preload imagen de perfil (LCP):** `<link rel="preload" imagesrcset imagesizes>` (sin `href` para evitar doble petición).
- **Preload hoja de fuentes** Google Fonts.
- **Carga asíncrona de fuentes:** patrón `media="print"` + script inline con hash en CSP para no bloquear el render (evitar FOIT/FOUT).

### Seguridad

- CSP con hashes SHA-256 para scripts inline (incluye script de activación de fuentes).
- Headers COOP/COEP en `vercel.json`.
- `robots.txt` válido (sin comentarios, newline final).
- ErrorBoundary: `console.error` solo en entorno DEV.

### Accesibilidad (Lighthouse)

- **ProjectCard:** ARIA `list`/`listitem` en métricas.
- **ThemeToggle:** SVGs decorativos con `aria-hidden`.
- **Navbar:** enlaces duplicados con `aria-label` diferenciados.
- **Contraste:** `text-shadow` en `.title-neon` y en MetricBadge sobre fondos oscuros.

### Testing

- **Suite:** 74 tests en 7 archivos (Vitest + Testing Library): ProjectCard (12), MetricBadge (8), BlogPost (7), SectionTitle, BlogList, ErrorBoundary, Contact.
- Tests en `src/components/__tests__/` (ProjectCard, MetricBadge), `src/components/Blog/__tests__/` (BlogPost) y colocados junto al componente (SectionTitle, Contact, ErrorBoundary, BlogList).
- Cobertura: `pnpm run test:coverage`. Incluido en `check:preprod`.

### SEO

- **Sitemap** generado en build (`scripts/generate-sitemap.ts`); `generate-sitemap` se ejecuta en `pnpm run build`.
- Imagen OG por defecto: `public/og-image-default.jpg`.
- `robots.txt` con directiva Sitemap y bloqueo de bots de IA. No usar directivas no estándar (p. ej. `Content-Signal`); Lighthouse las marca como inválidas.

### Contenido y UX

- **Proyectos enriquecidos:** Modelo con métricas, enlaces (live/repo), badge "Destacado" y "Ver caso de estudio" → `/proyecto/:id`. Campo opcional `status?: 'live' | 'wip'`: si `status === 'wip'` se muestra el badge "En construcción" en la tarjeta (ej. proyecto Discográfica); en ese caso no se muestra "Destacado".
- **Página de proyecto:** `/proyecto/:id` con SEO tipo article, fechas "día de mes de año".
- **Fechas:** `formatDateDayMonthYear` en `src/lib/formatDate.ts` (blog y proyectos).

### Infraestructura

- **Stack:** pnpm 10.28.0, React 19, Vite 7, TypeScript 5.9.
- **check:preprod:** test, lint, build, audit:prod.
