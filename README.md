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
- Build, lint y tests preparados para checks de preproducción.

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
    Blog/
      BlogList.tsx
      BlogPost.tsx
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

- Lint estilos estricto con `declaration-no-important: true`.
- Convención BEM en selectores SCSS.
- Validar antes de merge: `pnpm run lint:styles && pnpm run lint && pnpm run test -- --run && pnpm run build`.

## Dependencias

- Registrar en PR/commit toda alta o baja de dependencias (y motivo técnico).
- Tras limpieza, ejecutar `pnpm run check:preprod`.
- **packageManager:** En `package.json` está fijado `"packageManager": "pnpm@10.28.0"` para Corepack.
- **Auditoría:** `pnpm run check:preprod` incluye `pnpm run audit:prod`. Para revisar en cualquier momento: `pnpm run audit:prod`.

## Seguridad

- Headers de seguridad en `vercel.json` (CSP, HSTS).
- Middleware defensivo en `middleware.js`.
- `public/security.txt` para reporte de vulnerabilidades.

## Deploy sugerido

1. Configurar variables (`RESEND_API_KEY`, `CONTACT_EMAIL`) en Vercel.
2. Ejecutar `pnpm run check:preprod` antes de desplegar.
3. Deploy con output `dist`.

## Mejoras recientes (Mar 2026)

### Contenido y UX

- **Proyectos enriquecidos:** Modelo con métricas, enlaces (live/repo), badge “Destacado” y enlace “Ver caso de estudio” a `/proyecto/:id`.
- **Página de proyecto:** Ruta `/proyecto/:id` con SEO (article), fechas en formato “día de mes de año” y contenido detallado.
- **Fechas:** Utilidad `formatDateDayMonthYear` en `src/lib/formatDate.ts` para formato consistente en español (blog y proyectos).

### SEO

- **react-helmet-async:** Meta dinámicos por ruta (title, description, canonical, Open Graph, Twitter Cards) en Home, Blog, posts y páginas de proyecto.
- **SEO.tsx:** Componente reutilizable; imagen OG por defecto configurable (`og-image-default.jpg` recomendado 1200×630).

### Accesibilidad

- **MetricBadge:** Focusable con `tabIndex={0}`, tooltip visible con `:focus-visible`, outline con `currentColor`.
- **Navegación semántica:** Enlaces “Volver” y 404 con `<Link>` / `<a>` nativos.

### Infraestructura

- **Migración a pnpm:** Lockfile `pnpm-lock.yaml`, scripts con `pnpm run`; versión fijada con `packageManager` (Corepack).
