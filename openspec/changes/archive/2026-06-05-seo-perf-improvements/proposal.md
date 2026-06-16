# Proposal: seo-perf-improvements

## Intent

Cerrar brechas de SEO y rendimiento en PortfolioDev con cambios graduales, sin nuevas dependencias. El sitio ya tiene buenas bases (OG/Twitter cards, canonical, JSON-LD básico, sitemap, code-splitting, LCP preload, fuente optimizada), pero le faltan señales semánticas y metadatos que los crawlers modernos esperan.

**Why:** Cada pieza de structured data, cada atributo de imagen y cada señal social que falta es tráfico orgánico perdido. Los refinamientos propuestos son asequibles y acumulativos — no hay que hacerlos todos para obtener beneficio.

## Scope

### Phase 1 — Quick Wins (P0, ~30 min)

Cambios de template y atributos que no requieren build pipeline ni generación de assets.

1. **`twitter:site` / `twitter:creator` + `og:locale`** — Agregar a `SEO.tsx` (dinámico por página) y a `index.html` (fallback estático). Valor: `@thebellepoque` y `es_ES`.

2. **Imágenes del blog: `loading="lazy"`, `decoding="async"`, `width`/`height`** — Agregar atributos de rendimiento a los `<img>` en `BlogPost.tsx` y `BlogList.tsx`. El `width`/`height` previene CLS incluso con CSS que sobrescriba dimensiones.

3. **BlogPosting JSON-LD: migrar al prop `jsonLd` de SEO** — Quitar el `<script>` inline duplicado en `BlogPost.tsx` y pasar el objeto al prop `jsonLd` del componente `<SEO>`. Agregar campos faltantes: `url`, `@id`, `mainEntityOfPage`. Esto evita scripts duplicados en `<head>` y completa el schema de Google.

### Phase 2 — Medium Impact (P1, ~3h)

Requiere generación de assets (WebP) y schemas nuevos. Usa `sharp` (ya instalado en devDependencies).

4. **Imágenes responsivas del blog** — Script auxiliar con `sharp` para generar variantes `-600.webp` a partir de las imágenes originales en `public/`. Agregar `srcSet` + `sizes` a los `<img>` de blog post y blog list.

5. **ProjectPage JSON-LD: `CreativeWork` schema** — Agregar prop `jsonLd` en `<SEO>` de `ProjectPage.tsx` con schema `CreativeWork` (o `SoftwareApplication` si aplica). Incluir `name`, `description`, `datePublished`, `author`, `url`, `@id`.

6. **BlogPage JSON-LD: `CollectionPage` schema** — Agregar prop `jsonLd` en `<SEO>` de `BlogPage.tsx` con schema `CollectionPage`. Incluir `name`, `description`, `url`, `hasPart` con cada post listado como `BlogPosting` resumido.

7. **OG image: WebP + variantes + dimensiones** — Convertir `public/og-image-default.jpg` a `.webp`. Script con `sharp` para generar `og-image-default.webp` (1200×630), `og-image-default-600.webp` (600×315). Agregar `og:image:width`, `og:image:height` y `og:image:type` en `SEO.tsx`. Actualizar referencia en `SEO.tsx` e `index.html`. Mantener JPEG como fallback.

### Phase 3 — Investment (P2-P3, ~5h)

Mejoras que requieren decisiones de arquitectura, nuevas dependencias o workflow adicional.

8. **Bundle visualizer** — Agregar `rollup-plugin-visualizer` como devDependency, hook condicional en `vite.config.ts` (solo cuando `ANALYZE=true`). Genera `stats.html` para auditar chunks.

9. **Font subset → variable weight range** — La fuente Inter se carga con `wght@400..900` (20 estilos, ~300KB). Evaluar si alcanza con `400..700` o `400;600;700;900`. Ajustar query string en `index.html`.

10. **AVIF para imágenes** — Extender el script de Phase 2 para generar también `.avif` con `sharp`. Agregar `<source type="image/avif">` en imágenes del blog. Prioriza formato más eficiente donde el browser lo soporte.

11. **Robots meta por página** — Agregar prop `robots` opcional a `SEO.tsx` (default `index,follow`). Permite `noindex` en páginas de baja señal (borradores, tags, etc.).

12. **Sitemap image extensions** — Extender `generate-sitemap.mjs` para incluir `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` y agregar `<image:image>` entries para posts y proyectos con imagen destacada.

13. **Service worker / offline** — Evaluar `vite-plugin-pwa` para cacheo de assets estáticos y shell offline. Solo si el portfolio crece en contenido estático que justifique la complejidad.

## Approach

- **Cero dependencias nuevas en runtime.** `sharp` ya está en devDependencies. Solo `rollup-plugin-visualizer` y `vite-plugin-pwa` serían nuevas y ambas son dev-only.
- **Sin cambios de arquitectura.** Todo son ajustes de template, props de componente y scripts de build existentes.
- **SEO.tsx absorbe la responsabilidad de structured data.** Hoy el JSON-LD del blog post se inyecta con `<script>` inline duplicado; el componente ya tiene prop `jsonLd` para eso.
- **Los scripts de imágenes son one-shot.** Se ejecutan manualmente cuando se agregan imágenes nuevas, no en cada build (salvo que se integren al pipeline de build más adelante).
- **OG image fallback a JPEG.** Los metadatos apuntan al `.webp` nuevo pero se mantiene el `.jpg` por si alguna plataforma no soporta WebP en OG tags (raro pero posible).

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| WebP en OG tags no soportado por algún scraper | Low | Mantener JPEG como fallback; OG image referencia WebP que es ampliamente soportado |
| `srcSet` + `sizes` mal calculados generan imágenes pixeladas | Low | Usar breakpoints conocidos (600w para blog list, 1200w para post); validar visualmente |
| JSON-LD duplicado (inline + SEO prop) | Low | Phase 1 quita el inline; Phase 2-3 solo agregan vía prop |
| `loading="lazy"` en LCP image empeora LCP | Low | Las imágenes del blog están below-the-fold por diseño; si alguna se vuelve hero, se omite `loading="lazy"` |
| Bundle visualizer ralentiza build | Low | Condicional con `ANALYZE=true`, no corre en CI ni en dev normal |
| AVIF encode time | Low | One-shot script, no en hot-reload |

## Estimated Effort

| Phase | Items | Effort |
|-------|-------|--------|
| P0 | Items 1-3 | 30 min |
| P1 | Items 4-7 | 3 h |
| P2-P3 | Items 8-13 | 5 h |
| **Total** | | **~8.5 h** |

## Files Affected

| File | Phase | Change |
|------|-------|--------|
| `src/components/SEO.tsx` | P0, P1 | `twitter:site`, `twitter:creator`, `og:locale`, `og:image:width/height/type` |
| `index.html` | P0, P1 | `twitter:site`, `og:locale`, OG image a `.webp` |
| `src/components/Blog/BlogPost.tsx` | P0, P1 | `loading`/`decoding`/`width`/`height` en `<img>`, quitar `<script>` JSON-LD inline, mover JSON-LD a prop `jsonLd` del `<SEO>`, `srcSet`+`sizes` |
| `src/components/Blog/BlogList.tsx` | P0, P1 | `loading`/`decoding`/`width`/`height` en `<img>`, `srcSet`+`sizes` |
| `src/pages/ProjectPage.tsx` | P1 | Prop `jsonLd` con schema `CreativeWork` |
| `src/pages/BlogPage.tsx` | P1 | Prop `jsonLd` con schema `CollectionPage` |
| `scripts/generate-sitemap.mjs` | P3 | Image extensions |
| `vite.config.ts` | P2 | `rollup-plugin-visualizer` condicional |
| `package.json` | P2, P3 | `rollup-plugin-visualizer`, `vite-plugin-pwa` (opcional) |
| `public/` | P1, P3 | `og-image-default.webp`, `og-image-default-600.webp`, variantes de blog `*-600.webp`, `*.avif` |
| `src/lib/config.ts` | P0 | `locale` field en `SITE_CONFIG` |
