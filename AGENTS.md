# PortfolioDev - Coding Standards

## TypeScript
- Usar `const` y `let`, nunca `var`
- Preferir `interface` sobre `type` para objetos
- Evitar `any`; usar `unknown` cuando el tipo es incierto
- Exportaciones nombradas, no default (excepto páginas/lazy routes)
- Tipos estrictos habilitados (`strict: true` en tsconfig)

## React
- Componentes funcionales con hooks, nunca clases
- Props tipadas con interfaz explícita
- Usar `React.memo` solo cuando esté justificado por rendimiento
- Sin estado mutable fuera de hooks
- `useEffect` debe tener dependencias correctas (regla react-hooks/exhaustive-deps)

## Estilos
- SCSS con Stylelint (`stylelint-config-standard-scss`)
- Usar CSS Modules o estilos co-localizados con el componente
- No inline styles salvo valores dinámicos reales

## Testing
- Vitest + Testing Library
- Tests unitarios para lógica de negocio
- Tests de integración para flujos de usuario clave
- No testear implementation details (usar queries accesibles)

## Estructura de archivos
- Componentes: `src/components/NombreComponente/`
- Un componente por archivo
- Co-localizar test con el componente: `Componente.test.tsx`
- Assets en `public/` o `src/assets/`

## Commits
- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`
- Mensajes en español
- Sin atribución AI (no `Co-Authored-By`)

## CI/CD
- PRs deben pasar lint, test y build antes de merge
- ESLint y Stylelint como gates obligatorios en CI
- No dependencias externas de AI para CI

## General
- No emojis en código (solo en comentarios de PR si aportan claridad)
- Código auto-documentado: nombres descriptivos sobre comentarios
- Evitar duplicación: DRY con criterio (no sobre-abstractar)
