# Tasks: seo-perf-improvements — P0 Phase

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~27 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | All P0 tasks (1-3) | PR 1 | Independent concerns, small diff, safe to batch |

---

## P0 — Quick Wins

### P0-1: twitter:site / twitter:creator + og:locale

Add social authorship and locale metadata to SEO templates.

- [x] **P0-1a**: Add `locale: "es_ES"` field to `SITE_CONFIG` in `src/lib/config.ts`
- [x] **P0-1b**: Add `<meta name="twitter:site" content="@thebellepoque" />` and `<meta name="twitter:creator" content="@thebellepoque" />` to `SEO.tsx`, deriving from `SITE_CONFIG.username`
- [x] **P0-1c**: Add `<meta property="og:locale" content="es_ES" />` to `SEO.tsx`, derived from `SITE_CONFIG.locale`
- [x] **P0-1d**: Add static `<meta name="twitter:site" content="@thebellepoque" />` and `<meta property="og:locale" content="es_ES" />` to `index.html` as fallback for non-JS crawlers

**Acceptance criteria:**
- [x] Dynamic page renders `twitter:site`, `twitter:creator`, and `og:locale` in `<head>`
- [x] Static `index.html` contains `twitter:site` and `og:locale` fallback tags
- [x] Values match spec: `@thebellepoque` and `es_ES`

**Files:** `src/lib/config.ts`, `src/components/SEO.tsx`, `index.html`
**Effort:** 10 min

---

### P0-2: Blog images — loading="lazy", decoding="async", width/height

Add performance attributes to blog `<img>` tags to enable native lazy loading and prevent CLS.

- [x] **P0-2a**: Add `loading="lazy"`, `decoding="async"`, `width="1200"`, and `height="675"` to the featured image `<img>` in `BlogPost.tsx` (hero area, 16:9 aspect ratio)
- [x] **P0-2b**: Add `loading="lazy"`, `decoding="async"`, `width="600"`, and `height="338"` to the card image `<img>` in `BlogList.tsx` (card area, 16:9 aspect ratio)
- [x] **P0-2c**: Verify via CSS that `height: auto` is applied to `.blog-post__image` and `.blog-card__image` to preserve aspect ratio (no CLS)
- [x] **P0-2d**: Confirm no blog image qualifies as LCP (all are below-the-fold by design); if any hero image becomes LCP candidate, remove `loading="lazy"` from it

**Acceptance criteria:**
- [x] Blog card `<img>` has `loading="lazy"`, `decoding="async"`, `width="600"`, `height="338"`
- [x] Blog post hero `<img>` has `loading="lazy"`, `decoding="async"`, `width="1200"`, `height="675"`
- [x] Browser reserves correct aspect-ratio box before image loads (no layout shift)
- [x] Post without `image` field emits no `<img>` tag (no broken image)

**Files:** `src/components/Blog/BlogPost.tsx`, `src/components/Blog/BlogList.tsx`
**Effort:** 10 min

---

### P0-3: JSON-LD consolidation — migrate to SEO jsonLd prop

Remove inline `<script type="application/ld+json">` from `BlogPost.tsx` and route structured data through `<SEO jsonLd={...}>`.

- [x] **P0-3a**: Remove the standalone `<script type="application/ld+json">` (lines 55-58) from `BlogPost.tsx`
- [x] **P0-3b**: Enhance the `jsonLd` object with missing fields: `url` (canonical post URL), `@id` (`{baseUrl}/blog/{slug}#blogposting`), and `mainEntityOfPage` (`{baseUrl}/blog/{slug}`)
- [x] **P0-3c**: Add `@id` to `author` object (`{baseUrl}/#person`) in the `jsonLd` object for cross-entity linking
- [x] **P0-3d**: Pass the enhanced `jsonLd` object as the `jsonLd` prop to `<SEO>` in `BlogPost.tsx`
- [x] **P0-3e**: Verify rendered output has exactly one `<script type="application/ld+json">` in `<head>` (no duplicate in body)

**Acceptance criteria:**
- [x] No inline `<script type="application/ld+json">` in `BlogPost.tsx` body
- [x] Exactly one JSON-LD script in rendered `<head>`
- [x] JSON-LD contains `"@type": "BlogPosting"`, `url`, `@id`, and `mainEntityOfPage`
- [x] `author.@id` links to `https://thebellepoque.dev/#person`
- [x] Non-blog pages (Home, ProjectPage without `jsonLd`) emit no JSON-LD script

**Files:** `src/components/Blog/BlogPost.tsx`
**Effort:** 10 min
