# Delta Spec: seo-perf-improvements

## Phase P0 — Quick Wins (~30 min)

### Requirement: Twitter Card authorship and OG locale metadata (Item 1)

The SEO component MUST emit `twitter:site`, `twitter:creator`, and `og:locale` meta tags on every page. Static fallbacks in `index.html` MUST include `twitter:site` and `og:locale` for crawlers that do not execute JavaScript.

`SITE_CONFIG` MUST expose a `locale` field (`es_ES`). `SEO.tsx` MUST derive `twitter:site` and `twitter:creator` from `SITE_CONFIG.username` as `@${username}`.

#### Scenario: Dynamic page loads with full social metadata

- GIVEN a user visits any page (e.g., `/blog/some-post`)
- WHEN the page renders via React
- THEN the `<head>` contains `<meta name="twitter:site" content="@thebellepoque" />`
- AND `<meta name="twitter:creator" content="@thebellepoque" />`
- AND `<meta property="og:locale" content="es_ES" />`

#### Scenario: Static fallback for non-JS crawlers

- GIVEN a crawler fetches `index.html` without executing JavaScript
- WHEN the raw HTML is inspected
- THEN `<meta name="twitter:site" content="@thebellepoque" />` is present in the static `<head>`
- AND `<meta property="og:locale" content="es_ES" />` is present in the static `<head>`

---

### Requirement: Lazy loading and CLS-prevention attributes on blog images (Item 2)

Every `<img>` tag in `BlogPost.tsx` and `BlogList.tsx` MUST include `loading="lazy"`, `decoding="async"`, and explicit `width`/`height` attributes matching the intrinsic image dimensions.

Image dimensions MUST reflect the largest expected render size: blog cards at 600w, blog post hero at 1200w. Aspect ratio MUST be preserved via CSS (`height: auto`) to prevent CLS from width/height overrides.

#### Scenario: Blog list card image renders with lazy loading

- GIVEN a blog list page with at least one post having a featured image
- WHEN the page renders
- THEN each `<img>` in a blog card has `loading="lazy"`, `decoding="async"`, `width="600"`, and `height` matching the image aspect ratio
- AND the browser reserves the correct aspect-ratio box before the image loads (no layout shift)

#### Scenario: Blog post hero image renders with lazy loading

- GIVEN a blog post with a featured image
- WHEN the post page renders
- THEN the hero `<img>` has `loading="lazy"`, `decoding="async"`, `width="1200"`, and `height` matching the image aspect ratio

#### Scenario: Blog post without featured image

- GIVEN a blog post with no `image` field
- WHEN the post page renders
- THEN no `<img>` tag is emitted (no broken image or empty attributes)

---

### Requirement: JSON-LD consolidation to SEO component prop (Item 3)

`BlogPost.tsx` MUST NOT inject JSON-LD via a standalone `<script>` tag. All structured data MUST flow through the `jsonLd` prop of the `<SEO>` component.

The BlogPosting JSON-LD object MUST include `url`, `@id`, and `mainEntityOfPage` fields in addition to the existing `headline`, `description`, `image`, `datePublished`, and `author` fields.

`@id` MUST use the format `{baseUrl}/blog/{slug}#blogposting`. `mainEntityOfPage` MUST reference `{baseUrl}/blog/{slug}`. The `author.@id` SHOULD be `{baseUrl}/#person` for cross-entity linking.

#### Scenario: Blog post page emits single JSON-LD via SEO component

- GIVEN a blog post page loads
- WHEN the rendered HTML is inspected
- THEN exactly one `<script type="application/ld+json">` is present in `<head>`
- AND no duplicate `<script type="application/ld+json">` exists in the body
- AND the JSON-LD contains `"@type": "BlogPosting"`
- AND the JSON-LD contains `"url"`, `"@id"`, and `"mainEntityOfPage"` fields

#### Scenario: Non-blog pages are unaffected

- GIVEN a page that is not a blog post (e.g., Home, ProjectPage without jsonLd prop)
- WHEN the page renders
- THEN no JSON-LD `<script>` tag is emitted

---

## Phase P1 — Medium Impact (~3 h)

### Requirement: Responsive blog images with srcSet and sizes (Item 4)

Blog post hero images and blog card images MUST emit `srcSet` and `sizes` attributes to serve WebP variants at appropriate resolutions.

A build/setup script using `sharp` SHALL generate `*-600.webp` variants from source images in `public/`. The script MUST be re-runnable (idempotent) and skip existing outputs.

Blog card images: `sizes="(max-width: 767px) 100vw, 600px"`, `srcSet` with `-600.webp` at 600w and the original at 1200w.

Blog post hero images: `sizes="(max-width: 767px) 100vw, 1200px"`, `srcSet` with `-600.webp` at 600w and the original at 1200w.

#### Scenario: Blog card serves responsive WebP variant

- GIVEN a blog list page with at least one post having an image `post-image.jpg`
- AND `post-image-600.webp` exists in the same directory
- WHEN the page renders on a viewport 600px wide
- THEN the `<img>` has `srcSet` including `post-image-600.webp 600w` and `post-image.jpg 1200w`
- AND the `<img>` has `sizes="(max-width: 767px) 100vw, 600px"`
- AND the browser loads the 600w variant

#### Scenario: Blog post hero serves responsive WebP variant

- GIVEN a blog post with an image `post-image.jpg`
- AND `post-image-600.webp` exists
- WHEN the post renders on a viewport 1200px wide
- THEN the `<img>` has `srcSet` including `post-image-600.webp 600w` and `post-image.jpg 1200w`
- AND the `<img>` has `sizes="(max-width: 767px) 100vw, 1200px"`
- AND the browser loads the 1200w variant

#### Scenario: Variant image does not exist yet

- GIVEN a blog post has an image but the `*-600.webp` variant has not been generated
- WHEN the page renders
- THEN the `<img>` still renders with the original `src` (graceful degradation)
- AND no broken image or 404 is shown

---

### Requirement: ProjectPage CreativeWork JSON-LD (Item 5)

`ProjectPage.tsx` MUST pass a `jsonLd` prop to `<SEO>` containing a `CreativeWork` schema.

The JSON-LD MUST include: `@type`, `name`, `description`, `datePublished`, `author` (Person reference with `@id`), `url`, `@id`, and `image` (when available). If the project has a code repository link, `softwareVersion` or `codeRepository` MAY be included.

#### Scenario: Project page with all metadata

- GIVEN a project with title, description, date, image, and GitHub link
- WHEN the project page renders
- THEN the JSON-LD script contains `"@type": "CreativeWork"`
- AND includes `"name"`, `"description"`, `"datePublished"`, `"url"`, `"@id"`
- AND includes `"author"` with `"@type": "Person"` and `"@id": "https://thebellepoque.dev/#person"`

#### Scenario: Project page without image

- GIVEN a project with no image field
- WHEN the project page renders
- THEN the JSON-LD script does NOT include an `"image"` field

#### Scenario: Project page for non-existent project (404)

- GIVEN a user navigates to `/proyecto/non-existent`
- WHEN the page renders the 404 state
- THEN no JSON-LD is emitted

---

### Requirement: BlogPage CollectionPage JSON-LD (Item 6)

`BlogPage.tsx` MUST pass a `jsonLd` prop to `<SEO>` containing a `CollectionPage` schema.

The JSON-LD MUST include: `@type` (`CollectionPage`), `name`, `description`, `url`, `@id`, and `hasPart` array. Each element in `hasPart` MUST be a summarized `BlogPosting` with at minimum `@type`, `headline`, `url`, `datePublished`, and `description`.

Blog posts without a published date or description MUST still be included with available fields.

#### Scenario: Blog index page with multiple posts

- GIVEN there are 3 published blog posts
- WHEN the blog index page renders
- THEN the JSON-LD contains `"@type": "CollectionPage"`
- AND `hasPart` is an array with exactly 3 entries
- AND each entry has `"@type": "BlogPosting"` with `headline`, `url`, `datePublished`

#### Scenario: Blog index page with no posts

- GIVEN there are 0 published blog posts
- WHEN the blog index page renders
- THEN the JSON-LD contains `"hasPart": []` (empty array, not omitted)

---

### Requirement: OG image WebP conversion with dimension metadata (Item 7)

The default OG image MUST be served as WebP with explicit dimension and type meta tags.

A script using `sharp` SHALL generate `og-image-default.webp` (1200×630) and `og-image-default-600.webp` (600×315) from the existing `og-image-default.jpg`.

`SEO.tsx` MUST emit `og:image:width`, `og:image:height`, and `og:image:type` meta tags alongside `og:image`. The `OG_IMAGE_DEFAULT` constant MUST reference the `.webp` variant. `index.html` static fallback MUST also reference the `.webp` path.

The original `.jpg` file MUST be preserved as fallback. The SEO component SHOULD NOT reference it directly; fallback is handled at the HTTP/CDN level.

#### Scenario: Page renders with full OG image metadata

- GIVEN any page loads
- AND `public/og-image-default.webp` exists
- WHEN the rendered HTML is inspected
- THEN `<meta property="og:image" content="https://thebellepoque.dev/og-image-default.webp" />` is present
- AND `<meta property="og:image:width" content="1200" />` is present
- AND `<meta property="og:image:height" content="630" />` is present
- AND `<meta property="og:image:type" content="image/webp" />` is present

#### Scenario: Static fallback references WebP

- GIVEN a crawler fetches `index.html` without JavaScript
- WHEN the raw HTML is inspected
- THEN the static `og:image` references `og-image-default.webp`
- AND `og:image:width` and `og:image:height` meta tags are present

#### Scenario: WebP file is missing

- GIVEN `og-image-default.webp` has not been generated yet
- WHEN a page renders
- THEN the OG image meta tag still points to the `.webp` path (no runtime fallback logic)
- NOTE: build/documentation must instruct to run the conversion script before deploy

---

## Phase P2-P3 — Investment (~5 h)

### Requirement: Bundle visualizer conditional plugin (Item 8)

The Vite build pipeline SHALL support an optional bundle analysis mode.

`vite.config.ts` MUST conditionally load `rollup-plugin-visualizer` only when the environment variable `ANALYZE` equals `"true"`. When enabled, the plugin MUST output `stats.html` in the project root (or `dist/`).

When `ANALYZE` is not set or set to any other value, the plugin MUST NOT be loaded and build performance MUST NOT be affected.

`package.json` MUST include `rollup-plugin-visualizer` as a devDependency.

#### Scenario: Build with ANALYZE=true

- GIVEN `ANALYZE=true` is set in the environment
- WHEN `npm run build` is executed
- THEN `rollup-plugin-visualizer` is loaded by Vite
- AND `stats.html` is generated in the output directory
- AND the build completes without errors

#### Scenario: Normal build without ANALYZE

- GIVEN `ANALYZE` is not set
- WHEN `npm run build` is executed
- THEN `rollup-plugin-visualizer` is NOT loaded
- AND no `stats.html` is generated
- AND build time is unchanged (no overhead)

#### Scenario: ANALYZE=false

- GIVEN `ANALYZE=false` is set
- WHEN `npm run build` is executed
- THEN the plugin is NOT loaded (same as unset)

---

### Requirement: Font subset weight range evaluation (Item 9)

The Inter font loading MUST be evaluated to reduce unnecessary weight variants.

An analysis SHALL be performed to determine which font weights are used across the site. Based on findings, the Google Fonts query string in `index.html` SHALL be adjusted to the minimal weight range that covers all used weights while preserving visual fidelity.

Acceptable configurations after evaluation: `400..700`, `400;600;700;900`, or keeping `400..900` if justified.

#### Scenario: All used weights are within reduced range

- GIVEN an audit confirms only weights 400, 600, 700, and 900 are used
- WHEN `index.html` font query is set to `wght@400;600;700;900`
- THEN all text renders with correct weight across the site
- AND the font download size is reduced from ~300KB to ~120KB (4 files vs 20)

#### Scenario: A weight outside the range is used

- GIVEN weight 500 is used somewhere in the site
- WHEN the font query excludes weight 500
- THEN that text renders at the closest available weight (browser fallback, may be 400 or 600)
- NOTE: this is a decision gate — either include 500 or accept browser approximation

---

### Requirement: AVIF image support (Item 10)

The image generation script SHALL be extended to produce `.avif` variants alongside `.webp` variants.

Blog `<img>` tags SHALL be wrapped in `<picture>` elements with `<source type="image/avif">` and `<source type="image/webp">` so browsers that support AVIF receive the most efficient format.

The original format MUST remain the `<img>` fallback `src`.

#### Scenario: AVIF-capable browser loads AVIF variant

- GIVEN a browser supports AVIF
- AND `post-image-600.avif` exists
- WHEN the blog card renders
- THEN the `<picture>` contains `<source type="image/avif" srcSet="...">` 
- AND the browser loads the `.avif` variant

#### Scenario: Browser without AVIF support falls back to WebP

- GIVEN a browser does not support AVIF but supports WebP
- WHEN the blog card renders
- THEN the `<picture>` contains `<source type="image/webp" srcSet="...">`
- AND the browser loads the `.webp` variant

#### Scenario: AVIF variant does not exist yet

- GIVEN `post-image-600.avif` has not been generated
- WHEN the blog card renders
- THEN the `<source type="image/avif">` is still emitted but the browser falls back to the next supported source
- AND no broken image is shown

---

### Requirement: Robots meta prop on SEO component (Item 11)

`SEO.tsx` MUST accept an optional `robots` prop of type `string`. When provided, a `<meta name="robots" content="{value}" />` tag MUST be emitted. When omitted, the default behavior is unchanged (no robots meta tag emitted, crawlers follow their own defaults).

Acceptable values follow the robots meta specification: `"index,follow"`, `"noindex,follow"`, `"noindex,nofollow"`, `"index,nofollow"`, and equivalent variations.

#### Scenario: Page with explicit robots directive

- GIVEN a page passes `robots="noindex,follow"` to `<SEO>`
- WHEN the page renders
- THEN `<meta name="robots" content="noindex,follow" />` is present in `<head>`

#### Scenario: Page without robots prop (default behavior)

- GIVEN a page does NOT pass a `robots` prop to `<SEO>`
- WHEN the page renders
- THEN no `<meta name="robots">` tag is emitted (backwards-compatible)

#### Scenario: Invalid robots value handling

- GIVEN a page passes `robots="invalid"` to `<SEO>`
- WHEN the page renders
- THEN the meta tag is still emitted with the provided value (no validation at the component level)

---

### Requirement: Sitemap image extensions (Item 12)

The sitemap generator script (`scripts/generate-sitemap.mjs`) SHALL include the XML image namespace and `<image:image>` entries for posts and projects that have a featured image.

The output sitemap XML MUST declare `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` on the root `<urlset>` element.

Each `<url>` entry for a blog post or project with an image MUST include one `<image:image>` child element with `<image:loc>` containing the absolute URL of the featured image.

#### Scenario: Sitemap includes image data for a blog post with image

- GIVEN a blog post has `image: "/blog/my-post/image.jpg"`
- WHEN the sitemap generator runs
- THEN the `<url>` for that post contains `<image:image><image:loc>https://thebellepoque.dev/blog/my-post/image.jpg</image:loc></image:image>`

#### Scenario: Sitemap entry for a post without image

- GIVEN a blog post has no `image` field
- WHEN the sitemap generator runs
- THEN the `<url>` for that post does NOT contain `<image:image>`

#### Scenario: Sitemap entry for a project with image

- GIVEN a project has `image: "/proyecto-x.png"`
- WHEN the sitemap generator runs
- THEN the `<url>` for that project contains `<image:image>` with the absolute image URL

---

### Requirement: Service worker evaluation (Item 13)

A feasibility evaluation SHALL be performed for `vite-plugin-pwa` to determine whether offline support justifies the added complexity for the current portfolio content size.

The evaluation MUST document: cache strategy options (precache static assets vs runtime caching), estimated cache size, impact on deploy/update flow, and whether the current content volume warrants a service worker.

No implementation is required at this phase. The evaluation output SHALL be a decision document (ACCEPT or REJECT with rationale).

#### Scenario: Evaluation recommends adoption

- GIVEN the evaluation concludes service worker adds value
- WHEN documented
- THEN a follow-up change is proposed with specific cache strategy and `workbox` config
- AND `vite-plugin-pwa` is added to devDependencies in that follow-up

#### Scenario: Evaluation recommends rejection

- GIVEN the evaluation concludes service worker does not justify complexity
- WHEN documented
- THEN the decision is recorded in the evaluation document
- AND no devDependencies are added

---

## Files Affected

| File | Phase | Change Summary |
|------|-------|---------------|
| `src/components/SEO.tsx` | P0, P1, P3 | Add `twitter:site`, `twitter:creator`, `og:locale`, `og:image:width/height/type`; optional `robots` prop |
| `src/lib/config.ts` | P0 | Add `locale: "es_ES"` field |
| `index.html` | P0, P1, P2 | Static `twitter:site` + `og:locale`; OG image to `.webp`; font query adjustment |
| `src/components/Blog/BlogPost.tsx` | P0, P1 | `loading`/`decoding`/`width`/`height` on `<img>`; remove inline JSON-LD script; pass JSON-LD via SEO `jsonLd` prop; `srcSet`+`sizes`; `<picture>` for AVIF |
| `src/components/Blog/BlogList.tsx` | P0, P1 | `loading`/`decoding`/`width`/`height` on `<img>`; `srcSet`+`sizes`; `<picture>` for AVIF |
| `src/pages/ProjectPage.tsx` | P1 | `jsonLd` prop with `CreativeWork` schema (or `SoftwareApplication`) |
| `src/pages/BlogPage.tsx` | P1 | `jsonLd` prop with `CollectionPage` schema |
| `scripts/generate-sitemap.mjs` | P3 | Image namespace and `<image:image>` entries |
| `vite.config.ts` | P2 | Conditional `rollup-plugin-visualizer` |
| `package.json` | P2, P3 | `rollup-plugin-visualizer` devDep; `vite-plugin-pwa` if evaluation passes |
| `public/` | P1, P3 | `og-image-default.webp`, `og-image-default-600.webp`, blog `*-600.webp` and `*.avif` variants |
| `scripts/generate-images.mjs` (new) | P1, P3 | Sharp-based one-shot script for WebP + AVIF variants |
