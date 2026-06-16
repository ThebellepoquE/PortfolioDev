# Design: SEO & Performance Improvements — P1

## Technical Approach

P1 builds on P0's template work by adding **asset generation** (one-shot sharp scripts) and **structured data** (CreativeWork + CollectionPage JSON-LD). No new runtime deps. Everything flows through existing component interfaces — `SEO.tsx` `jsonLd` prop and `<img>` attribute extensions. Scripts follow the `resize-profile-photo.mjs` pattern: sharp-based, idempotent, run manually.

## Architecture Decisions

| Decision | Options | Choice | Rationale |
|----------|---------|--------|-----------|
| Image pipeline location | `scripts/optimize-images.mjs` (new) vs extend `resize-profile-photo.mjs` | New single script with two targets | Separates blog+OG concerns from profile; one script, two scan paths. Follows existing `scripts/resize-profile-photo.mjs` convention (one purpose per lifecycle moment). |
| Script execution trigger | Manual `npm run optimize-images` vs build hook | Manual npm script | Per proposal: "scripts are one-shot, not in hot-reload or CI build." Blog images change rarely. |
| srcSet missing variant | Runtime file-existence check vs always-emit | Always emit `srcSet`, browser degrades to `src` on 404 | No Node.js `fs` calls in React components. Acceptable UX: broken-srcSet attempt is invisible to user. |
| OG image reference | Reference `.webp` + keep `.jpg` fallback vs reference both vs `.jpg` only | Reference `.webp`, keep `.jpg` on disk | Spec requirement. WebP is universally supported by OG scrapers. JPEG preserved as CDN-level fallback. |
| ProjectPage schema type | `CreativeWork` vs `SoftwareApplication` | `CreativeWork` | Projects are mixed (websites, scripts, portfolios). `CreativeWork` is the parent type that covers all. `SoftwareApplication` would misrepresent non-software projects. |
| BlogPage JSON-LD data source | Lift `getAllPosts()` to `BlogPage` vs restructure `BlogList` props | Import `getAllPosts()` in `BlogPage`, keep `BlogList` unchanged | Minimal change. `getAllPosts()` uses `import.meta.glob(eager:true)` — data is loaded at build time, so a second call is a cheap array reassembly. No component interface refactor. |

## Data Flow

```
                        ┌─────────────────────┐
                        │  scripts/optimize-   │
                        │  images.mjs (sharp)  │
                        └──────────┬──────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
   public/og-image-      public/images/blog/     public/og-image-
   default.webp          *-600.webp              default-600.webp
   (1200x630)            (max-width 600)         (600x315)
              │                    │                    │
              ▼                    ▼                    ▼
         SEO.tsx            BlogPost.tsx           index.html
      OG_IMAGE_DEFAULT     srcSet + sizes       static OG fallback
      .webp reference      600w / 1200w          .webp reference
      + width/height/type  sizes attr            + width/height meta
              │
              ▼
   ┌──────────────────────┐
   │  SEO.tsx jsonLd prop  │
   │  (existing interface) │
   └──────────────────────┘
              │
     ┌────────┼────────┐
     ▼        ▼        ▼
  BlogPost  ProjectPage  BlogPage
  (P0 done) (CreativeWork) (CollectionPage)
```

## Image Pipeline

### Script: `scripts/optimize-images.mjs`

Two targets, same invocation:

**Target A — OG image**: Read `public/og-image-default.jpg` → produce:
- `public/og-image-default.webp` (1200×630, fit: cover)
- `public/og-image-default-600.webp` (600×315, fit: cover)

**Target B — Blog images**: Scan `public/images/blog/*.webp` (excluding `*-600.webp`) → for each, produce `*-600.webp` at width 600 (aspect-ratio preserved). Skip if output exists.

```js
// Pseudocode
if exists('public/og-image-default.jpg'):
  sharp(jpg).resize(1200,630).webp().toFile('public/og-image-default.webp')
  sharp(jpg).resize(600,315).webp().toFile('public/og-image-default-600.webp')

for file in glob('public/images/blog/*.webp') exclude '*-600.webp':
  out = file.replace('.webp', '-600.webp')
  if not exists(out):
    sharp(file).resize(600, null, { withoutEnlargement: true }).webp().toFile(out)
```

Naming convention: `{basename}-600.webp` in the same directory as the source.

### srcSet Integration

Both `BlogPost.tsx` and `BlogList.tsx` use a shared helper (co-located in `src/lib/images.ts`):

```typescript
export function buildImageAttrs(imagePath: string): {
  srcSet: string;
  sizes: string;
} {
  const dir = imagePath.substring(0, imagePath.lastIndexOf('/') + 1);
  const base = imagePath.substring(imagePath.lastIndexOf('/') + 1);
  const ext = base.lastIndexOf('.');
  const name = ext > 0 ? base.substring(0, ext) : base;
  const extPart = ext > 0 ? base.substring(ext) : '';
  const variant = `${dir}${name}-600${extPart}`;
  return {
    srcSet: `${variant} 600w, ${imagePath} 1200w`,
    sizes: '(max-width: 767px) 100vw, 600px',
  };
}
```

- **BlogList** (`BlogCard`): `sizes="(max-width: 767px) 100vw, 600px"`, width=600, height=338.
- **BlogPost** (hero): `sizes="(max-width: 767px) 100vw, 1200px"`, width=1200, height=675.

The helper is shared to avoid duplication across the two components.

## JSON-LD Schemas

### CreativeWork (ProjectPage)

```typescript
const baseUrl = SITE_CONFIG.baseUrl;
const projectUrl = `${baseUrl}/proyecto/${project.id}`;

const jsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: project.title,
  description: project.shortDescription,
  datePublished: toISODate(project.date),
  url: projectUrl,
  '@id': `${projectUrl}#creativework`,
  author: {
    '@type': 'Person',
    name: 'Ione Rodríguez',
    url: baseUrl,
    '@id': `${baseUrl}/#person`,
  },
};

if (project.image) {
  jsonLd.image = project.image.startsWith('http')
    ? project.image
    : `${baseUrl}${project.image}`;
}
```

`@id` uses fragment `#creativework` for disambiguation from BlogPosting `#blogposting`. Author `@id` (`/##person`) cross-links to BlogPosting entity, supporting Google Knowledge Graph.

### CollectionPage (BlogPage)

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: SITE_CONFIG.blog.title,
  description: SITE_CONFIG.blog.description,
  url: `${SITE_CONFIG.baseUrl}/blog`,
  '@id': `${SITE_CONFIG.baseUrl}/blog#collectionpage`,
  hasPart: posts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${SITE_CONFIG.baseUrl}/blog/${post.slug}`,
  })),
};
```

`hasPart` is always emitted (empty array when no posts). Uses `SITE_CONFIG.blog.title`/`description` for consistency with the blog's own metadata.

## SEO.tsx OG Image Changes

`OG_IMAGE_DEFAULT` constant changes from `.jpg` to `.webp`. Three new meta tags added unconditionally:

```tsx
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/webp" />
```

These are static — the default OG image dimensions are always 1200×630. If a page provides a custom `image` prop, `imageUrl` is that custom path (already resolved via `absoluteUrl`), and the dimension tags still reference 1200×630 (acceptable simplification — custom images are expected to match OG dimensions).

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Blog post without `image` | No `<img>` emitted (existing guard), no srcSet needed. |
| WebP variant missing | `srcSet` emitted anyway; browser attempts load, gets 404, falls back to `src`. No runtime check. |
| Project without `image` | `image` field omitted from JSON-LD (conditional spread). |
| Project without `description` | `Project.shortDescription` is required in the type — always present. |
| Empty blog (0 posts) | `hasPart: []` emitted. Valid CollectionPage per spec. |
| Blog post without description/date | Fields included with empty string values (schema.org is permissive). |
| `og-image-default.webp` doesn't exist yet | Meta tags still reference `.webp`. Documentation instructs to run script before deploy. No runtime fallback — CDN serves `.jpg` at the same path root if needed. |
| `og-image-default.jpg` source missing | Script exits with clear error message (same pattern as `resize-profile-photo.mjs`). |

## Files Affected

| File | Action | Est. Lines | Description |
|------|--------|-----------|-------------|
| `scripts/optimize-images.mjs` | Create | ~70 | Sharp script for OG .webp variants + blog -600.webp variants |
| `src/lib/images.ts` | Create | ~20 | `buildImageAttrs()` helper for srcSet + sizes |
| `src/components/SEO.tsx` | Modify | +8 | `og:image:width/height/type` meta tags; OG_IMAGE_DEFAULT → .webp |
| `src/components/Blog/BlogPost.tsx` | Modify | +5 | Add `srcSet`, `sizes` via helper; update `sizes` for hero layout |
| `src/components/Blog/BlogList.tsx` | Modify | +5 | Add `srcSet`, `sizes` via helper; card-specific sizes |
| `src/pages/ProjectPage.tsx` | Modify | +25 | `jsonLd` prop with CreativeWork schema |
| `src/pages/BlogPage.tsx` | Modify | +30 | Import `getAllPosts`, build CollectionPage JSON-LD, pass `jsonLd` to SEO |
| `index.html` | Modify | +4 | OG image → .webp reference; add width/height meta tags |
| `public/og-image-default.webp` | Create (generated) | — | 1200×630 WebP from source .jpg |
| `public/og-image-default-600.webp` | Create (generated) | — | 600×315 WebP from source .jpg |
| `public/images/blog/*-600.webp` | Create (generated) | — | 600w WebP variants per post image |

**Total estimated lines changed**: ~170 (120 source + 50 generated paths). Under the 400-line review budget.

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | `buildImageAttrs()` helper | Pure function: input image path → output srcSet/sizes. Test with paths containing/not containing directories. |
| Unit | Image attr presence in rendered output | Vitest + Testing Library: assert `<img>` in BlogPost/BlogList has `srcSet`, `sizes`, correct width/height. |
| Integration | JSON-LD script presence | Render ProjectPage/BlogPage with test data, verify `<script type="application/ld+json">` contains expected schema type. |
| Integration | Project 404 → no JSON-LD | Render ProjectPage with unknown id, assert no JSON-LD script. |
| Manual | Image pipeline output | Run `node scripts/optimize-images.mjs`, verify files created with correct dimensions (via `sharp` metadata or `file` command). |

## Migration / Rollout

No migration required. Changes are additive:
- New script run manually once (`node scripts/optimize-images.mjs`), then only when images change.
- No existing file deleted — `og-image-default.jpg` preserved.
- No runtime behavior changes for pages without the new props.

## Open Questions

- [ ] Should `author.name` (`Ione Rodríguez`) be centralized in `SITE_CONFIG`? Currently duplicated in BlogPosting and CreativeWork JSON-LD. Out of scope for P1, but worth a follow-up.
- [ ] `og:image:width/height` for custom images (not default) — currently hardcoded to 1200×630. If a project/blog post provides a custom image with different dimensions, the meta will be inaccurate. Acceptable for P1 — custom images are expected at OG dimensions.
