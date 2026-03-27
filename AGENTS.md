# Code Review Rules

## Stack and Scope
- Keep the stack as-is: Vite + React + TypeScript SPA.
- Do not introduce Next.js/Express/Tailwind in this repository.
- Prefer small, focused changes over large rewrites.

## TypeScript
- Use strict typing; avoid `any` unless fully justified.
- Prefer explicit domain types and reuse existing types from `src/types` and `src/lib`.
- Keep functions small and side effects explicit.

## React
- Use functional components and hooks.
- Keep components presentational when possible; isolate logic in helpers/hooks.
- Preserve accessibility (`aria-*`, semantic elements, keyboard navigation).

## Styling (SCSS)
- Use existing design tokens and variables from `src/styles`.
- Avoid hardcoded colors, spacing, or z-index values when a token exists.
- Follow current SCSS architecture and naming conventions.

## Quality Gates
- Required before merge: lint, style lint, tests, and build.
- Commands:
  - `pnpm run lint`
  - `pnpm run lint:styles`
  - `pnpm run test -- --run`
  - `pnpm run build`

## Security and Config
- Never commit secrets or credentials.
- Keep environment values in `.env` and examples in `.env.example`.
- Preserve CSP and security headers behavior unless explicitly requested.

## Documentation
- Update README/docs when behavior, scripts, or workflow changes.
- Keep instructions concise and executable.
