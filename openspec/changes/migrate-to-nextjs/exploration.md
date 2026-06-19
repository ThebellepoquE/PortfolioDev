# Exploration: Migrate Vite + React 19 SPA to Next.js

## Current State

### Stack
- **Build tool**: Vite 7 with `@vitejs/plugin-react`, custom `vite-async-css` plugin, `rollup-plugin-visualizer`
- **Framework**: React 19.2 SPA (client-side rendering only)
- **Routing**: `react-router-dom` v7 with 5 routes (`/`, `/blog`, `/blog/:slug`, `/proyecto/:id`, `*`)
- **SEO**: `react-helmet-async` for `<title>`, meta tags, OG, Twitter Cards, JSON-LD (Person, CollectionPage, BlogPosting, CreativeWork)
- **Blog**: Markdown files in `content/posts/*/XX-index.md`, loaded via `import.meta.glob` (Vite-specific), rendered with `react-markdown` + `remark-gfm`
- **Images**: Manual `sharp` script (`optimize-images.mjs`) generates WebP/AVIF variants; `buildImageAttrs()` helper builds `<picture>` srcSet manually
- **Styles**: SCSS with global imports via `main.scss`, ~28 SCSS partials, Stylelint configured
- **API**: 2 Vercel serverless functions (`api/contact.js` — Resend email, `api/health.js`)
- **Testing**: Vitest 4 + Testing Library + vitest-axe, 17 test files, jsdom environment
- **Deploy**: Vercel with `vercel.json` SPA rewrite rule, security headers
- **Sitemap**: Build-time script (`generate-sitemap.mjs`) writes `public/sitemap.xml`
- **Theme**: localStorage-based dark/light toggle via `bootstrap.ts`, applied before React mount
- **Fonts**: Self-hosted Inter (woff2), inlined `@font-face` in `index.html` with preload
- **No CI/CD**: `.github/` is empty; checks run locally (`check:local`, `check:preprod`)

### Key Architectural Patterns
- Lazy loading per route with `React.lazy` + `Suspense`
- Code-splitting: manual chunks for `react-vendor` and `markdown-vendor`
- Async CSS loading (custom Vite plugin makes CSS non-blocking)
- Inline critical styles in `index.html` (font-face, CSS variables, spinner)
- Projects data as static TypeScript array (`projectsData`)
- Blog posts parsed from frontmatter at build time via `import.meta.glob`

### Current SEO/Social Sharing Gap
The SPA renders all metadata client-side via `react-helmet-async`. This means:
1. **Social media crawlers** (Facebook, Twitter/X, LinkedIn, Slack, Telegram) often do NOT execute JavaScript — they won't see OG tags, Twitter cards, or correct link previews
2. **Some search engine crawlers** may not fully render JS-heavy pages, missing JSON-LD structured data
3. **No server-rendered HTML** — the initial `index.html` has hardcoded fallback meta tags that only match the homepage
4. **Blog posts** have correct metadata in theory, but only after JS hydration — invisible to link preview bots

### Codebase Size
- ~3,500 lines TypeScript/TSX across ~40 source files
- ~28 SCSS files
- 17 test files
- 5 blog posts in Markdown
- 2 API routes (plain JS)

## Affected Areas

- `package.json` — Replace Vite/react-router-dom/react-helmet-async with Next.js dependencies
- `vite.config.ts` — DELETE (replaced by `next.config.ts`)
- `vitest.config.ts` — Adjust for Next.js (or keep Vitest with SWC)
- `vercel.json` — Simplify (Next.js handles routing natively)
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` — Restructure for Next.js
- `index.html` — DELETE (replaced by `app/layout.tsx`)
- `src/main.tsx` — DELETE (replaced by Next.js entry)
- `src/App.tsx` — Restructure into `app/` file-based routing
- `src/pages/*` (5 files) — Convert to Next.js page routes
- `src/components/SEO.tsx` — Replace with Next.js `Metadata` API + `generateMetadata()`
- `src/lib/posts.ts` — Rewrite `import.meta.glob` to `fs`-based reading (server-side)
- `src/lib/images.ts` — Replace `buildImageAttrs` with `next/image`
- `src/lib/config.ts` — Keep (shared config)
- `src/lib/projects.ts` — Keep (static data)
- `src/lib/jsonLd.ts` — Keep (type definition)
- `src/bootstrap.ts` — Rewrite for SSR hydration (inline script pattern or `suppressHydrationWarning`)
- `plugins/vite-async-css.ts` — DELETE (Next.js handles CSS optimization)
- `scripts/generate-sitemap.mjs` — Replace with `next-sitemap` or `app/sitemap.ts`
- `scripts/optimize-images.mjs` — DELETE (replaced by `next/image` automatic optimization)
- `api/contact.js` — Convert to `app/api/contact/route.ts`
- `api/health.js` — Convert to `app/api/health/route.ts`
- `src/styles/**` (~28 SCSS files) — Keep as global SCSS import or migrate to CSS Modules
- `src/test/**` (17 test files) — Adjust setup for Next.js environment
- `content/posts/**` (5 Markdown files) — Keep, change loading mechanism
- `public/**` — Keep static assets, move to `public/` (same in Next.js)

## Approaches

### 1. Full Migration to Next.js App Router (Static Export)

Migrate everything to Next.js App Router with `output: 'export'` (static HTML/CSS/JS at build time). Deploy to Vercel as static site.

- **Pros**:
  - All pages pre-rendered as static HTML — crawlers see full metadata without JS
  - `next/image` for automatic image optimization (WebP/AVIF, responsive sizes, lazy loading)
  - File-based routing replaces `react-router-dom`
  - `generateMetadata()` replaces `react-helmet-async` — first-class metadata API
  - Blog posts read from filesystem at build time (natural fit for SSG)
  - Sitemap via `next-sitemap` or `app/sitemap.ts`
  - `next/script` for optimized third-party loading
  - Existing Vercel deploy stays the same
  - Eliminates the `vite-async-css` hack — Next.js handles CSS optimization natively

- **Cons**:
  - Full rewrite of routing, entry point, SEO component, blog loading, image handling
  - Must handle hydration mismatches (theme toggle, date formatting)
  - Loss of Vite-specific features (HMR speed, `import.meta.glob`, custom plugin)
  - Vitest setup needs adjustment (or switch to Jest)
  - `output: 'export'` means no server-side features (no API routes, no ISR, no middleware)
  - API routes must remain as separate Vercel serverless functions

- **Effort**: High (~800-1000 changed lines)
- **Review budget**: Exceeds 400 lines — requires chained PRs (3-4 slices)

### 2. Full Migration to Next.js App Router (Serverless)

Same as above but without `output: 'export'`. Deploy as serverless Next.js on Vercel.

- **Pros**: Everything from Option 1, PLUS:
  - API routes can move into `app/api/` (unified codebase)
  - ISR (Incremental Static Regeneration) for blog posts — update without full rebuild
  - Middleware for security headers, redirects
  - Server Components reduce client bundle (blog rendering, metadata, JSON-LD all server-side)
  - `after()` for non-blocking analytics/logging

- **Cons**: Everything from Option 1, PLUS:
  - Serverless cold starts (mitigated by Vercel Fluid Compute)
  - Slightly higher Vercel cost (serverless invocations vs static)
  - More complex mental model (server vs client components)

- **Effort**: High (~900-1200 changed lines)
- **Review budget**: Exceeds 400 lines — requires chained PRs (3-5 slices)

### 3. Phased Migration (Blog First)

Keep the Vite SPA for the main site. Create a separate Next.js app (or sub-route) for the blog only. Later, migrate the rest.

- **Pros**:
  - Lower risk per phase — blog is the most SEO-sensitive part
  - Blog gets SSG/SSR immediately — social crawlers see correct metadata
  - Main portfolio (home, projects) stays on Vite — less urgent for SEO
  - Can validate Next.js patterns on a smaller surface before full migration

- **Cons**:
  - Two build systems running in parallel (Vite + Next.js)
  - Shared components/styles need duplication or extraction to a package
  - Routing split: `/blog` on Next.js, everything else on Vite — complex deploy config
  - `import.meta.glob` still needs rewriting for the blog portion
  - Higher maintenance overhead during the transition period
  - Vercel deploy config becomes more complex (rewrites between two apps)

- **Effort**: Medium per phase, but higher total effort (~1200-1500 lines across 2 phases)
- **Review budget**: Each phase fits within 400 lines

### 4. Keep Vite, Solve SEO Gaps (No Migration)

Stay on Vite + React SPA. Add a prerendering step (e.g., `vite-plugin-prerender` or a custom Puppeteer script) to generate static HTML for each route at build time.

- **Pros**:
  - Minimal code changes — keep existing architecture
  - No framework migration risk
  - Prerendered HTML gives crawlers the metadata they need
  - Keep Vite's fast DX and HMR

- **Cons**:
  - Prerendering adds build complexity and fragility (Puppeteer dependency, timing issues)
  - No automatic image optimization (still manual sharp script)
  - No Server Components — full JS bundle still ships to client
  - Prerendering doesn't help with dynamic routes if content changes
  - `vite-plugin-prerender` is less mature than Next.js's built-in SSG
  - Still maintaining custom solutions for things Next.js provides out of the box

- **Effort**: Low-Medium (~200-400 changed lines)
- **Review budget**: Fits within 400 lines

## Recommendation

**Option 2: Full Migration to Next.js App Router (Serverless)** — but with phased delivery via chained PRs.

### Rationale
1. The portfolio's #1 SEO gap is that social media crawblers can't see metadata on a pure SPA. Next.js SSG/SSR solves this completely.
2. The blog is the most SEO-sensitive surface (5 posts with OG tags, JSON-LD, article metadata). Next.js static generation is a perfect fit.
3. `next/image` replaces the manual sharp pipeline with automatic optimization, responsive sizes, and modern formats.
4. The codebase is small (~3,500 lines TS/TSX) — migration is feasible without excessive risk.
5. Vercel deploy stays the same (Vercel is the home of Next.js).
6. Serverless mode allows API routes to live in the same codebase and enables ISR for future blog updates.
7. The existing test suite (Vitest + Testing Library) works with Next.js with minor adjustments.

### Recommended Phasing (4 chained PRs)

#### Phase 1: Foundation (~300 lines)
- Set up Next.js project structure (`next.config.ts`, `tsconfig.json`, `app/` directory)
- Create `app/layout.tsx` (root layout with fonts, theme, global styles)
- Migrate `index.html` inline styles/fonts to Next.js `app/layout.tsx`
- Convert theme initialization to SSR-safe pattern (inline script + `suppressHydrationWarning`)
- Migrate SCSS imports (keep global SCSS for now)
- Keep Vite config for test runner only (or configure Vitest with Next.js SWC)
- **Risk**: Low — additive, both systems coexist temporarily

#### Phase 2: Routing + Pages (~350 lines)
- Create `app/page.tsx` (HomePage), `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/proyecto/[id]/page.tsx`, `app/not-found.tsx`
- Replace `react-router-dom` with Next.js `Link` and file-based routing
- Replace `react-helmet-async` with `generateMetadata()` for all pages
- Convert JSON-LD to server-side rendering (no more `<Helmet>` script injection)
- Delete `src/App.tsx`, `src/main.tsx`, `src/pages/*`
- **Risk**: Medium — routing change affects all navigation, must verify all links

#### Phase 3: Blog + Content (~250 lines)
- Rewrite `src/lib/posts.ts` to use `fs` reads at build time (or `contentlayer`/`velite`)
- Migrate `react-markdown` rendering to Server Component (no client JS for blog content)
- Replace `buildImageAttrs` + `<picture>` with `next/image` in blog posts and cards
- Replace `generate-sitemap.mjs` with `app/sitemap.ts`
- Delete `scripts/optimize-images.mjs` (next/image handles it)
- **Risk**: Medium — blog content rendering must match current output exactly

#### Phase 4: API + Cleanup (~200 lines)
- Convert `api/contact.js` to `app/api/contact/route.ts`
- Convert `api/health.js` to `app/api/health/route.ts`
- Delete `vite.config.ts`, `plugins/vite-async-css.ts`, `vercel.json` rewrites
- Update `package.json` scripts (remove Vite, add Next.js)
- Adjust all 17 test files for Next.js environment
- Remove `react-router-dom`, `react-helmet-async` from dependencies
- **Risk**: Medium — test suite must pass, API routes must work

**Total estimated effort**: ~1,100 changed lines across 4 PRs (each under 400 lines).

## Risks

1. **Hydration mismatches**: Theme toggle (localStorage) and date formatting will differ between server and client renders. Must use inline script pattern or `suppressHydrationWarning`.
2. **Test migration**: 17 test files need environment adjustments (jsdom → Next.js test utils, router mocking changes). Risk of test regressions.
3. **SCSS global imports**: Next.js supports global CSS but the import pattern changes. Risk of style regressions during migration.
4. **Blog content loading**: `import.meta.glob` is Vite-specific. The replacement (fs-based or contentlayer) must handle frontmatter parsing, draft filtering, and sort order identically.
5. **SEO regression**: During migration, metadata must remain correct on every page. Any gap means lost search visibility.
6. **Deploy configuration**: `vercel.json` rewrites must be removed carefully — Next.js handles routing natively but the transition period needs both configs.
7. **Bundle size increase**: Next.js runtime adds ~30KB to the client bundle. Offset by Server Components reducing shipped JS for blog/pages.
8. **`import.meta.env` → `process.env`**: Environment variable access patterns differ between Vite and Next.js.

## Ready for Proposal

**Yes** — the exploration is complete. The orchestrator should present the user with:
1. The recommended approach (Full Migration to Next.js Serverless, 4 chained PRs)
2. The alternative of keeping Vite + prerendering (lower effort, partial SEO fix)
3. The estimated effort (~1,100 lines, 4 PRs under 400 lines each)
4. Key decision: static export vs serverless (affects whether API routes move into Next.js)
