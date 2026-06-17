# Proposal: Migrate PortfolioDev from Vite SPA to Next.js

## Intent

Replace the Vite + React 19 SPA with Next.js App Router so every page is server-rendered at build time, fixing the core SEO gap caused by client-side `react-helmet-async` metadata.

## Problem

- `<title>`, OG, Twitter Card, and JSON-LD metadata require JavaScript execution.
- Social crawlers often show fallback homepage metadata for `/blog/:slug` and `/proyecto/:id`.
- Manual `sharp` scripts and custom `<picture>` markup handle image optimization.

## Target Users

- Recruiters and hiring managers sharing portfolio links on LinkedIn/Twitter/X.
- Visitors discovering blog posts via search or social shares.
- Author publishing posts and expecting correct previews on deploy.

## Scope

### In Scope
- Next.js App Router serverless deployment on Vercel.
- Preserve exact routes: `/`, `/blog`, `/blog/:slug`, `/proyecto/:id`, `*`.
- `generateMetadata()` replacing `react-helmet-async`.
- `next/image` replacing manual sharp pipeline.
- Blog posts loaded via `fs` and rendered as Server Components.
- `app/sitemap.ts` and `app/api/*/route.ts` replacements.
- SSR-safe theme hydration.
- Vitest suite adjusted for Next.js.

### Out of Scope
- ISR; full rebuild on deploy is acceptable.
- CMS integration or design redesign.
- Route slug rewrites.
- SCSS-to-Tailwind conversion.

## Business Rules

1. Exact current routes MUST be preserved.
2. LinkedIn is the primary social platform; Twitter/X second; WhatsApp/Facebook secondary.
3. Default OG image MUST be 1200×630.
4. `next/image` is the sole image path from the projects PR onward.
5. Intermediate PRs may stay in preview; final PR makes `main` production-deployable.
6. Hard cutover is acceptable.

## Approach

Next.js 15+ App Router serverless on Vercel. Server Components generate HTML and metadata at build time; client interactivity stays in Client Components. Keep Vitest and SCSS global imports.

## Capabilities

### New
- `nextjs-metadata`: `generateMetadata()` for all routes.
- `nextjs-image-optimization`: `next/image` with automatic formats and sizes.
- `nextjs-static-routing`: File-based routes matching current paths.
- `nextjs-api-routes`: Contact and health route handlers.

### Modified
- `seo-perf-improvements`: Vite-specific SEO items superseded by Next.js APIs.
- `ux-phase-3`: Skeleton/active-section behavior adapted to App Router hydration.

## Affected Areas

| Area | Impact |
|------|--------|
| `package.json` | Swap Vite/react-router/react-helmet for Next.js |
| `vite.config.ts` | Remove; replaced by `next.config.ts` |
| `tsconfig*.json` | Next.js paths |
| `index.html`, `src/main.tsx`, `src/App.tsx` | Remove; replaced by `app/layout.tsx` |
| `src/pages/*` | Remove; replaced by `app/**/page.tsx` |
| `src/components/SEO.tsx` | Remove; replaced by `generateMetadata()` |
| `src/lib/posts.ts` | `fs`-based parsing |
| `src/lib/images.ts` | Remove; `next/image` |
| `src/bootstrap.ts` | SSR-safe theme |
| `scripts/optimize-images.mjs`, `scripts/generate-sitemap.mjs` | Remove |
| `api/*.js` | Migrate to `app/api/*/route.ts` |
| `src/test/**` | Adjust for Next.js |

## Phased PR Plan

| Phase | Focus | Est. Lines |
|-------|-------|-----------:|
| 1 | Setup: config, layout, SCSS, theme hydration, deps | ~300 |
| 2 | Static pages: home, blog, post, 404; metadata; drop router/helmet | ~350 |
| 3 | Projects: `/proyecto/[id]`; `next/image` everywhere; drop sharp | ~250 |
| 4 | Tests & cleanup: API routes, Vitest setup, remove Vite, `main` deployable | ~200 |

Each PR is stacked on `main`; phases 1-3 stay in preview until phase 4 lands.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Theme/date hydration mismatch | Medium | Inline theme script + `suppressHydrationWarning` |
| Social preview metadata regression | Medium | Per-page metadata tests; manual card validators |
| Test suite breakage | Medium | Update tests within each phase |
| Post sort/filter behavior changes | Medium | Compare parser output before/after |
| SEO equity loss from route changes | Low | Lock exact routes; add redirect tests |

## Rollback Plan

Revert the final PR to restore the Vite SPA. Vercel settings can re-enable the previous `vercel.json` SPA rewrite. Preserve `main` history; no force-pushes.

## Dependencies

- Next.js 15+.
- Vercel framework preset updated before phase 4 deploy.

## Success Criteria

- [ ] All routes render server-side HTML with correct metadata.
- [ ] LinkedIn/Twitter/X validators show correct title, description, and 1200×630 image.
- [ ] `next/image` serves optimized images without manual sharp scripts.
- [ ] API routes respond correctly in production.
- [ ] `pnpm test:run`, `pnpm lint`, `pnpm build` pass on `main`.
- [ ] Lighthouse SEO score stays at 100; performance does not regress.
- [ ] Existing external backlinks return 200 after cutover.
