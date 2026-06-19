# Tasks: Migrate PortfolioDev to Next.js App Router

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1100 (PR1 ~260, PR2 ~330, PR3 ~280, PR4 ~230) |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR1 → PR2 → PR3 → PR4, each targets `main`; phases 1-3 preview-only until phase 4 lands |
| Delivery strategy | ask-always (resolved: feature-branch-chain) |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes — resolved as feature-branch-chain (PR #1 targets `migrate-nextjs` tracker branch)
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | PR | Notes |
|------|------|----|-------|
| 1 | Next.js base: config, layout, deps, theme hydration | PR 1 | Keeps old Vite files for later removal |
| 2 | Static pages: home, blog list, blog post, 404, metadata | PR 2 | Drops `react-router-dom` and `react-helmet-async` |
| 3 | Project detail + `next/image` takeover | PR 3 | Replaces custom sharp pipeline |
| 4 | API routes, sitemap, tests, Vercel cleanup | PR 4 | Makes `main` production-deployable |

## Phase 1: Setup / Base

| # | Task | Files | Lines | Deps | Acceptance Criteria |
|---|------|-------|-------|------|---------------------|
| [x] 1.1 | Add Next.js deps and update scripts | `package.json` | ~35 | — | `pnpm dev` starts Next.js |
| [x] 1.2 | Create `next.config.ts` (serverless, images, headers) | `next.config.ts` | ~50 | — | Type-checks and builds |
| [x] 1.3 | Update TS paths/types for `@/*` and Next | `tsconfig.app.json`, `tsconfig.node.json` | ~25 | 1.2 | `pnpm typecheck` passes |
| [x] 1.4 | Create `app/layout.tsx` with global SCSS and theme script | `app/layout.tsx` | ~70 | 1.1, 1.3 | Renders without hydration errors |
| [x] 1.5 | SSR-safe theme: inline script + `useTheme` update | `src/hooks/useTheme.ts`, `src/hooks/useTheme.test.ts` | ~40 | 1.4 | No theme flash; tests pass |
| [x] 1.6 | Add global `app/error.tsx` boundary | `app/error.tsx` | ~30 | 1.4 | Runtime errors show fallback |
| [x] 1.7 | Verify lint and typecheck gates | — | — | 1.1–1.6 | `pnpm lint` and `pnpm typecheck` pass |

## Phase 2: Static Pages

| # | Task | Files | Lines | Deps | Acceptance Criteria |
|---|------|-------|-------|------|---------------------|
| 2.1 | Create `src/lib/posts.server.ts` with `fs` + `gray-matter` | `src/lib/posts.server.ts` | ~60 | 1.1 | Parser output matches current shape |
| 2.2 | Create client `BlogPostBody` for `react-markdown` | `src/components/BlogPostBody.tsx` | ~25 | — | Renders markdown content |
| 2.3 | Create shared `src/lib/metadata.ts` helper | `src/lib/metadata.ts` | ~70 | — | Returns valid Next.js `Metadata` |
| 2.4 | Create `app/page.tsx` (Hero + lazy islands) | `app/page.tsx` | ~40 | 1.4, 2.3 | `/` renders correctly |
| 2.5 | Create `app/blog/page.tsx` with metadata | `app/blog/page.tsx` | ~40 | 2.1, 2.3 | `/blog` renders list |
| 2.6 | Create `app/blog/[slug]/page.tsx` with metadata | `app/blog/[slug]/page.tsx` | ~75 | 2.1, 2.2, 2.3 | `/blog/:slug` renders; unknown slug 404s |
| 2.7 | Create `app/not-found.tsx` | `app/not-found.tsx` | ~30 | 2.3 | Unknown routes show 404 UI |
| 2.8 | Update `Navbar` and `useActiveSection` to Next.js APIs | `src/components/Navbar.tsx`, `src/hooks/useActiveSection.ts` | ~55 | 1.4 | Navigation links work |
| 2.9 | Delete SPA router/helmet files | `src/App.tsx`, `src/main.tsx`, `src/bootstrap.ts`, `src/components/SEO.tsx`, `src/pages/HomePage.tsx`, `src/pages/BlogPage.tsx`, `src/pages/BlogPostPage.tsx`, `src/pages/NotFoundPage.tsx`, `index.html` | ~-350 | 2.4–2.8 | No `react-router-dom` / `react-helmet-async` imports remain |
| 2.10 | Update/add metadata and page tests | `src/lib/metadata.test.ts`, page tests | ~120 | 2.3–2.9 | `pnpm test:run` passes |

## Phase 3: Projects

| # | Task | Files | Lines | Deps | Acceptance Criteria |
|---|------|-------|-------|------|---------------------|
| 3.1 | Create `app/proyecto/[id]/page.tsx` with metadata | `app/proyecto/[id]/page.tsx` | ~95 | 2.3 | `/proyecto/:id` renders; unknown id 404s |
| 3.2 | Convert `Projects` to Server Component | `src/components/Projects.tsx` | ~25 | 2.4 | Home projects section renders |
| 3.3 | Replace `<img>` with `next/image` (Hero, BlogList, BlogPostBody) | `src/components/Hero.tsx`, `src/components/Blog/BlogList.tsx`, `src/components/BlogPostBody.tsx` | ~70 | 2.2, 2.6 | Images use `next/image` with proper `sizes`/`priority` |
| 3.4 | Update `ProjectCard` to `next/link` | `src/components/ProjectCard.tsx` | ~10 | 3.1 | Project cards link correctly |
| 3.5 | Delete custom image pipeline | `src/lib/images.ts`, `src/lib/images.test.ts`, `scripts/optimize-images.mjs` | ~-90 | 3.3 | No `buildImageAttrs` references |
| 3.6 | Update project and image tests | `src/pages/ProjectPage.test.tsx`, `src/components/Hero.test.tsx`, `src/components/Projects.test.tsx` | ~90 | 3.1–3.5 | Tests pass |

## Phase 4: Tests & Cleanup

| # | Task | Files | Lines | Deps | Acceptance Criteria |
|---|------|-------|-------|------|---------------------|
| 4.1 | Migrate `/api/contact` to App Router Route Handler | `app/api/contact/route.ts`, `app/api/contact/route.test.ts`, delete `api/contact.js` | ~80 | 1.1 | `POST /api/contact` behaves as before |
| 4.2 | Migrate `/api/health` to App Router Route Handler | `app/api/health/route.ts`, delete `api/health.js` | ~15 | 1.1 | `GET /api/health` returns ok |
| 4.3 | Add dynamic `sitemap.ts` and `robots.ts` | `app/sitemap.ts`, `app/robots.ts`, delete `public/sitemap.xml`, `scripts/generate-sitemap.mjs` | ~55 | 2.1 | `/sitemap.xml` and `/robots.txt` serve correctly |
| 4.4 | Remove remaining Vite artifacts | `vite.config.ts`, `plugins/vite-async-css.ts`, leftover `src/pages/*`, `index.html` | ~-120 | 2.9, 3.1 | No Vite config remains |
| 4.5 | Update Vitest and ESLint for Next.js | `vitest.config.ts`, `eslint.config.js` | ~45 | 4.1–4.4 | `pnpm test:run` and `pnpm lint` pass |
| 4.6 | Update `vercel.json` and Vercel preset to Next.js | `vercel.json` | ~10 | 4.5 | Vercel build succeeds |
| 4.7 | Validate production deploy, metadata, Lighthouse | — | — | 4.6 | All proposal success criteria met |

## Task Dependency Graph

```mermaid
flowchart TD
    A[1.1 Deps/scripts] --> B[1.2 next.config.ts]
    B --> C[1.3 TS paths]
    C --> D[1.4 app/layout.tsx]
    D --> E[1.5 Theme]
    D --> F[1.6 error.tsx]
    E --> G[1.7 Verify gates]
    F --> G
    G --> H[2.1 posts.server.ts]
    G --> I[2.2 BlogPostBody]
    G --> J[2.3 metadata.ts]
    H --> K[2.5 blog/page]
    H --> L[2.6 blog/[slug]]
    I --> L
    J --> M[2.4 home/page]
    J --> K
    J --> L
    J --> N[2.7 not-found]
    M --> O[2.9 Delete SPA files]
    K --> O
    L --> O
    N --> O
    O --> P[2.10 Tests]
    P --> Q[3.1 proyecto/[id]]
    Q --> R[3.4 ProjectCard]
    M --> S[3.2 Projects SC]
    I --> T[3.3 next/image]
    T --> U[3.5 Delete image pipeline]
    Q --> V[3.6 Project tests]
    T --> V
    U --> V
    V --> W[4.1 API contact]
    V --> X[4.2 API health]
    V --> Y[4.3 sitemap/robots]
    V --> Z[4.4 Remove Vite]
    W --> AA[4.5 Vitest/ESLint]
    X --> AA
    Y --> AA
    Z --> AA
    AA --> AB[4.6 vercel.json]
    AB --> AC[4.7 Validate deploy]
```
