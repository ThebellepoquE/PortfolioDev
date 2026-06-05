# Tasks: seo-perf-improvements — P1 Phase

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~170 |
| 400-line budget risk | Low — well within budget |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Dependency on P0 | P1-4 and P1-7 touch files modified in P0 (`BlogPost.tsx`, `BlogList.tsx`, `SEO.tsx`); merge P0 first |

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full P1 (tasks 4-7) | PR 1 | All four tasks touch different concerns but share `optimize-images.mjs` (covers 4 + 7). Safe to batch — ~170 lines. |

---

## P1 — Medium Impact

### P1-4: Responsive blog images — srcSet + sizes + WebP via sharp

Create a one-shot sharp image optimization script and a shared helper to emit responsive `srcSet`/`sizes` attributes on blog `<img>`s. Existing blog images in `public/images/blog/` are already WebP; the script generates `*-600.webp` variants. The helper is a pure function — no runtime fs calls.

- [x] **P1-4a**: Create `scripts/optimize-images.mjs` following the pattern from `scripts/resize-profile-photo.mjs` (dynamic `sharp` import, exit with clear error if sharp is missing, `main().catch()` wrapper). The script handles **two targets** in one run:
  - **Target A — OG image**: Read `public/og-image-default.jpg`, generate `public/og-image-default.webp` (1200×630, `fit: cover`) and `public/og-image-default-600.webp` (600×315, `fit: cover`). Exit with clear error if source `.jpg` is missing.
  - **Target B — Blog images**: Scan `public/images/blog/*.webp` (excluding files ending in `-600.webp`). For each, generate `{basename}-600.webp` at width 600 (aspect-ratio preserved, `withoutEnlargement: true`). Skip if output already exists.
  - Both targets must be idempotent (skip existing outputs).
- [x] **P1-4b**: Add `"optimize:images": "node scripts/optimize-images.mjs"` to `package.json` scripts.
- [ ] **P1-4c**: Run `pnpm run optimize:images` once **(skipped — manual step, per implementation rules)** to generate initial WebP variants for the 5 existing blog images in `public/images/blog/` and the OG image in `public/`.
- [x] **P1-4d**: Create `src/lib/images.ts` with a `buildImageAttrs(imagePath: string)` function that returns `{ srcSet: string; sizes: string }`:
  - Parse `imagePath` to derive the `-600` variant path (replace `.webp` → `-600.webp` in the same directory).
  - Return `srcSet` with `{variant} 600w, {original} 1200w`.
  - **Do not** check file existence — browser degrades to `src` if variant 404s.
  - Export as named export.
- [x] **P1-4e**: Update `BlogPost.tsx` hero `<img>`:
  - Import `buildImageAttrs` from `../../lib/images`.
  - Call `buildImageAttrs(post.meta.image)` when `post.meta.image` is truthy.
  - Spread `srcSet` and `sizes` onto the `<img>`, with post-specific `sizes`: override the helper's default with `"(max-width: 767px) 100vw, 1200px"` for hero layout.
  - Keep existing `loading="lazy"`, `decoding="async"`, `width="1200"`, `height="675"`.
- [x] **P1-4f**: Update `BlogList.tsx` card `<img>`:
  - Import `buildImageAttrs` from `../../lib/images`.
  - Call `buildImageAttrs(post.image)` when `post.image` is truthy.
  - Spread `srcSet` and `sizes` onto the `<img>`, with card-specific `sizes`: `"(max-width: 767px) 100vw, 600px"`.
  - Keep existing `loading="lazy"`, `decoding="async"`, `width="600"`, `height="338"`.

**Acceptance criteria:**
- [ ] `scripts/optimize-images.mjs` runs without errors and generates `og-image-default.webp`, `og-image-default-600.webp` in `public/` and `*-600.webp` in `public/images/blog/`
- [ ] `scripts/optimize-images.mjs` is idempotent — second run skips all existing outputs
- [ ] `scripts/optimize-images.mjs` exits with clear error if `og-image-default.jpg` is missing
- [ ] `package.json` includes `"optimize:images"` script
- [ ] `src/lib/images.ts` exports `buildImageAttrs()` — pure function, no side effects
- [ ] Blog card `<img>` has `srcSet` including `{image}-600.webp 600w` and `{image} 1200w`
- [ ] Blog card `<img>` has `sizes="(max-width: 767px) 100vw, 600px"`
- [ ] Blog post hero `<img>` has `srcSet` including `{image}-600.webp 600w` and `{image} 1200w`
- [ ] Blog post hero `<img>` has `sizes="(max-width: 767px) 100vw, 1200px"`
- [ ] Post without `image` emits no `<img>` (no regresión)
- [ ] `srcSet` is emitted even when `-600.webp` variant does not exist (graceful degradation via browser fallback to `src`)

**Files:** `scripts/optimize-images.mjs` (new), `src/lib/images.ts` (new), `src/components/Blog/BlogPost.tsx` (modify), `src/components/Blog/BlogList.tsx` (modify), `package.json` (modify), `public/og-image-default.webp` (generated), `public/og-image-default-600.webp` (generated), `public/images/blog/*-600.webp` (generated)
**Effort:** 1h 30m

---

### P1-5: ProjectPage CreativeWork JSON-LD

Add a `jsonLd` prop to `<SEO>` in `ProjectPage.tsx` with a `CreativeWork` schema. The schema includes all available project metadata and the author entity for Knowledge Graph linking.

- [x] **P1-5a**: Import `SITE_CONFIG` at the top of `ProjectPage.tsx` (add `baseUrl` destructuring alongside existing imports).
- [x] **P1-5b**: After the existing `if (!project) { ... }` guard and before the `return (<>...` JSX, construct the `jsonLd` object:
  - `@context`: `"https://schema.org"`
  - `@type`: `"CreativeWork"`
  - `name`: `project.title`
  - `description`: `project.shortDescription`
  - `datePublished`: `toISODate(project.date)` (reuse existing helper)
  - `url`: `` `${baseUrl}/proyecto/${project.id}` ``
  - `@id`: `` `${baseUrl}/proyecto/${project.id}#creativework` ``
  - `author`: `{ "@type": "Person", "name": "Ione Rodríguez", "url": baseUrl, "@id": `${baseUrl}/#person` }`
  - Conditionally add `image` field: only if `project.image` is truthy. Resolve to absolute URL via `project.image.startsWith('http') ? project.image : \`${baseUrl}${project.image}\``.
- [x] **P1-5c**: Add `jsonLd={jsonLd}` prop to the existing `<SEO>` element. Do not modify existing SEO props (title, description, image, url, type, publishedTime, tags).
- [x] **P1-5d**: Verify the existing 404 guard (`if (!project)`) already returns early before `jsonLd` construction — no JSON-LD is emitted for non-existent projects.

**Acceptance criteria:**
- [ ] Project page for a project with image emits `<script type="application/ld+json">` containing `"@type": "CreativeWork"`
- [ ] JSON-LD includes `name`, `description`, `datePublished`, `url`, `@id` (ending in `#creativework`)
- [ ] JSON-LD includes `author` with `"@type": "Person"` and `"@id": "https://thebellepoque.dev/#person"`
- [ ] JSON-LD includes `image` field when `project.image` is present (absolute URL)
- [ ] Project page for a project without image: JSON-LD does NOT contain an `image` field
- [ ] 404 project page (non-existent id): no JSON-LD `<script>` emitted
- [ ] Existing SEO props (title, description, etc.) remain unchanged on the `<SEO>` element

**Files:** `src/pages/ProjectPage.tsx` (modify)
**Effort:** 30 min

---

### P1-6: BlogPage CollectionPage JSON-LD

Add a `jsonLd` prop to `<SEO>` in `BlogPage.tsx` with a `CollectionPage` schema. The `hasPart` array lists all published posts as summarized `BlogPosting` entries. Data is sourced from `getAllPosts()` — a cheap second call since posts are loaded eagerly at build time.

- [x] **P1-6a**: Import `getAllPosts` from `../lib/posts` and `SITE_CONFIG` from `../lib/config` in `BlogPage.tsx`.
- [x] **P1-6b**: Call `getAllPosts()` (or wrap in `useMemo` for consistency, though data is static) to get the full post list.
- [x] **P1-6c**: Construct the `jsonLd` object before the `return`:
  - `@context`: `"https://schema.org"`
  - `@type`: `"CollectionPage"`
  - `name`: `SITE_CONFIG.blog.title` (`"El Laberinto del Código"`)
  - `description`: `SITE_CONFIG.blog.description`
  - `url`: `` `${SITE_CONFIG.baseUrl}/blog` ``
  - `@id`: `` `${SITE_CONFIG.baseUrl}/blog#collectionpage` ``
  - `hasPart`: `posts.map(post => ({ "@type": "BlogPosting", "headline": post.title, "description": post.description, "datePublished": post.date, "url": \`${SITE_CONFIG.baseUrl}/blog/${post.slug}\` }))`
- [x] **P1-6d**: Add `jsonLd={jsonLd}` prop to the existing `<SEO>` element. Do not modify existing props.
- [x] **P1-6e**: Confirm edge cases:
  - Posts with empty `description` or `date` are still included (schema.org is permissive, fields will be empty strings).
  - Empty blog (`posts.length === 0`): `hasPart: []` is emitted — valid per schema.org spec, not omitted.
  - Single post: `hasPart` has exactly 1 entry.

**Acceptance criteria:**
- [ ] Blog index page with 3+ posts emits `<script type="application/ld+json">` containing `"@type": "CollectionPage"`
- [ ] `hasPart` array has exactly N entries matching the number of published posts
- [ ] Each `hasPart` entry has `@type: "BlogPosting"`, `headline`, `url`, `datePublished`
- [ ] `name` matches `SITE_CONFIG.blog.title` (`"El Laberinto del Código"`)
- [ ] `url` is `https://thebellepoque.dev/blog`
- [ ] `@id` is `https://thebellepoque.dev/blog#collectionpage`
- [ ] Empty blog (0 posts): `hasPart: []` is emitted (empty array, not omitted)
- [ ] Existing SEO props (title, description, url) remain unchanged

**Files:** `src/pages/BlogPage.tsx` (modify)
**Effort:** 30 min

---

### P1-7: OG image WebP reference + dimension metadata

Update `SEO.tsx` and `index.html` to reference the WebP OG image and emit dimension/type meta tags. The actual `.webp` generation is handled by `scripts/optimize-images.mjs` (created in P1-4a, which handles both OG + blog images). The original `.jpg` is preserved as a CDN-level fallback.

- [x] **P1-7a**: In `SEO.tsx`, change the `OG_IMAGE_DEFAULT` constant from `.jpg` to `.webp`:
  - Before: `` `${SITE_CONFIG.baseUrl}/og-image-default.jpg` ``
  - After: `` `${SITE_CONFIG.baseUrl}/og-image-default.webp` ``
- [x] **P1-7b**: In `SEO.tsx`, add three unconditional meta tags after the existing `og:image` tag (inside `<Helmet>`):
  - `<meta property="og:image:width" content="1200" />`
  - `<meta property="og:image:height" content="630" />`
  - `<meta property="og:image:type" content="image/webp" />`
  - These are static — the default OG image is always 1200×630 WebP. Custom `image` props are expected to match OG dimensions.
- [x] **P1-7c**: In `index.html`, update the static OG image fallback references (lines 18 and 25) from `.jpg` to `.webp`:
  - `og:image` content: `https://thebellepoque.dev/og-image-default.jpg` → `https://thebellepoque.dev/og-image-default.webp`
  - `twitter:image` content: `https://thebellepoque.dev/og-image-default.jpg` → `https://thebellepoque.dev/og-image-default.webp`
- [x] **P1-7d**: In `index.html`, add three static meta tags for non-JS crawlers, placed immediately after the existing `og:image` meta tag:
  - `<meta property="og:image:width" content="1200" />`
  - `<meta property="og:image:height" content="630" />`
  - `<meta property="og:image:type" content="image/webp" />`
- [ ] **P1-7e**: Verify the script from P1-4a already handles OG image generation (Target A). If the script hasn't been run yet, running `pnpm run optimize:images` generates the `.webp` variants.

**Acceptance criteria:**
- [ ] `SEO.tsx` `OG_IMAGE_DEFAULT` references `.webp`, not `.jpg`
- [ ] Dynamic page renders `og:image:width="1200"`, `og:image:height="630"`, `og:image:type="image/webp"` in `<head>`
- [ ] `index.html` static `og:image` and `twitter:image` reference `.webp`
- [ ] `index.html` static `og:image:width`, `og:image:height`, `og:image:type` meta tags are present
- [ ] Original `og-image-default.jpg` is preserved (not deleted) as CDN fallback
- [ ] Running `pnpm run optimize:images` generates `public/og-image-default.webp` (1200×630) and `public/og-image-default-600.webp` (600×315)
- [ ] OG image meta still works when `.webp` doesn't exist yet (manual step before deploy)

**Files:** `src/components/SEO.tsx` (modify), `index.html` (modify)
**Effort:** 30 min

---

## Task Dependency Graph

```
P1-4a (script: OG + blog images)
 ├── P1-4c (run script) ── generates files for P1-7
 ├── P1-4d (buildImageAttrs helper)
 │    ├── P1-4e (BlogPost srcSet)
 │    └── P1-4f (BlogList srcSet)
 └── P1-7e (OG .webp files exist)

P1-7a/b (SEO.tsx OG changes) ─ independent of P1-4
P1-7c/d (index.html OG changes) ─ independent of P1-4

P1-5 (ProjectPage JSON-LD) ─ independent
P1-6 (BlogPage JSON-LD) ─ independent
```

**Parallelizable:** P1-4d+e+f, P1-5, P1-6, P1-7a/b/c/d can all be done in parallel after P1-4a is created.
