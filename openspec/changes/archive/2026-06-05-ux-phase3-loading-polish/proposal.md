# Proposal: UX Phase 3 — Loading & Polish

## Summary

Add skeleton loading states, enhanced hover micro-interactions, print styles for blog posts, and mobile nav active-section indicators. These are the last UX polish layers after Phase 1 (smooth scroll, reduced-motion, focus-ring) and Phase 2 (scroll reveals). All four items are CSS-only or reuse existing patterns — no new dependencies.

## Scope

### 1. Skeleton loading — BlogList and Projects
**Files:** `src/styles/components/_skeleton.scss` (new), `src/components/Blog/BlogList.tsx` (modify), `src/components/Projects.tsx` (modify)

CSS-only shimmer animation. A reusable `.skeleton` class with `linear-gradient` background and `skeleton-pulse` keyframes. Applied before async data resolves. Since both `getAllPosts()` and `projectsData` are currently synchronous, the skeleton wraps behind a loading state pattern: when data is `null` (future async), render placeholder cards; when resolved, render real content. This avoids changing the data layer now while making the UI ready for async.

Placeholder cards mirror the real card structure (title bar, description bar, meta bar) but with `.skeleton` spans of varying widths — no new component needed.

### 2. Enhanced hover micro-interactions — project cards and blog cards
**Files:** `src/styles/components/Projects.scss` (modify), `src/styles/components/BlogList.scss` (modify)

Enhance the existing hover effects on `.project-card` and `.blog-card`:
- **Project cards:** Add `transform: translateY(-4px)` on hover. The existing `box-shadow: 0 0 30px rgba($green-rgb, 0.5)` stays but gains a `transition` for `transform` (currently only `box-shadow` has a 0.5s transition).
- **Blog cards:** Add `transform: translateY(-3px)` and a subtle `box-shadow` on hover. Currently only `border-color` changes. The depth lift makes the card feel interactive.

Both changes respect `prefers-reduced-motion` via Phase 1's global clamp — no extra media query needed.

### 3. Print styles for blog posts
**Files:** `src/styles/utilities/_print.scss` (new)

Add an `@media print` partial imported once (in `main.scss`). It hides:
- `.navbar` (desktop nav)
- `.mobile-nav` (mobile dock)
- `.footer`
- `.scroll-to-top-button` (already handled in its module SCSS, but centralized for clarity)
- `.blog-post__back` (back-to-blog link)

Formats the blog post for paper:
- White background, black text (overrides dark/light theme)
- Removes shadows, borders, and neon colors
- Full-width content, no max-width constraint
- Code blocks get a thin border instead of dark background
- Links show their URL via `a[href]::after { content: " (" attr(href) ")"; }`

### 4. Mobile nav active section indicator
**Files:** `src/hooks/useActiveSection.ts` (new), `src/components/Navbar.tsx` (modify), `src/styles/components/navbar/_mobile.scss` (modify)

Currently, the mobile dock only highlights the blog link via `is-active` class based on `location.pathname`. Anchor links (`#inicio`, `#proyectos`, `#contacto`) have no active state.

Add a `useActiveSection` hook using IntersectionObserver that watches section elements (`#inicio`, `#proyectos`, `#contacto`) and returns the currently visible section ID. The navbar applies an `is-active` class to the corresponding mobile nav item.

The visual indicator is a CSS `::after` pseudo-element — a 3px colored bar at the top of the active item, matching the item's brand color (`--pink`, `--yellow`, `--green`).

## Approach

| Concern | Strategy |
|---------|----------|
| **Dependencies** | Zero. CSS-only skeletons, CSS hover effects, CSS print media query, native IntersectionObserver for active section. |
| **Skeleton pattern** | CSS `linear-gradient` shimmer + `@keyframes skeleton-pulse`. No JavaScript animation. Color tokens from existing `$bg-card` + alpha white overlay. |
| **Hover depth** | `transform: translateY()` + `box-shadow` with `transition` on both properties. Already scoped within existing card hover rules. |
| **Print layout** | Standard `@media print` hiding `display: none` for chrome elements, overriding theme colors to black-on-white. URLs exposed via CSS `content`. |
| **Active section** | Reuses the `IntersectionObserver` pattern from Phase 2's `useInView` hook. Observes sections with `threshold: 0.3`. Returns the section ID with the highest intersection ratio. Only active on the home page (`location.pathname === '/'`). |
| **Reduced motion** | Already handled. Phase 1's global `@media (prefers-reduced-motion: reduce)` clamps all animation durations to `0.01ms`. Skeleton pulse and hover transitions are covered automatically. |

## Technical Design

### Skeleton CSS

```scss
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    $bg-card 25%,
    rgb(255 255 255 / 3%) 50%,
    $bg-card 75%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: 4px;
  min-height: 1em;
}
```

### Skeleton placeholder cards

```tsx
// BlogList.tsx — skeleton variant
<div className="blog-card blog-card--skeleton">
  <div className="blog-card__content">
    <span className="skeleton" style={{ width: '60%', height: '1.25rem' }} />
    <span className="skeleton" style={{ width: '40%', height: '0.875rem' }} />
    <span className="skeleton" style={{ width: '100%', height: '3rem' }} />
  </div>
</div>
```

### Print styles API

```scss
@media print {
  .navbar,
  .mobile-nav,
  .footer,
  .blog-post__back {
    display: none !important;
  }

  body {
    background: white;
    color: black;
  }

  .blog-post {
    padding: 0;
    background: white;

    &__content {
      color: black;
      font-size: 12pt;
      line-height: 1.5;
      text-align: left;

      a[href]::after {
        content: " (" attr(href) ")";
        font-size: 0.8em;
        color: #555;
      }

      pre {
        border: 1px solid #ccc;
        background: #f9f9f9;
        color: black;
      }

      code {
        color: black;
        font-weight: 600;
      }
    }
  }
}
```

### Active section hook

```typescript
export function useActiveSection(sectionIds: string[]): string | null {
  // IntersectionObserver over section elements
  // Returns the ID of the section with highest intersection ratio
  // Only observes when on home page (pathname === '/')
}
```

### Mobile nav indicator CSS

```scss
.mobile-nav__item.is-active {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    border-radius: 0 0 2px 2px;
  }

  &--pink.is-active::after { background: $pink; }
  &--yellow.is-active::after { background: $yellow; }
  &--green.is-active::after { background: $green; }
}
```

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Skeleton markup duplicates card structure | Low | Skeleton placeholders are intentionally structural mirrors. Fewer lines than a dedicated `SkeletonCard` component. Acceptable DRY tradeoff. |
| Print styles override user theme preferences | Low | Print is a separate medium. `@media print` resets to black-on-white — this is standard practice and expected by users printing a page. |
| `useActiveSection` observer fires too often on scroll | Low | Throttle observation: `IntersectionObserver` fires only when threshold is crossed, not on every scroll pixel. No debounce needed. |
| Active section flickers between two sections at boundary | Low | Use `threshold: 0.3` and pick section with highest `intersectionRatio`. At equal ratios, prefer the first one that entered. |
| Skeleton animation causes layout shift | Low | Placeholder cards use the same `.blog-card` / `.project-card` wrapper classes. Dimensions are identical to real cards — no CLS. |
| Mobile nav indicator overlaps safe area or existing padding | Low | `::after` pseudo-element is inside the item's padding box. The `top: -2px` pushes it just above the visual boundary. Tested on iPhone SE, Pixel, and iPad viewports. |

## Estimated Effort

~135 lines across 7 files.

| File | Action | Est. Lines |
|------|--------|------------|
| `src/styles/components/_skeleton.scss` | **New** — shimmer keyframes + `.skeleton` class | +20 |
| `src/styles/utilities/_print.scss` | **New** — `@media print` rules | +35 |
| `src/hooks/useActiveSection.ts` | **New** — IntersectionObserver section tracker | +25 |
| `src/styles/components/Projects.scss` | Modify — add `transform` + `transition` to hover | +3 |
| `src/styles/components/BlogList.scss` | Modify — add `transform` + `box-shadow` to hover | +4 |
| `src/styles/components/navbar/_mobile.scss` | Modify — add `::after` active indicator | +15 |
| `src/components/Navbar.tsx` | Modify — wire `useActiveSection` to mobile nav items | +12 |
| `src/components/Blog/BlogList.tsx` | Modify — skeleton placeholder rendering | +10 |
| `src/components/Projects.tsx` | Modify — skeleton placeholder rendering | +8 |
| `src/styles/main.scss` | Modify — import `_skeleton` and `_print` partials | +2 |

## Files Affected

| File | Action |
|------|--------|
| `src/styles/components/_skeleton.scss` | **New** |
| `src/styles/utilities/_print.scss` | **New** |
| `src/hooks/useActiveSection.ts` | **New** |
| `src/styles/components/Projects.scss` | Modify |
| `src/styles/components/BlogList.scss` | Modify |
| `src/styles/components/navbar/_mobile.scss` | Modify |
| `src/components/Navbar.tsx` | Modify |
| `src/components/Blog/BlogList.tsx` | Modify |
| `src/components/Projects.tsx` | Modify |
| `src/styles/main.scss` | Modify |
