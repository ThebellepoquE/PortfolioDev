# Proposal: UX Phase 1 — Foundation

## Summary

Add fundamental UX improvements to PortfolioDev: smooth scrolling, reduced-motion support, a scroll-to-top button, standardized focus rings, and a selective theme transition that replaces the current global `*` transition for better performance.

Zero new dependencies. CSS-only where possible, one new React component.

## Scope

### 1. Smooth scroll behavior
**File:** `src/styles/base/_global.scss`
Add `scroll-behavior: smooth` to `html`. One line.

### 2. Reduced motion support
**File:** `src/styles/base/_global.scss`
Add `@media (prefers-reduced-motion: reduce)` that disables animations, transitions, and smooth scrolling globally. Respects OS-level accessibility preference.

### 3. Scroll-to-top button
**Files:** `src/components/ScrollToTopButton.tsx`, `src/styles/components/ScrollToTopButton.scss`
A visible floating button that appears after scrolling down ~300px. Smooth scrolls to top on click. Includes `aria-label`, focus management, and `hidden` on print. Exported as named export.

> **Note:** `App.tsx` already has an invisible `<ScrollToTop />` that auto-scrolls on route change. This new component is a user-facing button. They serve different purposes and coexist.

### 4. Focus ring utility
**File:** `src/styles/utilities/_common.scss`
Add a `.focus-ring` utility class with consistent `:focus-visible` outline using brand yellow. Replace scattered per-component `:focus-visible` rules where possible.

### 5. Selective theme transition
**Files:** `src/styles/base/_global.scss`, `src/styles/components/*.scss`
Replace the global `* { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease }` with targeted transitions on specific elements (section containers, cards, links, buttons). Reduces DOM paint overhead on every mutation while preserving smooth theme switching.

## Approach

- **Zero dependencies** — no Framer Motion, no animation libraries
- **CSS-only animations** — `@keyframes`, `transition`, `scroll-behavior`
- **One new component** — `ScrollToTopButton` (~40 lines TSX + ~30 lines SCSS)
- **Selective transition audit** — remove the `*` transition, add targeted `transition` to ~5-8 component SCSS files
- **Incremental** — each item is independently testable and mergeable

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Removing `*` transition breaks theme toggle smoothness | **High** | Audit every component that depends on it; add targeted transitions before removing |
| `prefers-reduced-motion` too aggressive | Low | Uses standard 0.01ms pattern; well-tested across browsers |
| Scroll-to-top button conflicts with existing `<ScrollToTop />` | Low | Different component name (`ScrollToTopButton`); different behavior (visible button vs invisible route-change handler) |
| Focus ring migration misses a component | Medium | Grep for all `:focus-visible` occurrences; replace systematically |

## Estimated Effort

~150-200 lines changed across ~8 files. Fits within 400-line review budget.

## Files Affected

| File | Action | Est. Lines |
|------|--------|------------|
| `src/styles/base/_global.scss` | Modify — add smooth scroll, reduced motion, remove `*` transition | +10 -3 |
| `src/styles/utilities/_common.scss` | Modify — add `.focus-ring`, `.skeleton`, `.scroll-to-top` utilities | +15 |
| `src/components/ScrollToTopButton.tsx` | **New** — scroll-to-top button component | +40 |
| `src/styles/components/ScrollToTopButton.scss` | **New** — button styles | +30 |
| `src/App.tsx` | Modify — mount `ScrollToTopButton` | +3 |
| `src/styles/components/Navbar.scss` | Modify — add targeted transition | +2 |
| `src/styles/components/Footer.scss` | Modify — add targeted transition | +2 |
| `src/styles/components/Hero.scss` | Modify — add targeted transition | +2 |
| `src/styles/components/Projects.scss` | Modify — add targeted transition | +2 |
| `src/styles/components/Contact.scss` | Modify — add targeted transition | +2 |
| `src/styles/components/BlogList.scss` | Modify — add targeted transition | +2 |
| `src/styles/components/ProjectCard.scss` | Modify — add targeted transition | +2 |
| `src/styles/components/ThemeToggle.scss` | Modify — verify existing transitions | +1 |
