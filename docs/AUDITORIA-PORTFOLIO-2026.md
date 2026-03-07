# Auditoría completa – Portfolio técnico (thebellepoque.dev)

**Fecha:** 7 de marzo de 2026  
**Alcance:** Código, UI/UX, contenido, marca personal, SEO, rendimiento, accesibilidad.

---

## 1. Resumen ejecutivo (puntuación 1–10 por área)

| Área | Puntuación | Comentario breve |
|------|------------|------------------|
| **Calidad técnica y arquitectura** | 8/10 | Vite 7 + React 19, lazy loading, chunks, TypeScript estricto, 47 tests pasando. Falta ErrorBoundary en rutas y sitemap desactualizado. |
| **UI/UX y experiencia de usuario** | 7/10 | Diseño neón coherente, responsive, tema claro/oscuro. No hay sección "Sobre mí" dedicada; CTA claro pero sin métricas visuales. |
| **Contenido y narrativa de marca** | 6/10 | Propuesta de valor presente pero dispersa; bio en Hero correcta. Proyectos sin métricas de impacto; competencias solo como tags. |
| **Proyectos y complejidad técnica** | 6/10 | 3 proyectos bien descritos (Lighton web, encuestas Python, portfolio). Falta profundidad: métricas, enlaces a repo/caso de estudio. |
| **Blog** | 7/10 | 3 posts (2 públicos, 1 draft), contenido personal y técnico. Faltan meta dinámicos por post (SPA) y sitemap sin el tercer post. |
| **SEO** | 7/10 | Meta base, OG, Twitter, JSON-LD Person, preconnect, preload. SPA sin meta por ruta /blog/:slug; sitemap incompleto. |
| **Rendimiento** | 8/10 | Bundle razonable (~350 KB react-vendor gzip), code-splitting, lazy load, LightningCSS. Sin medición LCP/CLS en repo. |
| **Accesibilidad** | 7/10 | aria-labels, sr-only en enlaces sociales, ThemeToggle accesible. Falta skip link, focus visible explícito y orden de headings en alguna vista. |

**Puntuación global estimada: 7.1/10** – Base sólida; mejoras sobre todo en contenido, métricas de proyectos y SEO por ruta.

### Estado post-mejoras (Marzo 2026)

Tras aplicar las fases 1–3 del plan de mejoras:

- **Proyectos:** Modelo enriquecido con métricas, enlaces (live/repo) y "Ver caso de estudio" → página `/proyecto/:id`. MetricBadge con tooltip y accesibilidad.
- **SEO:** react-helmet-async; meta dinámicos por ruta (Home, Blog, posts, ProjectPage). OG y Twitter Cards; tipo `article` en posts y en página de proyecto.
- **Fechas:** `formatDateDayMonthYear()` en blog y proyectos; `<time dateTime>` y meta en formato ISO donde aplica.
- **Gestión:** Migración a pnpm; `packageManager` fijado en `package.json`. Documentación y scripts actualizados a pnpm.
- **Pendiente:** Fase 4 (sitemap automatizado en build), sección "Sobre mí", skip link, competencias categorizadas.

---

## 2. Hallazgos críticos (top 5 urgencias)

1. **Sitemap desactualizado**  
   `public/sitemap.xml` no incluye `/blog/modularizacion-lighton`. Aunque ese post está en `draft: true`, cuando se publique la URL debe estar en el sitemap. El sitemap es estático; conviene generarlo en build o con un script para incluir todas las rutas de blog.

2. **SPA y SEO por post**  
   En `/blog/:slug` el título se cambia con `document.title` en el cliente, pero los meta (description, og:title, og:description, og:image) son siempre los del `index.html`. Los crawlers que no ejecutan JS verán solo la meta genérica. Solución: pre-renderizado (ej. vite-plugin-ssr o similar) o al menos meta dinámicos vía React Helmet y comprobación de que el crawler los reciba.

3. **No hay métricas de impacto en proyectos**  
   Las tarjetas de proyecto son solo título, descripción, stack y “Visitar proyecto”. Para un portfolio técnico falta: impacto (usuarios, tiempo ahorrado, conversiones), enlace a repo cuando aplique, y si es posible un enlace a “caso de estudio” o post relacionado.

4. **Sección “Sobre mí” inexistente**  
   La bio está solo en el Hero. No existe una sección dedicada “Sobre mí” con trayectoria, motivación y propuesta de valor. Para reclutadores y clientes suele ser importante una página o bloque claro con tu historia y qué te diferencia.

5. **Competencias no categorizadas**  
   En Hero hay tags (Python, JavaScript, React, MySQL, Vite) y en cada proyecto un `techStack`. No hay agrupación por tipo (Frontend, Backend, Herramientas, etc.) ni nivel ni contexto. Una sección “Stack y competencias” con categorías mejora la lectura y el posicionamiento mental.

---

## 3. Oportunidades de mejora (por prioridad)

### Alta prioridad

- **Añadir métricas a proyectos**  
  Incluir en el tipo `Project` (y en `projects.ts`) campos opcionales: `metrics?: string[]` (ej. “+40% tiempo ahorrado”), `repo?: string`, `caseStudy?: string`. Mostrarlos en `ProjectCard`.

- **Sección “Sobre mí”**  
  Nueva ruta `/sobre-mi` o bloque fijo en home con: título “Sobre mí”, párrafo de propuesta de valor, hitos (formación, primer empleo, enfoque actual), y CTA a contacto o proyectos.

- **Sitemap generado en build**  
  Script o plugin que genere `sitemap.xml` a partir de `getAllPosts()` y rutas estáticas, y que se ejecute en `vite build` (o post-build) para que el sitemap siempre esté al día.

- **Meta dinámicos por post (SEO)**  
  Si se mantiene SPA: usar react-helmet-async o similar para inyectar en cada `/blog/:slug` title, meta description, og:title, og:description, og:image. Tener en cuenta que el SEO completo en SPA puede requerir pre-render o SSR si se prioriza indexación perfecta.

### Media prioridad

- **Competencias categorizadas**  
  Crear `src/lib/skills.ts` (o ampliar `config`) con categorías (Frontend, Backend, DevOps/Herramientas, etc.) y listar en una sección “Stack” o dentro de “Sobre mí”.

- **Enlace “Código” en proyectos**  
  Donde tenga sentido, añadir en `ProjectCard` un enlace “Ver código” (repo) además de “Visitar proyecto”.

- **Skip link**  
  Primer elemento interactivo de la página: “Saltar al contenido” que lleve a `#inicio` o al `<main>`, con estilos solo al focus para no romper el diseño.

- **Focus visible**  
  Revisar en SCSS que todos los controles (links, botones, inputs) tengan `:focus-visible` claro (outline o box-shadow) para teclado y a11y.

### Baja prioridad

- **RSS del blog**  
  Generar `feed.xml` en build a partir de `getAllPosts()` para suscriptores.

- **Lighthouse / Web Vitals en CI**  
  Opcional: script que ejecute Lighthouse o `web-vitals` en build/CI y falle si LCP o CLS superan umbrales.

- **404 con sugerencias**  
  La página 404 está bien; se puede añadir un enlace “Blog” y “Contacto” para no dejar al usuario sin salida.

---

## 4. Recomendaciones técnicas específicas

- **TypeScript**  
  Mantener `pnpm exec tsc --noEmit` en CI y pre-commit (o `pnpm run build`, que incluye tsc). Estado actual: sin errores.

- **Tests**  
  47 tests pasando. Añadir al menos un test de integración o E2E que cargue la home y compruebe Hero + lista de proyectos (y opcionalmente enlace al blog).

- **Modelo de datos de proyectos**  
  Extender `Project` en `src/lib/projects.ts`:
  ```ts
  export interface Project {
    title: string;
    description: string;
    url: string;
    repo?: string;           // enlace al repo
    techStack: string[];
    metrics?: string[];      // ej. ["Menos tiempo en tareas repetitivas", "Integración con Google Reviews"]
    caseStudy?: string;      // slug del post relacionado
  }
  ```
  Actualizar `ProjectCard` para mostrar `metrics` y enlace a repo/caso.

- **Sitemap en build**  
  Opción 1: script Node que lea `getAllPosts()` (o el sistema de posts) y escriba `public/sitemap.xml` antes de `vite build`. Opción 2: plugin de Vite que genere el sitemap en `closeBundle`. Incluir siempre `/`, `/blog` y cada `/blog/:slug` público.

- **SEO por ruta (SPA)**  
  Instalar `react-helmet-async`, envolver la app con `HelmetProvider` y en `BlogPost` usar `<Helmet>` con title, meta name="description", og:title, og:description, og:image. Comprobar que el dominio esté bien configurado en Google Search Console y que el bot vea el contenido (pre-render o SSR si se exige máximo SEO).

- **Accesibilidad**  
  Añadir en `index.html` o en el primer componente de layout un `<a href="#inicio" class="skip-link">Saltar al contenido</a>` con estilos que lo posicionen fuera de vista y lo muestren al focus. Revisar que no haya saltos en el orden de headings (h1 → h2 → h3).

- **Seguridad**  
  API de contacto con validación y sanitización está bien. Mantener secrets en env (RESEND_API_KEY, etc.) y documentarlos en `.env.example`.

---

## 5. Next steps accionables

1. **Esta semana**  
   - [ ] Añadir entrada de `/blog/modularizacion-lighton` al sitemap cuando el post deje de ser draft (o generar sitemap en build).  
   - [x] Extender `Project` con `repo?` y `metrics?` y mostrar "Ver código" / métricas (hecho: MetricBadge, ProjectPage, enlace caso de estudio).
   - [ ] Añadir skip link y revisar `:focus-visible` en navbar, hero y formulario.

2. **Próximas 2 semanas**  
   - [ ] Crear sección “Sobre mí” (ruta o bloque en home) con propuesta de valor y breve trayectoria.  
   - [ ] Implementar sitemap generado en build (script o plugin) — Fase 4 del plan.  
   - [x] Meta dinámicos en `/blog/:slug` y rutas (react-helmet-async; componente SEO).

3. **Mes**  
   - [ ] Categorizar competencias (Frontend / Backend / Herramientas) y exponerlas en una sección “Stack”.  
   - [ ] Publicar el post “Evolución | De la entrega al despliegue profesional” y actualizar sitemap.  
   - [ ] Opcional: RSS del blog y un test E2E de la home.

---

*Auditoría realizada según estándares de calidad del proyecto (Definition of Done en .cursorrules).*
