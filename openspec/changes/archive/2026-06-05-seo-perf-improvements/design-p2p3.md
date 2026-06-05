# Design: seo-perf-improvements — Phase P2-P3

## 1. Overview

| Item | What it changes | Runtime impact |
|------|----------------|----------------|
| P2-8: Bundle visualizer | Dev-only plugin in `vite.config.ts`, gated by `ANALYZE=true` | None |
| P2-9: Font subset | Query string in `index.html` narrowed from `400..900` to discrete weights | Smaller font download |
| P2-10: AVIF support | Extended `optimize-images.mjs`, `<picture>` wrapper in BlogPost + BlogList | Smaller images for AVIF browsers |
| P2-11: Robots meta | Optional `robots` prop on `SEO.tsx` | Only if a page opts in |
| P2-12: Sitemap images | `xmlns:image` + `<image:image>` entries in `generate-sitemap.mjs` | Richer sitemap for crawlers |
| P2-13: Service worker | Evaluation document only — no code | None |

---

## 2. Bundle Visualizer (P2-8)

### Configuration

Add `rollup-plugin-visualizer` as a devDependency. In `vite.config.ts`, import it dynamically when `ANALYZE=true` and push it to the plugins array.

```ts
// vite.config.ts — addition at the end of the plugins array
...(process.env.ANALYZE === 'true'
  ? [(await import('rollup-plugin-visualizer')).visualizer({
      open: false,
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: false,
      template: 'treemap',
    })]
  : []),
```

The dynamic `await import()` works inside `defineConfig` because Vite config supports async top-level. Since the import is conditional, `rollup-plugin-visualizer` won't be bundled or loaded unless `ANALYZE=true`.

### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Output path | Project root (`stats.html`) | Not a deployable artifact. `dist/` would be cleaned by builds. Root is easy to find and gitignored. |
| Gzip vs Brotli | Gzip only | Most CDNs (Vercel included) serve gzip by default. Brotli sizes are smaller but less representative of real-world transfer. |
| Template | `treemap` | Best for chunk size comparison at a glance. Sunburst is pretty but harder to read exact sizes. Network is too granular for this site. |
| Activation | `ANALYZE=true` env var | Standard convention (same as Next.js bundle-analyzer). Conditional import means zero overhead when not set. |

### Script

Add to `package.json` scripts:

```json
"analyze:bundle": "ANALYZE=true pnpm build"
```

### CI exclusion

The `ANALYZE` check is runtime — CI runs `pnpm build` without `ANALYZE`, so the plugin is never loaded. No CI config changes needed.

---

## 3. Font Optimization (P2-9)

### Current state analysis

The font is loaded via Google Fonts CDN, not via `@fontsource/inter`. There is **no** `@fontsource` import anywhere in `src/`. Both `<link>` tags in `index.html` (lines 37-49) use the URL:

```
https://fonts.googleapis.com/css2?family=Inter:wght@400..900&display=swap
```

This is a **variable font** axis specification. Google serves a single variable font file (~300KB for Latin subset) covering all 21 weight interpolations from 400 to 900.

### Actual weight usage audit

Analyzed all 38 `font-weight` declarations across 12 SCSS files:

| Weight | Count | Where |
|--------|-------|-------|
| 400 | — | Base body text (no explicit declaration needed) |
| 500 | 9 | `hero/_content.scss` (2), `BlogList.scss`, `nav/_desktop.scss`, `Projects.scss`, `MetricBadge.scss` (3) |
| 600 | 8 | `BlogPost.scss`, `Projects.scss` (2), `nav/_mobile.scss` (2), `ProjectPage.scss` (2), `contact/_form.scss` (3), `hero/_content.scss`, `themes/_light.scss` |
| 700 | 10 | `BlogPost.scss`, `BlogList.scss`, `Projects.scss` (2), `ProjectPage.scss` (2), `contact/_form.scss` (2), `contact/_layout.scss`, `themes/_light.scss` (2), `MetricBadge.scss` |
| 800 | 1 | `ErrorBoundary.scss:25` (h1 in error state only) |
| 850 | 1 | `themes/_light.scss:39` (all headings in light mode) |
| 900 | 4 | `hero/_content.scss:30`, `BlogPost.scss:65`, `BlogList.scss:24`, `Projects.scss:48` |

Weights 400–700 are broadly used. 800 and 850 appear exactly once each. 900 is prominent in hero and blog titles.

### Recommendation: discrete weights `400;500;600;700;900`

Change all 4 occurrences of the font URL in `index.html` from `wght@400..900` to `wght@400;500;600;700;900`.

**Rationale:**

- **Weight 800** (ErrorBoundary h1): Browser will render it at 900. The error boundary is an edge-case component; a 100-weight difference in an error heading is visually negligible.
- **Weight 850** (light-mode headings): Browser will render it at 900. The intent of that rule is "make headings bolder in light mode" — 900 achieves the same goal. The 50-weight delta is invisible at display sizes.
- **Weights 400, 500, 600, 700, 900**: Used across core UI. Must be preserved.

**Impact:**

- Current: single variable font file, ~300KB
- After: 5 discrete weight files, ~180–200KB total (each ~40KB Latin subset)
- Reduction: ~100–120KB (33–40% smaller)
- Caching: CDN caches individual weight files, so most pages only download 3-4 weights

**Why not `400..700` variable?** Losing weight 900 would visibly degrade hero titles, blog post titles, and project card titles — the most prominent typography on the site. Not acceptable.

**Files to change:** `index.html` — 4 font URL occurrences (preload, async stylesheet, noscript, and the print-loading link).

---

## 4. AVIF Pipeline (P2-10)

### Script extension

Extend `scripts/optimize-images.mjs` to generate `.avif` variants alongside `.webp` for blog images. Sharp natively supports AVIF output:

```js
await sharp(source)
  .resize(600, null, { withoutEnlargement: true })
  .avif({ quality: 50 })  // AVIF quality scale differs from WebP (50 ≈ WebP 85 visually)
  .toFile(outPath);
```

The OG image (Target A) does NOT need AVIF — OG tags don't support AVIF, and WebP already covers this case.

**Skip for dev builds?** Not applicable. The script is one-shot (run manually via `pnpm run optimize:images`), not part of `vite build`. No dev impact.

**AVIF encode time:** Sharp's AVIF encoder is slower than WebP (~2-3x). For the current ~5 blog images, this is negligible. The script is idempotent and skips existing outputs, so re-runs are fast.

### Picture element decision

**Wrap blog images in `<picture>` elements**, not just generate files.

The `<picture>` element degrades gracefully: browsers that don't support AVIF fall through to WebP, then to the `<img>` fallback. No JavaScript needed.

```html
<picture>
  <source type="image/avif" srcset="/images/blog/post-600.avif 600w, /images/blog/post.avif 1200w">
  <source type="image/webp" srcset="/images/blog/post-600.webp 600w, /images/blog/post.webp 1200w">
  <img src="/images/blog/post.webp" alt="..." loading="lazy" decoding="async" width="1200" height="675">
</picture>
```

### Implementation approach

Extend `buildImageAttrs()` in `src/lib/images.ts` to also return the AVIF `srcSet` (or return the full `<source>` structures). The function already computes base paths and variant names.

Option A — return all source data, components assemble `<picture>`:
```ts
interface PictureSources {
  avifSrcSet: string;
  webpSrcSet: string;
  fallbackSrc: string;
  sizes: string;
}
```

Option B — return pre-built `<source>` elements (JSX). Breaks separation of concerns; the images lib shouldn't produce JSX.

**Decision: Option A.** The images lib returns data. BlogPost.tsx and BlogList.tsx assemble the `<picture>` markup. This keeps the lib testable and framework-agnostic.

### Files affected

| File | Change |
|------|--------|
| `scripts/optimize-images.mjs` | Add AVIF output loop for blog images |
| `src/lib/images.ts` | Add `avifSrcSet` to return type, compute AVIF paths |
| `src/components/Blog/BlogPost.tsx` | Wrap `<img>` in `<picture>` with `<source>` elements |
| `src/components/Blog/BlogList.tsx` | Same |
| `public/images/blog/*.avif` | Generated output (not committed; in `.gitignore` if needed) |

---

## 5. Robots Meta (P2-11)

### SEO.tsx prop addition

Add optional `robots` prop to the `SEOProps` interface:

```ts
export interface SEOProps {
  // ... existing props ...
  /** Meta robots directive. Omit to emit no robots tag (crawler default). */
  robots?: string;
}
```

In the component body, render conditionally:

```tsx
{robots && <meta name="robots" content={robots} />}
```

**Default behavior:** When `robots` is omitted, no `<meta name="robots">` tag is emitted. Crawlers default to `index,follow`. This is backwards-compatible — existing pages emit nothing, same as before.

### Where to use `noindex`

After auditing `src/pages/` and `src/lib/posts.ts`:

- **Drafts**: Already excluded at build time. `posts.ts:44` returns `null` for draft posts in production, so no page is ever rendered. Drafts don't exist in the SPA — no `noindex` needed.
- **Tag pages**: Don't exist. There are no `/tag/:tag` routes or tag listing pages. The tags are only displayed inline in blog cards and post headers.
- **Concept pages**: Don't exist. All pages are live content pages.

**Verdict:** Zero pages currently need `noindex`. The prop is added for future use — if the site later adds tag pages, draft previews, or low-signal content pages, they can opt in without changing `SEO.tsx` again.

### Validation

Per spec: no component-level validation. The prop passes through as-is. Invalid values (e.g., `"invalid"`) are still emitted — crawlers that don't understand them ignore the tag. This is the standard behavior for `<meta name="robots">`.

---

## 6. Sitemap Image Extensions (P2-12)

### Namespace

Add `xmlns:image` to the root `<urlset>` element:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
```

### Image entries

For each `<url>` representing a blog post or project that has an `image` field, add:

```xml
<image:image>
  <image:loc>https://thebellepoque.dev/path/to/image.webp</image:loc>
</image:image>
```

Caption (`<image:caption>`) is optional per spec and omitted — the site doesn't have per-image captions in metadata.

### Data sources

**Blog posts:** The `readPostsFromFs()` function already reads frontmatter. Extend it to also capture the `image` field (same regex as `posts.ts`):

```js
const imageMatch = frontmatter.match(/image:\s*(.+)/);
const image = imageMatch ? imageMatch[1].trim() : null;
```

Return `image` alongside `slug` and `date` in the entries array.

**Projects:** `readProjectsFromSource()` reads from `src/lib/projects.ts` using regex. Current regex only captures `id` and `date`. Extend it to also capture the `image` field from the `projectsData` array. The field is always `/og-image-default.jpg` for current projects, but the regex should handle any value.

Regex addition:
```js
const projectRegex = /id:\s*['"]([^'"]+)['"][\s\S]*?date:\s*['"]([^'"]+)['"][\s\S]*?image:\s*['"]([^'"]+)['"]/g;
```

Wait — the project objects use `image:` as a key, but the regex is parsing TypeScript source, not JSON. All projects currently have `image: '/og-image-default.jpg'`. A simpler approach: match the `image` key in the project object block. But regex across object boundaries is fragile.

**Alternative:** Since all current projects use the same default image, we could hardcode the OG image for projects. But for robustness, extend the regex to capture the `image` field from each project object.

**Decision:** Extend the regex. If the regex fails to capture an image for a project, omit the `<image:image>` entry (no data is better than wrong data).

### Implementation in `buildUrl()`

Change `buildUrl()` to accept an optional `image` parameter:

```js
function buildUrl({ loc, lastmod, changefreq, priority, image }) {
  let xml = `  <url>\n    <loc>${escapeXml(loc)}</loc>...`;
  if (image) {
    const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
    xml += `\n    <image:image>\n      <image:loc>${escapeXml(imageUrl)}</image:loc>\n    </image:image>`;
  }
  xml += `\n  </url>`;
  return xml;
}
```

### Files affected

Only `scripts/generate-sitemap.mjs` — no runtime changes, no component changes.

---

## 7. Service Worker Evaluation (P2-13)

### Context

| Metric | Value |
|--------|-------|
| Total pages | ~11 (1 home, 1 blog index, 5 blog posts, 5 project pages) |
| Content type | Static, pre-rendered at build time (SPA, but content is known at compile) |
| Hosting | Vercel (global CDN edge network) |
| Cache headers | Vercel sets `Cache-Control: public, max-age=0, must-revalidate` for HTML; static assets get immutable hashes |

### Options evaluated

#### Option A: `vite-plugin-pwa` (full Workbox PWA)

- Adds ~30KB gzipped (Workbox runtime + manifest)
- Auto-generates precache manifest for all static assets (JS, CSS, fonts, images)
- Cache-first for static assets, network-first for HTML
- Requires service worker registration, `manifest.json`, icon generation
- Handles updates via Workbox's `skipWaiting` + `clientsClaim`

**Effort:** ~2h setup + ongoing maintenance (SW version bumps, cache invalidation debugging).

#### Option B: Custom minimal service worker

- No dependencies, hand-rolled
- Cache specific asset paths (fonts, CSS, JS chunks)
- No Workbox, no precache manifest generation
- Must manually maintain cache key lists when assets change
- Risk of stale caches without proper versioning

**Effort:** ~3h initial + recurring maintenance penalty.

#### Option C: No service worker (current)

- CDN edge caching covers most use cases
- Immutable file hashes (Vite output) naturally cache forever
- HTML responses are small (~2KB compressed) and served from edge
- No cache invalidation bugs, no SW lifecycle complexity

**Effort:** Zero.

### Recommendation: **Option C — REJECT for now**

**Rationale:**

1. **CDN already provides sub-second loads.** Vercel's edge network serves HTML from the nearest PoP. Static assets (JS, CSS, images) have immutable hashes and are cached indefinitely. The marginal gain from a SW is near zero for a site this size.

2. **No offline value.** A portfolio site has no interactive functionality that benefits from offline access. Users don't "use" the portfolio offline — they visit it once, read it, and leave.

3. **SW complexity is real.** Service workers introduce a lifecycle (install → activate → update) that creates a debugging surface: stale caches, failed updates, unexpected behavior on deploy. For a solo developer maintaining a portfolio, this is overhead with no payoff.

4. **When to revisit.** If the blog grows to 50+ posts, or if the site adds:
   - A search feature that could index locally
   - A reading list / bookmark feature
   - Offline-accessible documentation or guides
   
   Then `vite-plugin-pwa` with network-first for HTML and cache-first for static assets becomes justifiable.

### Decision recorded

**Verdict: REJECT.** No `vite-plugin-pwa` in devDependencies. No SW code added. This evaluation is the artifact for item 13.

---

## 8. Files Affected

| File | Items | Change | Est. lines |
|------|-------|--------|------------|
| `package.json` | P2-8 | Add `rollup-plugin-visualizer` devDep + `analyze:bundle` script | +2 |
| `vite.config.ts` | P2-8 | Conditional visualizer plugin import | +8 |
| `index.html` | P2-9 | Change 4 font URLs from `400..900` to `400;500;600;700;900` | 4 edits |
| `scripts/optimize-images.mjs` | P2-10 | Add AVIF generation loop for blog images | +15 |
| `src/lib/images.ts` | P2-10 | Add `avifSrcSet` to `buildImageAttrs()` return type | +6 |
| `src/components/Blog/BlogPost.tsx` | P2-10 | Wrap `<img>` in `<picture>` with `<source>` elements | +10 |
| `src/components/Blog/BlogList.tsx` | P2-10 | Same | +10 |
| `src/components/SEO.tsx` | P2-11 | Add `robots?: string` prop + conditional `<meta>` tag | +3 |
| `scripts/generate-sitemap.mjs` | P2-12 | Add `xmlns:image`, extend post/project parsing, add `<image:image>` entries | +25 |
| `openspec/changes/seo-perf-improvements/design-p2p3.md` | — | This file | — |

**Total estimated lines changed:** ~80 lines across 9 files.
