# 🧠 Memoria Técnica - PortfolioDev

Este archivo sirve como registro de las decisiones técnicas y el estado del proyecto para facilitar la continuidad entre sesiones.

## 📅 Última actualización: Marzo 2026

### ✅ Estado actual del proyecto

- **Gestión de paquetes:** pnpm (versión 10.28.0 fijada con `packageManager` en `package.json`). Lockfile: `pnpm-lock.yaml`.
- **Stack:** React 19, Vite 7, TypeScript 5.9, SCSS modular. Sin Tailwind.
- **SEO:** react-helmet-async; componente `SEO.tsx`; meta dinámicos en Home, Blog, posts y `/proyecto/:id`. Imagen OG por defecto: `og-image-default.jpg` (recomendado 1200×630).
- **Proyectos:** Modelo enriquecido en `src/types/project.ts` y `projectsData` en `src/lib/projects.ts`. Tarjetas con métricas (MetricBadge), enlaces live/repo y "Ver caso de estudio" → `/proyecto/:id`. Página ProjectPage con SEO tipo article.
- **Fechas:** `src/lib/formatDate.ts` con `formatDateDayMonthYear()`; formato "día de mes de año" en blog y proyectos; fechas YYYY-MM normalizadas a ISO donde hace falta (meta, `<time dateTime>`).
- **Rutas:** `/`, `/blog`, `/blog/:slug`, `/proyecto/:id`, 404.

### 🛡️ Seguridad y rendimiento (sesiones anteriores)

- **CSP:** Política estricta en `vercel.json` con hashes SHA-256 para scripts inline.
- **Robots.txt:** Bloqueo preventivo de bots de IA (GPTBot, Claude-Web, etc.).
- **Fuentes e imágenes:** preconnect para Google Fonts; preload y fetchpriority para imagen de perfil (LCP).
- **JSON-LD:** Person (estático) y BlogPosting (dinámico por post).

### 🎨 UI/UX

- **Tema:** Oscuro/claro en `:root` y `:root.light`; variables `--pink`, `--yellow`, `--green`, `--bg-dark`, `--bg-card`, `--text`.
- **Mobile Dock:** Rosa (Home/Contacto), Amarillo (Proyectos), Verde (Blog).
- **Convención:** BEM en SCSS; componentes en `src/components/` y `src/pages/`; estilos en `src/styles/components/`.

### ⚙️ Infraestructura y calidad

- **Repo:** `ThebellepoquE/PortfolioDev`.
- **Deploy:** Vercel; output `dist`. Variables: `RESEND_API_KEY`, `CONTACT_EMAIL`.
- **Validación:** `pnpm run check:preprod` (tests, lint, build, audit:prod). Definición de hecho en `.cursorrules`.

---

## 🚀 Próximos pasos (pendientes)

- [x] **Fase 4:** Sitemap automatizado (script `scripts/generate-sitemap.ts` con tsx; integrado en build).
- [ ] Añadir `public/og-image-default.jpg` (1200×630) si se quiere imagen OG por defecto dedicada.
- [ ] Opcional: Sección "Sobre mí", skip link, competencias categorizadas (ver `docs/AUDITORIA-PORTFOLIO-2026.md`).
- [ ] Publicar post "Modularización" (actualmente `draft: true` en `content/posts/modularizacion-lighton/`).

---
*Documento mantenido para continuidad entre sesiones.*
