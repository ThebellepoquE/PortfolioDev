# Apply Progress: migrate-to-nextjs

## Phase 1: Setup / Base — Completed

| Task | Status | Notes |
|------|--------|-------|
| 1.1 Add Next.js deps and update scripts | ✅ | `next@^15.2.0` added; Vite build deps removed; `@vitejs/plugin-react` kept for Vitest. |
| 1.2 Create `next.config.ts` | ✅ | Serverless config with image formats and security headers. Temporary `pageExtensions` used to avoid Next.js treating legacy `src/pages` as Pages Router routes. |
| 1.3 Update TS paths/types for `@/*` | ✅ | Unified `tsconfig.json` with Next paths; legacy `tsconfig.app.json`/`tsconfig.node.json` kept as references but unused. |
| 1.4 Create `app/layout.tsx` | ✅ | Root layout at `src/app/layout.page.tsx` with global SCSS, inline theme script, skip link, Footer and ScrollToTopButton. |
| 1.5 SSR-safe theme + `useTheme` update | ✅ | Inline script sets theme class before paint; hook now respects existing `dark`/`light` class on the document. |
| 1.6 Add global `app/error.tsx` | ✅ | Client error boundary at `src/app/error.page.tsx`. |
| 1.7 Verify lint and typecheck gates | ✅ | `pnpm lint`, `pnpm typecheck`, `pnpm run test -- --run` and `pnpm run build` pass. |

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.4 Layout | `src/app/layout.page.test.tsx` | Integration | ✅ 146/146 | ✅ Written | ✅ Passed | ✅ 4 cases | ✅ Clean |
| 1.4 Home placeholder | `src/app/page.page.test.tsx` | Integration | ✅ 146/146 | ✅ Written | ✅ Passed | ✅ 2 cases | ✅ Clean |
| 1.6 Error boundary | `src/app/error.page.test.tsx` | Integration | ✅ 146/146 | ✅ Written | ✅ Passed | ✅ 2 cases | ✅ Clean |
| 1.6 Not found | `src/app/not-found.page.test.tsx` | Integration | ✅ 146/146 | ✅ Written | ✅ Passed | ✅ 2 cases | ✅ Clean |
| 1.5 Theme | `src/hooks/useTheme.test.ts` | Unit | ✅ 146/146 | ✅ Written | ✅ Passed | ✅ 6 cases | ✅ Clean |

## Deviations from Design

- **App directory location**: Design placed `app/` at the repository root. Because the legacy Vite pages live in `src/pages`, Next.js interpreted that directory as the Pages Router. To avoid collisions while keeping the legacy files intact, the App Router files were placed under `src/app/` and `pageExtensions` was temporarily set to `['page.tsx', 'page.ts']`. This will be reverted once `src/pages` is removed in Phase 4.
- **Layout shell**: Design includes `Navbar` in the root layout. It was omitted in this slice because the current `Navbar` still depends on `react-router-dom`, which will be migrated in Phase 2.
- **Lint script**: `next lint` is deprecated and rewrote `tsconfig.json`; the script was set to `eslint .` with Next-compatible ignores/disabled rules instead.

## Issues Found

- Next.js treats the existing `src/pages` directory as Pages Router pages. Mitigated via `pageExtensions` and moving App Router files to `src/app/`.
- GGA pre-commit hook flagged `var` in the inline theme script and inline props typing in the layout; both were fixed.

## Remaining Work

- Phase 2: Static pages (home, blog list, blog post, 404), metadata helper, drop `react-router-dom`/`react-helmet-async`.
- Phase 3: Project detail, `next/image` takeover, remove sharp pipeline.
- Phase 4: API routes, sitemap/robots, Vitest/ESLint cleanup, remove Vite artifacts, make `main` deployable.
