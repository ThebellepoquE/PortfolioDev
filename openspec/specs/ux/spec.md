# Specs: UX Phase 3 — Loading & Polish

## Requirements Overview

| ID | Description | Priority |
|----|-------------|----------|
| REQ-UX3-01 | Skeleton loading states | High |
| REQ-UX3-02 | Enhanced hover micro-interactions | Medium |
| REQ-UX3-03 | Print styles for blog posts | Medium |
| REQ-UX3-04 | Mobile nav active section indicator | High |

---

## REQ-UX3-01: Skeleton loading states

CSS-only shimmer skeleton placeholders rendered in BlogList and Projects when data is unavailable — wiring the UI for future async data fetching without depending on it.

### Scenarios

**Skeleton cards shimmer while data loads**
Given the user lands on the blog list page
And `getAllPosts()` returns `null` (async data not yet resolved)
When the page renders
Then `<div class="blog-card blog-card--skeleton">` placeholders are rendered
And each placeholder contains `<span class="skeleton">` elements with varying widths
And the `.skeleton` spans pulse with a shimmer animation via `skeleton-pulse` keyframes
And the placeholder cards use the same `.blog-card` wrapper class as real cards

**Real cards render immediately when data is cached**
Given the user lands on the blog list page
And `getAllPosts()` returns a non-null array (cached or synchronous)
When the page renders
Then real `<Link class="blog-card">` cards are rendered
And no `.blog-card--skeleton` elements appear
And no shimmer animation plays

**Project skeleton placeholders mirror card structure**
Given the user lands on the home page
And `projectsData` is `null` (future async)
When the `<Projects>` component renders
Then `<div class="project-card project-card--skeleton">` placeholders are rendered
And each contains `.skeleton` spans approximating title bar, description bar, and tag bar layout
And the placeholders have zero layout shift vs real project cards

**Skeleton respects reduced motion**
Given the user has `prefers-reduced-motion: reduce` enabled
When skeleton placeholders render
Then the shimmer animation is clamped to `0.01ms` duration by the existing global `@media (prefers-reduced-motion: reduce)` rule

### Acceptance Criteria

- [ ] New file `src/styles/components/_skeleton.scss` defines `@keyframes skeleton-pulse` and a `.skeleton` class with `linear-gradient` shimmer and `1.5s ease-in-out infinite` animation
- [ ] `_skeleton.scss` is imported in `src/styles/main.scss`
- [ ] `BlogList.tsx` renders skeleton placeholder cards when `posts === null` (distinct from `posts.length === 0` empty state)
- [ ] `Projects.tsx` renders skeleton placeholder cards when `sortedProjects === null`
- [ ] Skeleton placeholder cards use the same wrapper classes (`.blog-card`, `.project-card`) as real cards, plus a `--skeleton` BEM modifier
- [ ] `.skeleton` spans use `min-height: 1em` and `border-radius: 4px` with `background-size: 200% 100%`
- [ ] The `.skeleton` class uses CSS custom properties compatible with the existing `$bg-card` token and an alpha white overlay for the shimmer band
- [ ] No JavaScript animation or requestAnimationFrame — purely CSS-driven shimmer
- [ ] The existing `__empty` state in BlogList is preserved for `posts.length === 0` (no posts scenario), which is semantically different from `null` (loading scenario)
- [ ] Projects section continues rendering real cards when `projectsData` is non-null, with no visual regression

### Technical Notes

- The shimmer is a CSS `background: linear-gradient(90deg, $bg-card 25%, rgba(255,255,255,0.03) 50%, $bg-card 75%)` with `background-size: 200% 100%` animated by `@keyframes skeleton-pulse` toggling opacity between 0.4 and 0.8
- Render 3 skeleton cards in BlogList and 3 in Projects — enough to fill the viewport and signal loading without excessive DOM nodes
- The `--skeleton` modifier suppresses real card interactions (no hover effects, no pointer cursor, inert layout) via `pointer-events: none` and a dedicated SCSS rule
- Data contract: `null` means loading/unresolved; an empty array means resolved-with-no-items. The components must distinguish these two states

---

## REQ-UX3-02: Enhanced hover micro-interactions

Add depth-based hover effects (`translateY` + `box-shadow`) to project cards and blog cards, overlaying on the existing hover rules.

### Scenarios

**User hovers over a project card**
Given the user moves the cursor over a `.project-card`
When the hover state activates
Then the card lifts `4px` upward via `transform: translateY(-4px)`
And the existing `box-shadow: 0 0 30px rgba($green-rgb, 0.5)` activates
And the `transform` animates with a `transition` matching the existing `box-shadow 0.5s ease` duration

**User hovers over a blog card**
Given the user moves the cursor over a `.blog-card`
When the hover state activates
Then the card lifts `3px` upward via `transform: translateY(-3px)`
And a subtle `box-shadow` (e.g., `0 8px 30px rgba($green-rgb, 0.15)`) appears
And the existing `border-color` change to `rgba($green-rgb, 0.5)` still applies
And the `transform` and `box-shadow` animate with `transition: transform 0.3s ease, box-shadow 0.3s ease`

**User with reduced motion hovers**
Given the user has `prefers-reduced-motion: reduce` enabled
When they hover over any card
Then no animation occurs — the state changes instantly
And the existing global `@media (prefers-reduced-motion: reduce)` rule clamps all transition durations to `0.01ms`

### Acceptance Criteria

- [ ] `.project-card:hover` includes `transform: translateY(-4px)` in `src/styles/components/Projects.scss`
- [ ] The existing `transition` property on `.project-card` (line 64) is updated to include `transform 0.5s ease`
- [ ] `.blog-card:hover` includes `transform: translateY(-3px)` and `box-shadow` in `src/styles/components/BlogList.scss`
- [ ] `.blog-card` transition property is updated to include `transform` and `box-shadow` (currently only `background-color`, `color`, `border-color`)
- [ ] No new `@media (prefers-reduced-motion)` block is added — the global rule in `_global.scss` handles it automatically
- [ ] Card shadow colors reference existing brand tokens (`$green-rgb`) for visual consistency with the neon theme
- [ ] Hover effects on cards with `--skeleton` modifier are suppressed (skeleton cards are inert)

### Technical Notes

- Project card hover already has `box-shadow: 0 0 30px rgba($green-rgb, 0.5)` (Projects.scss:74-76). The change adds `transform` to that rule block and extends the transition list.
- Blog card hover currently only changes `border-color` (BlogList.scss:82-84). The change adds `transform` + `box-shadow` to that block.
- Shadow values are intentionally subtle on blog cards (0.15 alpha) vs project cards (0.5 alpha) — blog = lightweight content consumption, project = showcase impact.

---

## REQ-UX3-03: Print styles for blog posts

A centralized `@media print` partial that hides UI chrome and reformats blog content for paper readability.

### Scenarios

**User prints a blog post**
Given the user opens a blog post page and triggers print (Ctrl+P or browser menu)
When the print media applies
Then `.navbar`, `.mobile-nav`, and `.footer` are hidden (`display: none !important`)
And `.blog-post__back` (the "← Volver al blog" link) is hidden
And the page renders with white background and black text
And blog content uses `font-size: 12pt` and `text-align: left` for readability
And code blocks (`pre`) have a thin `1px solid #ccc` border instead of dark background
And inline `code` elements are black with `font-weight: 600` (no neon green)
And all `a[href]` elements show their URL in parentheses via `::after { content: " (" attr(href) ")"; }`

**User prints a non-blog page**
Given the user prints any other page (home, projects, contact)
When the print media applies
Then `.navbar`, `.mobile-nav`, and `.footer` are hidden
And the page uses white background with black text
And no blog-specific content rules apply (because `.blog-post__content` is not present)

**Print styles do not affect screen rendering**
Given the user views any page on screen
When `@media print` rules are present in the stylesheet
Then screen rendering is completely unaffected
And all theme colors, neon effects, and shadows render as before

### Acceptance Criteria

- [ ] New file `src/styles/utilities/_print.scss` contains all `@media print` rules
- [ ] `_print.scss` is imported in `src/styles/main.scss`
- [ ] `@media print` hides `.navbar`, `.mobile-nav`, `.footer`, `.blog-post__back` with `display: none !important`
- [ ] `@media print` sets `body { background: white; color: black; }`
- [ ] `.blog-post__content` inside `@media print` resets to black text, `font-size: 12pt`, `line-height: 1.5`, `text-align: left`
- [ ] Links show URLs: `a[href]::after { content: " (" attr(href) ")"; font-size: 0.8em; color: #555; }`
- [ ] Code blocks: `pre { border: 1px solid #ccc; background: #f9f9f9; color: black; }`
- [ ] Inline code: `code { color: black; font-weight: 600; }` — no neon green in print
- [ ] No print rules interfere with the `.scroll-to-top-button` if it already has its own print hiding rule; the centralized `_print.scss` takes precedence
- [ ] Print rules use standard CSS colors (`white`, `black`, `#ccc`, `#f9f9f9`, `#555`), not SCSS tokens — printing has no theme concept

### Technical Notes

- The `!important` flag on `display: none` ensures print hiding wins over any component-level display values (flex, grid, block) from the cascade.
- `font-size: 12pt` is a print-specific unit that maps well to standard paper reading sizes.
- The `attr(href)` trick is pure CSS — no JavaScript needed. Links without `href` (like anchor-only links) are not affected since the selector uses `a[href]`.
- Blog content that uses `<strong>` with neon green styling will naturally flip to black in print because `color: black` is set on the parent `.blog-post__content` and inherits down.

---

## REQ-UX3-04: Mobile nav active section indicator

An IntersectionObserver-based hook that tracks which section is currently visible on the home page and applies an `is-active` class with a colored top bar to the corresponding mobile nav item.

### Scenarios

**User scrolls to Projects section**
Given the user is on the home page (`pathname === '/'`)
And the `#proyectos` section has the highest intersection ratio (above 0.3 threshold) with the viewport
When the observer fires
Then the `useActiveSection` hook returns `"proyectos"`
And the mobile nav item `<a href="#proyectos" class="mobile-nav__item mobile-nav__item--yellow is-active">` receives the `is-active` class
And a `3px` yellow `::after` bar appears at the top of that nav item

**User scrolls to Contact section**
Given the user is on the home page
And the `#contacto` section has the highest intersection ratio
When the observer fires
Then `useActiveSection` returns `"contacto"`
And `.mobile-nav__item--pink` (the Contact item) receives `is-active`
And a `3px` pink `::after` bar appears at the top

**User navigates to the blog page (not home)**
Given the user navigates to `/blog`
When `useActiveSection` evaluates `location.pathname !== '/'`
Then the hook returns `null`
And no mobile nav item receives the `is-active` class from section observation
And the existing path-based `is-active` on the Blog link (from `location.pathname.startsWith('/blog')`) still applies normally

**Two sections have equal intersection ratio**
Given the user scrolls such that `#proyectos` and `#contacto` have equal `intersectionRatio`
When the observer callback fires
Then the hook returns the section ID that entered the viewport first (stable tie-break)
And no flickering occurs between the two indicators

**Section intersection falls below threshold**
Given the user scrolls past all sections toward the footer
And no section meets the `0.3` threshold
When the observer fires
Then `useActiveSection` returns the last section that was above threshold (sticky behavior)
And the `is-active` indicator remains on that section's nav item until a new section crosses the threshold

### Acceptance Criteria

- [ ] New file `src/hooks/useActiveSection.ts` exports `useActiveSection(sectionIds: string[]): string | null`
- [ ] Hook uses `IntersectionObserver` with `threshold: 0.3` on each section element queried by ID
- [ ] Hook only observes when `location.pathname === '/'` — returns `null` immediately on non-home pages
- [ ] Observer is disconnected and re-created when `sectionIds` or `pathname` change (via `useEffect` cleanup)
- [ ] Active section is the one with the highest `intersectionRatio`; ties resolve to the one that entered first
- [ ] When no section meets the threshold, the last active section is preserved (no `null` flip on overscroll)
- [ ] `Navbar.tsx` calls `useActiveSection(['inicio', 'proyectos', 'contacto'])` and applies `is-active` class to the matching `mobile-nav__item`
- [ ] `is-active` is only applied to anchor-link items (`#inicio`, `#proyectos`, `#contacto`), not to the Blog link or ThemeToggle
- [ ] `src/styles/components/navbar/_mobile.scss` defines `::after` pseudo-element on `.mobile-nav__item.is-active` with `position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 60%; height: 3px; border-radius: 0 0 2px 2px`
- [ ] The `::after` bar color is set by the color modifier: `--pink` → `$pink`, `--yellow` → `$yellow`, `--green` → `$green`
- [ ] The `::after` bar does not overflow the item's tap target or violate WCAG 2.5.5 target size (min 44px)
- [ ] The indicator uses `transition: background-color 0.3s` to smoothly crossfade between colors when switching sections
- [ ] No scroll event listener — observables only via IntersectionObserver (no main-thread jank)

### Technical Notes

- The hook parallels the existing `useInView` pattern (IntersectionObserver inside `useEffect` with cleanup), extended for multi-element observation.
- Section IDs to observe: `#inicio`, `#proyectos`, `#contacto` — these map to the `id` attributes on the Hero, Projects, and Contact section elements.
- The `--pink` modifier on the Contact mobile nav item is intentional (not a mismatch) — Contact uses pink in the mobile nav to balance the four-item color distribution: Inicio (pink), Proyectos (yellow), Blog (green), Contacto (pink).
- On non-home pages, the mobile nav only shows Home + Blog + ThemeToggle, so `is-active` from the hook would only affect the Home link — but the hook returns `null` anyway, so no false indicators appear.
- The `::after` bar sits at `top: -2px` (above the item's padding box), which pushes it into the gap between the nav container top border and the item itself — visually framing the container edge.

---

## Non-Functional Requirements

| NFR | Constraint |
|-----|------------|
| **Performance** | No new dependencies. Skeleton shimmer is CSS-only (GPU-composited `opacity`). IntersectionObserver fires at native browser frame timing, no `scroll` event listeners. |
| **Accessibility** | Skeleton cards receive `aria-hidden="true"`. Active section indicator is purely decorative (`::after` pseudo-element, no DOM text). Print styles use semantic `@media print` — screen readers are unaffected. Hover effects respect `prefers-reduced-motion` via inherited global clamp. |
| **Bundle size** | `_skeleton.scss`: ~20 lines. `_print.scss`: ~35 lines. `useActiveSection.ts`: ~25 lines. Total CSS addition < 1 KB gzipped. Hook < 0.5 KB gzipped. |
| **Theme compatibility** | Skeleton uses `$bg-card` token (adapts to light/dark). Print overrides both themes to black-on-white. Hover shadows reference `$green-rgb` (unchanged between themes). Active section bar uses brand color tokens (unchanged between themes). |
| **Browser support** | IntersectionObserver is supported in all modern browsers (Chrome 51+, Firefox 55+, Safari 12.1+, Edge 79+). CSS `@media print` is universally supported. `attr()` in `content` is supported in all browsers. |

---

## Edge Cases

| Edge Case | How It's Handled |
|-----------|-----------------|
| **BlogList has 0 posts after async resolves** | The existing `__empty` message renders ("Aún no hay posts publicados"), not skeleton cards. `null` ≠ `[]`. |
| **Projects data resolves with 0 items** | Skeleton cards disappear. No empty state message exists yet (Projects always has data), so no content renders — acceptable for now; add message in a future iteration if needed. |
| **User rapidly navigates between home and blog** | `useActiveSection` disconnects observer on pathname change (cleanup in `useEffect` return). New observer is created only if `pathname === '/'` on re-render. |
| **User loads page mid-scroll (deep-linked to #proyectos)** | IntersectionObserver fires on initial layout. The section with the highest ratio is active immediately — no "all inactive" flash. |
| **Print triggered on home page (not blog)** | Only chrome elements are hidden. Content renders with white background and black text. Blog-specific selectors (`.blog-post__content`, `.blog-post__back`) have no matching elements so their rules are inert. |
| **Skeleton cards visible during server-side render** | Not applicable — this is a Vite SPA with client-side rendering only. If SSR is added later, skeletons would flash on hydration; this spec does not cover SSR. |
| **Very short sections (e.g., Contact is just a few lines)** | `threshold: 0.3` on a short section means it only activates when 30% of its height is visible. If the section is shorter than `0.3 * viewportHeight`, it may never activate — this is acceptable; the prior longer section retains the indicator. |
| **Mobile nav safe area overlap (iPhone notch)** | The `::after` bar at `top: -2px` is inside the nav container which already has `padding-bottom: env(safe-area-inset-bottom)`. The bar does not extend upward into unsafe territory. |
