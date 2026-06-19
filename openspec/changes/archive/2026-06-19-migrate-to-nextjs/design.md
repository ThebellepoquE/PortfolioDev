# Design: Migrate PortfolioDev to Next.js App Router (Serverless)

## Technical Approach

Replace the Vite + React Router SPA with Next.js 15 App Router deployed serverlessly on Vercel. Pages are Server Components that render static HTML at build time; interactive islands become Client Components. SEO metadata moves from `react-helmet-async` to `generateMetadata()`. Images move from the custom `sharp`/`<picture>` pipeline to `next/image` with Vercel’s image optimization API. API routes become App Router Route Handlers. No ISR: every deploy performs a full rebuild.

## Architecture Decisions

| Decision | Choice | Alternatives rejected | Rationale |
|----------|--------|----------------------|-----------|
| Rendering target | App Router, serverless (`next start`) | Static export (`output: 'export'`) | User requires dynamic Route Handlers for `/api/contact` and `/api/health`; static export would disable them. |
| Page data strategy | Build-time SSG via async Server Components | ISR / on-demand revalidation | Content is static; user explicitly forbids ISR. |
| Blog parsing | `gray-matter` + `fs` in a server-only module | Keep `import.meta.glob` / custom regex parser | `import.meta.glob` is Vite-specific; `gray-matter` is robust and keeps the custom parser small. |
| Theme hydration | Inline `<script>` + `suppressHydrationWarning` on `<html>` | `useEffect` theme flicker / CSS-only | Sets the class before first paint, avoiding flash and hydration mismatch warnings. |
| Image optimization | `next/image` local public images | Keep custom `buildImageAttrs` + sharp variants | Eliminates manual optimization scripts and leverages Vercel’s image API. |
| Client boundaries | Co-locate `'use client'` where interactivity is required | Make everything a Client Component | Minimizes client bundle and keeps HTML renderable without JS. |
| Routing links | `next/link` everywhere | Keep `react-router-dom` Link | Required for App Router prefetch and correct navigation. |

## Data Flow

```
build / request
   │
   ▼
app/**/page.tsx (async Server Component)
   │
   ├── getAllPosts() / getPostBySlug()  ──► fs.readFile(content/posts/...)
   │                                          gray-matter frontmatter
   ├── projectsData import
   └── generateMetadata()
   │
   ▼
JSX ──► BlogPostBody ('use client') uses react-markdown
        Contact ('use client') POST /api/contact
        Navbar / ThemeToggle / ScrollToTopButton ('use client')
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/layout.tsx` | Create | Root layout: html, global SCSS, inline theme script, Navbar, Footer, ScrollToTopButton. |
| `app/page.tsx` | Create | Home page Server Component with Hero + lazy Projects/Contact islands. |
| `app/blog/page.tsx` | Create | Blog list Server Component. |
| `app/blog/[slug]/page.tsx` | Create | Blog post Server Component; loads Markdown via `fs`. |
| `app/proyecto/[id]/page.tsx` | Create | Project detail Server Component. |
| `app/not-found.tsx` | Create | 404 page. |
| `app/error.tsx` | Create | Global error boundary (`'use client'`). |
| `app/api/contact/route.ts` | Create | Route Handler for contact form. |
| `app/api/health/route.ts` | Create | Route Handler for health check. |
| `app/sitemap.ts` | Create | Dynamic sitemap generation. |
| `app/robots.ts` | Create | Dynamic robots.txt. |
| `src/lib/posts.server.ts` | Create | `fs` + `gray-matter` post loader; replaces `src/lib/posts.ts`. |
| `src/components/BlogPostBody.tsx` | Create | `'use client'` wrapper for `react-markdown` + `remark-gfm`. |
| `src/components/Navbar.tsx` | Modify | Use `next/link`, `usePathname`; keep mobile dock and active section. |
| `src/components/Projects.tsx` | Modify | Convert to Server Component; drop `useMemo`. |
| `src/components/ProjectCard.tsx` | Modify | Use `next/link`. |
| `src/components/Hero.tsx` | Modify | Replace `<img>` with `next/image`, `priority` and `sizes`. |
| `src/lib/images.ts` | Delete | Replaced by `next/image`. |
| `scripts/optimize-images.mjs` | Delete | No longer needed. |
| `scripts/generate-sitemap.mjs` | Delete | Replaced by `app/sitemap.ts`. |
| `vite.config.ts` | Delete | Replaced by `next.config.ts`. |
| `index.html` | Delete | Replaced by `app/layout.tsx`. |
| `src/main.tsx`, `src/App.tsx` | Delete | Replaced by App Router. |
| `src/components/SEO.tsx` | Delete | Replaced by `generateMetadata()`. |
| `api/contact.js`, `api/health.js` | Delete | Replaced by App Router Route Handlers. |
| `next.config.ts` | Create | Serverless config, image formats, security headers. |
| `vercel.json` | Modify | Remove SPA rewrite; keep security headers and API no-cache. |
| `package.json` | Modify | Swap Vite/Router/Helmet for Next.js; update scripts. |
| `vitest.config.ts` | Modify | Keep jsdom + React plugin; add `@/` alias and Next mocks. |
| `eslint.config.js` | Modify | Add `eslint-config-next`. |
| `tsconfig*.json` | Modify | Next.js paths (`@/*`, `next/*`). |

## Interfaces / Contracts

```ts
// src/lib/posts.server.ts
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
}

export function getAllPosts(): Promise<BlogPost[]>;
export function getPostBySlug(slug: string): Promise<{ meta: BlogPost; content: string } | null>;

// app/api/contact/route.ts
export async function POST(request: Request): Promise<Response>;
```

## Testing Strategy

| Layer | What to test | Approach |
|-------|-------------|----------|
| Unit | `getAllPosts`, `getPostBySlug`, date helpers | Vitest node environment; assert parsed frontmatter. |
| Unit | `generateMetadata` for home, blog, post, project | Call exported functions directly; assert returned `Metadata`. |
| Integration | Contact Route Handler | Use `new Request()` with JSON body; assert 200/400/500 responses. |
| Integration | Blog post page render | Render Server Component output via `@testing-library/react`; mock `next/image`. |
| Component | Contact form, Navbar, ThemeToggle | jsdom + user-event; mock `next/navigation`. |
| E2E / manual | Social card validators | LinkedIn Post Inspector, Twitter Card Validator, Lighthouse. |

## Migration / Rollout

Phased stacked PRs keep each review under 400 changed lines. Phases 1–3 can live in preview; phase 4 makes `main` deployable on Vercel by removing Vite, updating the Vercel framework preset to Next.js, and wiring Route Handlers.

| Phase | Focus | Key deliverable |
|-------|-------|-----------------|
| 1 | Setup / base | `next.config.ts`, `app/layout.tsx`, global styles/theme hydration, deps. |
| 2 | Static pages | Home, blog list, blog post, 404; `generateMetadata`; drop router/helmet. |
| 3 | Projects | `/proyecto/[id]`, `next/image` everywhere, drop sharp. |
| 4 | Tests / cleanup | Route Handlers, Vitest setup, remove Vite, make `main` deployable. |

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Theme hydration mismatch | Medium | Inline script sets class before paint; `suppressHydrationWarning` on `<html>`. |
| Social metadata regression | Medium | Per-route metadata tests + manual validator checks after phase 2. |
| Image path/source regressions | Medium | Keep source files in `public/`; verify `next/image` `sizes`/`priority` in phase 3. |
| Test suite breakage | Medium | Update `vitest.config.ts` with Next aliases/mocks; replace SEO component tests with metadata tests. |
| API env vars missing on Vercel | Low | Verify `RESEND_API_KEY` and `CONTACT_EMAIL` before phase 4 deploy. |
| Route 404s for existing backlinks | Low | Lock exact routes `/blog/:slug` and `/proyecto/:id`; add redirect tests. |

## Open Questions

- Should we add `next/font/local` for Inter or keep the existing self-hosted CSS `@font-face` rules? (Existing CSS works; defer to phase 1 implementation.)
- Do we keep the `resize-profile-photo.mjs` script? It is unrelated to the website runtime and can remain as a utility.
