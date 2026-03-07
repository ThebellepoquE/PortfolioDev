# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

### Changed

- **Flujo de preproducción**: El script `check:preprod` ahora encadena también `npm run audit:prod` para asegurar que el bundle se construye sin vulnerabilidades de producción antes de desplegar.

### Security

- **Overrides de dependencias**: Añadidos overrides en `package.json` para `minimatch`, `ajv` y `rollup`, fijando versiones seguras recomendadas por las auditorías sin romper la configuración actual de Vite y del bundler.
- **Auditorías limpias**: Ejecución de `npm run audit:prod` tras aplicar los overrides, con resultado de 0 vulnerabilidades reportadas para las dependencias de producción.

## [1.0.0] - 2026-03-01

### Added

- **SectionTitle**: Componente reutilizable para títulos de sección con clases `title-neon text-gradient`, eliminando duplicación en Hero, Projects, Contact y Blog.

### Changed

- **Memoización de Markdown**: `getAllPosts()` envuelto en `useMemo` en `BlogList.tsx` para que el parseo costoso solo se ejecute una vez por montaje, no en cada render.

### Fixed

- **Navegación semántica**: Sustitución de `<button onClick={() => window.location.href = '/'}>` por `<Link to="/">` (App.tsx) y `<a href="/">` (ErrorBoundary.tsx) para mejorar accesibilidad y SEO.
