# Plan de implementación – Mejoras hacia 8.5+/10

**Objetivo:** Implementar modelo de proyectos con métricas, SEO dinámico y sitemap automatizado con mínimo riesgo y máxima velocidad.

**Criterios de éxito:** `pnpm run check:preprod` en verde tras cada fase; sin regresiones visuales ni de tests.

---

## Dependencias entre bloques (resumen)

```
[1. Tipos y datos]  ──► [2. UI Proyectos]  ──► (paralelo)
         │                        │
         │                        └──► [3. SEO Helmet]
         │
         └──► [4. Sitemap]  (solo datos de posts + rutas estáticas; independiente de 2 y 3)
```

- **Fase 1** es prerequisito de 2 y no bloquea 4.
- **Fase 2** depende solo de 1.
- **Fase 3** es independiente de 2 (solo App + rutas).
- **Fase 4** es independiente de 2 y 3; puede ir en paralelo tras 1 si se desea.

**Orden recomendado:** 1 → 2 → 3 → 4 (validación continua y commits pequeños).

---

## Fase 1: Modelo de proyectos (tipos + datos)

**Objetivo:** Extender el tipo `Project` con campos opcionales y rellenar datos sin romper la UI actual.

### Pasos concretos

1. **Definir tipos** en `src/lib/projects.ts` (o `src/types/project.ts` si prefieres separar):
   - `ProjectMetric` (ej. `{ label: string; value?: string }` o solo `string`).
   - Extender `Project` con:
     - `metrics?: string[]` (o `ProjectMetric[]`).
     - `repo?: string`.
     - `caseStudy?: string` (slug del post).
   - Mantener compatibilidad: todos los campos nuevos opcionales.

2. **Actualizar el array `projects`** en `src/lib/projects.ts`:
   - Añadir 1–2 métricas por proyecto donde aplique (ej. “Reducción de tiempo en tareas repetitivas”, “Integración con Google Reviews”).
   - Añadir `repo` donde exista (ej. Portfolio → ya tiene `url` como repo; Lighton puede no tener repo público).
   - Opcional: `caseStudy` apuntando al slug de un post si lo hay.

3. **Validación Fase 1**
   - [ ] `npx tsc --noEmit` sin errores.
   - [ ] `pnpm run test -- --run` pasando (ProjectCard sigue recibiendo `Project`; si el tipo se amplía, los tests existentes siguen válidos).
   - [ ] `pnpm run build` correcto.
   - [ ] Comprobar en dev que la home sigue mostrando los 3 proyectos sin errores (los nuevos campos aún no se pintan).

### Rollback Fase 1

- Revertir el commit de esta fase (o eliminar los campos opcionales y las entradas en `projects`). La UI no depende aún de los nuevos campos.

---

## Fase 2: UI de proyectos (métricas y enlaces)

**Objetivo:** Mostrar métricas y enlace “Ver código” en cada tarjeta sin romper diseño ni accesibilidad.

### Pasos concretos

1. **Componente `MetricBadge`** (opcional pero recomendable):
   - Crear `src/components/MetricBadge.tsx`.
   - Props: `label` o `children` (texto de la métrica).
   - Estilos: clase BEM en `src/styles/components/` (o dentro de `Projects.scss`). Reutilizar variables de marca (`--pink`, `--yellow`, `--green`).

2. **Actualizar `ProjectCard`** en `src/components/ProjectCard.tsx`:
   - Recibir `project` con los nuevos campos opcionales.
   - Si `project.metrics?.length`, renderizar una lista de `MetricBadge` (o `<span>`) debajo de la descripción.
   - Si `project.repo` existe y es distinto de `project.url`, mostrar un segundo enlace “Ver código” (o “Repo”) con `href={project.repo}`. Si es el mismo (ej. solo repo), mantener un solo CTA “Visitar / Ver código” según convenga.

3. **Estilos** en `src/styles/components/Projects.scss` (o archivo que use `ProjectCard`):
   - Estilos para métricas (badges o lista breve) y para el enlace secundario si aplica.
   - Responsive y contraste acorde al tema claro/oscuro.

4. **Validación Fase 2**
   - [ ] `npx tsc --noEmit`.
   - [ ] `pnpm run test -- --run`. Si hay tests de `ProjectCard`, actualizar mocks para incluir `metrics`/`repo` opcionales si es necesario.
   - [ ] `pnpm run lint` y `pnpm run lint:styles`.
   - [ ] Revisión visual en dev: home, tema claro y oscuro, móvil.

### Rollback Fase 2

- Revertir commit(s) de ProjectCard + MetricBadge + estilos. El modelo de datos (Fase 1) puede quedarse; la UI volverá a no mostrar métricas ni segundo enlace.

---

## Fase 3: SEO dinámico (react-helmet-async)

**Objetivo:** Meta y title por ruta (especialmente `/blog` y `/blog/:slug`) para mejorar SEO sin romper el build.

### Pasos concretos

1. **Instalar dependencia**
   - `pnpm add react-helmet-async`

2. **Componente `SEO`** reutilizable:
   - Crear `src/components/SEO.tsx`.
   - Props: `title`, `description`, `image?`, `type?` (ej. `"website"` | `"article"`), `canonical?`.
   - Dentro: usar `<Helmet>` de `react-helmet-async` para:
     - `<title>`
     - `<meta name="description" />`
     - `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
     - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
   - Valores por defecto: los de `index.html` o de `src/lib/config.ts` para no dejar meta vacíos.

3. **Integrar en la app**
   - En `src/main.tsx`, envolver la app con `<HelmetProvider>`.
   - En `src/App.tsx` (o en cada ruta):
     - Ruta `/`: opcional usar `<SEO title="..." description="..." />` para consistencia, o dejar solo el título por defecto.
     - Ruta `/blog`: `<SEO title="Blog | ..." description="..." />`.
     - Ruta `/blog/:slug`: dentro de `BlogPost`, según los datos del post usar `<SEO title={post.meta.title} description={post.meta.description} image={...} type="article" />`.
   - Asegurar que `BlogPost` tenga acceso a `post.meta` antes de renderizar SEO (evitar flash de meta incorrectos).

4. **Validación Fase 3**
   - [ ] `npx tsc --noEmit`.
   - [ ] `pnpm run test -- --run` (si algún test hace snapshot del DOM, puede requerir ajuste por el nuevo provider).
   - [ ] `pnpm run build` y `pnpm run preview`: abrir `/`, `/blog`, `/blog/el-laberinto-de-empezar` y comprobar en “Inspeccionar” que `<head>` cambia según la ruta (title y meta description/og).

### Rollback Fase 3

- Quitar `HelmetProvider` de `main.tsx`, eliminar usos de `<SEO>` en rutas y desinstalar `react-helmet-async`. El sitio vuelve al SEO estático del `index.html`.

---

## Fase 4: Sitemap automatizado

**Objetivo:** Generar `sitemap.xml` en cada build con todas las URLs estáticas y las de blog.

### Pasos concretos

1. **Script de generación**
   - Crear `scripts/generate-sitemap.js` (o `.mjs`/`.cjs` según prefieras ESM).
   - Entrada: lista de rutas. Opciones:
     - **A)** Leer desde un módulo que exporte `getAllPosts()` (si el script puede ejecutar código que use `import.meta.glob`, puede ser complejo en Node).  
     - **B)** Leer el sistema de archivos: listar carpetas en `content/posts/`, leer frontmatter de cada `*-index.md` para `date` y `draft`; filtrar drafts.
   - Salida: escribir `public/sitemap.xml` (o `dist/sitemap.xml` si se ejecuta después de build) con:
     - `https://thebellepoque.dev/`
     - `https://thebellepoque.dev/blog`
     - Una entrada por post público: `https://thebellepoque.dev/blog/<slug>`
   - Usar `lastmod` desde el frontmatter o `mtime` del fichero; `priority` y `changefreq` según criterio (ej. home 1.0 weekly, blog 0.8 weekly, post 0.7 monthly).

2. **Integración en build**
   - Opción recomendada: ejecutar el script **antes** de `vite build`, para que `public/sitemap.xml` exista y Vite lo copie a `dist/`.
   - En `package.json`:
     - Añadir script: `"sitemap": "node scripts/generate-sitemap.js"`.
     - Cambiar `build` a: `"build": "tsc -b && pnpm run sitemap && vite build"` (o `"build": "pnpm run sitemap && tsc -b && vite build"` si prefieres sitemap antes de tsc).
   - Comprobar que en `dist/` tras `pnpm run build` exista `sitemap.xml` con las URLs correctas.

3. **Validación Fase 4**
   - [ ] `pnpm run sitemap` sin errores y `public/sitemap.xml` actualizado.
   - [ ] `pnpm run build`: `dist/sitemap.xml` presente y con al menos `/`, `/blog` y los posts no draft.
   - [ ] `pnpm run check:preprod` completo: test + lint + build + audit.

### Rollback Fase 4

- Quitar la llamada a `pnpm run sitemap` del script `build` y volver a commitear un `public/sitemap.xml` estático manual si lo necesitas. El resto del sitio no depende del script.

---

## Puntos de validación globales (tras todas las fases)

- [ ] `pnpm run check:preprod` pasa.
- [ ] Revisión manual: home (proyectos con métricas y enlaces), blog list, un post (meta en head), tema claro/oscuro.
- [ ] Comprobar que `sitemap.xml` en producción incluye todas las rutas públicas.
- [ ] Opcional: Google Search Console / rich results para comprobar que los meta por post se indexan (puede tardar).

---

## Orden alternativo (si priorizas SEO o sitemap)

- **Si lo urgente es SEO:** hacer Fase 3 antes que Fase 2 (3 no depende de 2). Orden: 1 → 3 → 2 → 4.
- **Si lo urgente es sitemap:** Fase 4 puede hacerse justo después de Fase 1 (no depende de 2 ni 3). Orden: 1 → 4 → 2 → 3.

---

## Resumen de archivos a tocar (referencia)

| Fase | Archivos nuevos | Archivos modificados |
|------|-----------------|----------------------|
| 1    | (opcional `src/types/project.ts`) | `src/lib/projects.ts` |
| 2    | `src/components/MetricBadge.tsx`, estilos | `src/components/ProjectCard.tsx`, `src/styles/components/Projects.scss` |
| 3    | `src/components/SEO.tsx` | `src/main.tsx`, `src/App.tsx` o rutas, `src/components/Blog/BlogPost.tsx` |
| 4    | `scripts/generate-sitemap.js` | `package.json`, (opcional) `public/sitemap.xml` sobrescrito por script |

---

*Plan alineado con Definition of Done (.cursorrules) y auditoría en `docs/AUDITORIA-PORTFOLIO-2026.md`.*
