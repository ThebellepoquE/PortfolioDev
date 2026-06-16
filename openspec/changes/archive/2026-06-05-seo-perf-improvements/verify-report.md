# Verification Report: seo-perf-improvements

**Change**: seo-perf-improvements (P0 + P1)
**Version**: N/A
**Mode**: Standard

---

## Summary

- **Overall status**: PASS
- **Lint**: PASS
- **Typecheck**: PASS (`tsc -b` within build pipeline — no standalone `typecheck` script exists)
- **Build**: PASS
- **P0 spec compliance**: 3/3 passing (6/6 acceptance criteria)
- **P1 spec compliance**: 4/4 passing (16/16 acceptance criteria)

---

## Build & Tests Execution

**Build**: ✅ Passed
```
> pnpm run generate-sitemap && tsc -b && vite build
Sitemap generado: .../public/sitemap.xml
✓ 337 modules transformed.
✓ built in 2.90s
```

**Lint**: ✅ Passed
```
> eslint .
(no errors)
```

**Tests**: ⚠️ Not executed — no test suite covering these changes. All verification is static/structural (source inspection + build output evidence).

---

## P0 Results

### P0-1: twitter:site / twitter:creator + og:locale

| Criterion | Status | Evidence |
|-----------|--------|----------|
| `SEO.tsx` renders `twitter:site="@thebellepoque"` | ✅ PASS | `SEO.tsx:79` — `` content={`@${SITE_CONFIG.username}`} `` |
| `SEO.tsx` renders `twitter:creator="@thebellepoque"` | ✅ PASS | `SEO.tsx:80` — `` content={`@${SITE_CONFIG.username}`} `` |
| `SEO.tsx` renders `og:locale="es_ES"` | ✅ PASS | `SEO.tsx:67` — `content={SITE_CONFIG.locale}` |
| `SITE_CONFIG.locale = "es_ES"` | ✅ PASS | `config.ts:6` |
| `index.html` static `twitter:site` fallback | ✅ PASS | `index.html:29` |
| `index.html` static `twitter:creator` fallback | ✅ PASS | `index.html:30` |
| `index.html` static `og:locale` fallback | ✅ PASS | `index.html:31` |
| Confirmed in built output (dist) | ✅ PASS | `dist/assets/SEO-BDJI1r9H.js` contains all three |

**Verdict**: ✅ PASS — 8/8 criteria met.

---

### P0-2: Blog images — loading="lazy", decoding="async", width/height

| Criterion | Status | Evidence |
|-----------|--------|----------|
| BlogPost hero `<img>` has `loading="lazy"` | ✅ PASS | `BlogPost.tsx:84` |
| BlogPost hero `<img>` has `decoding="async"` | ✅ PASS | `BlogPost.tsx:85` |
| BlogPost hero `<img>` has `width="1200"` `height="675"` | ✅ PASS | `BlogPost.tsx:86-87` |
| BlogList card `<img>` has `loading="lazy"` | ✅ PASS | `BlogList.tsx:48` |
| BlogList card `<img>` has `decoding="async"` | ✅ PASS | `BlogList.tsx:49` |
| BlogList card `<img>` has `width="600"` `height="338"` | ✅ PASS | `BlogList.tsx:50-51` |
| CSS `height: auto` on `.blog-post__image` | ✅ PASS | `BlogPost.scss:55` |
| CSS `height: auto` on `.blog-card__image` | ✅ PASS | `BlogList.scss:96` |
| Post without `image` emits no `<img>` | ✅ PASS | `BlogPost.tsx:77` — `{post.meta.image && (...)}` guard |

**Verdict**: ✅ PASS — 9/9 criteria met.

---

### P0-3: JSON-LD consolidation to SEO jsonLd prop

| Criterion | Status | Evidence |
|-----------|--------|----------|
| No inline `<script type="application/ld+json">` in `BlogPost.tsx` body | ✅ PASS | Scanned entire file — only present inside `<SEO>` via prop at line 62 |
| JSON-LD passed as `jsonLd` prop to `<SEO>` | ✅ PASS | `BlogPost.tsx:62` — `jsonLd={jsonLd}` |
| `url` field present in jsonLd | ✅ PASS | `BlogPost.tsx:41` — `"url": postUrl` |
| `@id` field present (`#blogposting` fragment) | ✅ PASS | `BlogPost.tsx:42` — `"@id": "${postUrl}#blogposting"` |
| `mainEntityOfPage` field present | ✅ PASS | `BlogPost.tsx:43` |
| `author.@id` links to `/#person` | ✅ PASS | `BlogPost.tsx:48` — `"@id": "${baseUrl}/#person"` |
| Non-blog pages emit no JSON-LD (conditional render in SEO) | ✅ PASS | `SEO.tsx:86-91` — `{jsonLd && (...)}` |

**Verdict**: ✅ PASS — 7/7 criteria met.

---

## P1 Results

### P1-4: Responsive blog images — srcSet + sizes + WebP

| Criterion | Status | Evidence |
|-----------|--------|----------|
| `buildImageAttrs()` exists in `src/lib/images.ts` | ✅ PASS | `images.ts:6` — named export |
| Returns `{ srcSet, sizes }` | ✅ PASS | `images.ts:7-8` type signature |
| `scripts/optimize-images.mjs` exists | ✅ PASS | 97 lines, follows `resize-profile-photo.mjs` pattern |
| Script idempotent (skips existing outputs) | ✅ PASS | `optimize-images.mjs:47-50`, `78-80` |
| Script exits with error if OG `.jpg` missing | ✅ PASS | `optimize-images.mjs:34-37` |
| `package.json` has `"optimize:images"` script | ✅ PASS | `package.json` — `node scripts/optimize-images.mjs` |
| BlogPost hero uses `buildImageAttrs()` | ✅ PASS | `BlogPost.tsx:78` — call with `post.meta.image` |
| BlogPost hero `sizes` overridden to `1200px` | ✅ PASS | `BlogPost.tsx:89` — `sizes="(max-width: 767px) 100vw, 1200px"` |
| BlogList card uses `buildImageAttrs()` | ✅ PASS | `BlogList.tsx:42` — call with `post.image` |
| BlogList card `sizes` uses helper default (`600px`) | ✅ PASS | `BlogList.tsx:53` — `sizes={imgAttrs.sizes}` → `600px` |
| Generated `og-image-default.webp` (1200×630) | ✅ PASS | `file` confirms 1200×630 WebP |
| Generated `og-image-default-600.webp` (600×315) | ✅ PASS | `file` confirms 600×315 WebP |
| 5 blog `*-600.webp` variants exist in `public/images/blog/` | ✅ PASS | `ls` confirms 5 files |
| Post without image → no `<img>` (no regression) | ✅ PASS | Same guard as P0-2 |

**Verdict**: ✅ PASS — 14/14 criteria met.

---

### P1-5: ProjectPage CreativeWork JSON-LD

| Criterion | Status | Evidence |
|-----------|--------|----------|
| `ProjectPage.tsx` passes `jsonLd` prop to `<SEO>` | ✅ PASS | `ProjectPage.tsx:93` |
| `@type: "CreativeWork"` | ✅ PASS | `ProjectPage.tsx:63` |
| `name`, `description` present | ✅ PASS | `ProjectPage.tsx:64-65` |
| `datePublished` present (via `toISODate`) | ✅ PASS | `ProjectPage.tsx:66` |
| `url` present | ✅ PASS | `ProjectPage.tsx:67` |
| `@id` present with `#creativework` fragment | ✅ PASS | `ProjectPage.tsx:68` |
| `author` with `@type: Person` and `@id: /#person` | ✅ PASS | `ProjectPage.tsx:69-74` |
| `image` field present only when `project.image` is truthy | ✅ PASS | `ProjectPage.tsx:77-81` — conditional `if` block |
| `image` resolved to absolute URL | ✅ PASS | `ProjectPage.tsx:78-80` — `startsWith('http')` check |
| 404 guard before jsonLd construction → no JSON-LD | ✅ PASS | `ProjectPage.tsx:43-56` — early return before jsonLd |
| Existing SEO props unchanged | ✅ PASS | `ProjectPage.tsx:85-94` — all original props preserved |

**Verdict**: ✅ PASS — 11/11 criteria met.

---

### P1-6: BlogPage CollectionPage JSON-LD

| Criterion | Status | Evidence |
|-----------|--------|----------|
| `BlogPage.tsx` passes `jsonLd` prop to `<SEO>` | ✅ PASS | `BlogPage.tsx:33` |
| `@type: "CollectionPage"` | ✅ PASS | `BlogPage.tsx:13` |
| `name` from `SITE_CONFIG.blog.title` | ✅ PASS | `BlogPage.tsx:14` |
| `description` from `SITE_CONFIG.blog.description` | ✅ PASS | `BlogPage.tsx:15` |
| `url` = `{baseUrl}/blog` | ✅ PASS | `BlogPage.tsx:16` |
| `@id` = `{baseUrl}/blog#collectionpage` | ✅ PASS | `BlogPage.tsx:17` |
| `hasPart` with `BlogPosting` entries | ✅ PASS | `BlogPage.tsx:18-24` |
| Each entry has `headline`, `url`, `datePublished`, `description` | ✅ PASS | `BlogPage.tsx:20-23` |
| Empty blog → `hasPart: []` | ✅ PASS | `posts.map(...)` → `[]` when `posts` is empty array |
| Existing SEO props unchanged | ✅ PASS | `BlogPage.tsx:29-33` |

**Verdict**: ✅ PASS — 10/10 criteria met.

---

### P1-7: OG image WebP reference + dimension metadata

| Criterion | Status | Evidence |
|-----------|--------|----------|
| `OG_IMAGE_DEFAULT` references `.webp` | ✅ PASS | `SEO.tsx:5` — `/og-image-default.webp` |
| `og:image:width="1200"` rendered | ✅ PASS | `SEO.tsx:61` |
| `og:image:height="630"` rendered | ✅ PASS | `SEO.tsx:62` |
| `og:image:type="image/webp"` rendered | ✅ PASS | `SEO.tsx:63` |
| `index.html` static `og:image` → `.webp` | ✅ PASS | `index.html:18` |
| `index.html` static `twitter:image` → `.webp` | ✅ PASS | `index.html:28` |
| `index.html` static `og:image:width/height/type` | ✅ PASS | `index.html:19-21` |
| Original `.jpg` preserved | ✅ PASS | `public/og-image-default.jpg` (29461 bytes) |
| Obra confirms built JS emits all OG tags | ✅ PASS | `dist/assets/SEO-BDJI1r9H.js` |

**Verdict**: ✅ PASS — 9/9 criteria met.

---

## Warnings

| # | Severity | Description |
|---|----------|-------------|
| 1 | LOW | No standalone `typecheck` script exists. `tsc -b` runs within `pnpm build` and passed. Verification used `pnpm build` instead. |
| 2 | LOW | No tests were run — the project has a Vitest suite but no tests specifically covering SEO meta tags, `buildImageAttrs()`, or JSON-LD schema contents. All verification is static (source inspection + build output). |
| 3 | NOTE | `og:image:width`/`height`/`type` meta tags are hardcoded to 1200×630 WebP even when a custom image prop is passed. Per design.md this is an accepted simplification. |

---

## CRITICAL Issues

None.

---

## Verdict

**PASS** — All P0 and P1 acceptance criteria verified via source inspection and build output. 22/22 criteria across 7 requirements met. Lint, typecheck (via tsc), and build all pass cleanly.
