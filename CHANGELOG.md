# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

### Added

- **Modelo de proyectos enriquecido:** Tipos en `src/types/project.ts` (ProjectMetric, ProjectLink, TechnicalChallenge, Project) y datos en `projectsData` con métricas, enlaces y fechas.
- **MetricBadge:** Componente para mostrar métricas con tooltip (hover/focus), estilos neón y accesibilidad (tabIndex, focus-visible).
- **Página de detalle de proyecto:** Ruta `/proyecto/:id`, componente `ProjectPage` con SEO tipo article, fechas en formato día/mes/año y enlace "Ver caso de estudio" desde ProjectCard.
- **SEO dinámico:** `react-helmet-async`, componente `SEO.tsx` (title, description, canonical, Open Graph, Twitter Cards, article tags). Integrado en Home, Blog, BlogPost y ProjectPage. `baseUrl` en `config.ts`.
- **Utilidad de fechas:** `src/lib/formatDate.ts` con `formatDateDayMonthYear()` para formato "día de mes de año" en español (blog y proyectos).
- **Fijación de pnpm:** Campo `packageManager`: `"pnpm@10.28.0"` en `package.json` para Corepack.

### Changed

- **Migración npm → pnpm:** Eliminados `package-lock.json` y `node_modules`; generado `pnpm-lock.yaml`. Scripts `audit:prod` y `check:preprod` usan `pnpm`. Documentación actualizada a pnpm.
- **ProjectCard:** Usa tipo `Project` completo; muestra métricas (primeras 3), enlaces primario/secundario, badge "Destacado" y enlace a página de detalle.
- **Projects.tsx:** Usa `projectsData`, orden por `featured`; dependencia de useMemo corregida (array vacío) para eliminar warning de exhaustive-deps.
- **BlogList / BlogPost:** Fechas con `formatDateDayMonthYear` y `dateTime` en `<time>`; eliminado `useEffect` de `document.title` (sustituido por SEO).
- **ProjectPage:** Fechas en formato ISO para meta (`toISODate`) y legible para usuario (`formatDateDayMonthYear`); tipo SEO `article` para `publishedTime` y tags.

### Fixed

- **MetricBadge:** Outline de foco con `currentColor` (ortografía canónica) y comentario stylelint-disable para value-keyword-case.
- **Estilos:** Variable `$border` añadida en `_variables.scss` para uso en MetricBadge y ProjectCard.

### Security

- Sin cambios adicionales; overrides y auditoría de producción siguen vigentes.

---

## [1.1.0] - 2026-03-07 (previo a Unreleased)

### Changed

- **Flujo de preproducción:** El script `check:preprod` encadena `pnpm run audit:prod` (antes `npm run audit:prod`) para garantizar build sin vulnerabilidades de producción.

### Security

- **Overrides de dependencias:** Añadidos overrides en `package.json` para `minimatch`, `ajv` y `rollup`.
- **Auditorías:** Ejecución de `pnpm run audit:prod`; 0 vulnerabilidades reportadas para dependencias de producción.

## [1.0.0] - 2026-03-01

### Added

- **SectionTitle:** Componente reutilizable para títulos de sección con clases `title-neon text-gradient`.

### Changed

- **Memoización de Markdown:** `getAllPosts()` envuelto en `useMemo` en `BlogList.tsx`.

### Fixed

- **Navegación semántica:** Sustitución de `<button onClick>` por `<Link>` y `<a>` en 404 y ErrorBoundary para accesibilidad y SEO.
