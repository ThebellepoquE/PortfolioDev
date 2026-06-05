# Tasks: UX Phase 3 — Loading & Polish

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~135 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Delivery strategy | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

---

## Phase 1: Foundation

- [ ] **1.1** Create `src/styles/components/_skeleton.scss`: `@keyframes skeleton-pulse` (opacity 0.4↔0.8) + `.skeleton` class with linear-gradient shimmer, `200%` bg-size, `1.5s ease-in-out` animation, `min-height: 1em`, `border-radius: 4px`. Use `$bg-card` + `rgb(255,255,255,0.03)`. Add `pointer-events: none` for `--skeleton` modifier. **REQ-UX3-01**
- [ ] **1.2** `@use "components/skeleton";` in `src/styles/main.scss` after line 15. **REQ-UX3-01**
- [ ] **1.3** Create `src/styles/utilities/_print.scss`: `@media print` hides `.navbar,.mobile-nav,.footer,.blog-post__back`; body white/black; `.blog-post__content` 12pt black; `a[href]::after` shows URL; `pre` border `#ccc` bg `#f9f9f9`; `code` black `font-weight:600`. Plain CSS colors. **REQ-UX3-03**
- [ ] **1.4** `@use "utilities/print";` in `src/styles/main.scss` after line 4. **REQ-UX3-03**

## Phase 2: Components

- [ ] **2.1** `BlogList.tsx`: before `posts.length===0`, check `posts===null` → render 3 `<div class="blog-card blog-card--skeleton" aria-hidden="true">` with `.skeleton` spans (60%,40%,100% widths). Keep `__empty` for `length===0`. **REQ-UX3-01**
- [ ] **2.2** `Projects.tsx`: add `sortedProjects===null` guard → render 3 `<div class="project-card project-card--skeleton" aria-hidden="true">`. Sync data means `null` won't fire yet—future-proofing. **REQ-UX3-01**
- [ ] **2.3** `Projects.scss:64`: add `transform 0.5s ease` to transition. `:74-76`: add `transform: translateY(-4px)` inside `:hover`. **REQ-UX3-02**
- [ ] **2.4** `BlogList.scss:76`: extend transition to `transform 0.3s, box-shadow 0.3s`. `:82-84`: add `transform: translateY(-3px)` + `box-shadow: 0 8px 30px rgba($green-rgb,0.15)` in `:hover`. **REQ-UX3-02**
- [ ] **2.5** Create `src/hooks/useActiveSection.ts`: `useActiveSection(sectionIds)` uses IntersectionObserver (`threshold:0.3`), tracks `intersectionRatio` per section in Map, picks highest (ties→entry order), preserves last when below threshold. Returns `null` on non-`/` pages, disconnects on cleanup. **REQ-UX3-04**
- [ ] **2.6** `Navbar.tsx`: call hook with `['inicio','proyectos','contacto']`; apply `is-active` to matching mobile-nav `<a>` anchor (strip `#`). Anchor items only—skip Blog/ThemeToggle. **REQ-UX3-04**
- [ ] **2.7** `_mobile.scss`: `.mobile-nav__item.is-active` → `position:relative` + `::after` (3px bar, `top:-2px`, 60% width, centered, `transition: background-color 0.3s`). `--pink`→`$pink`, `--yellow`→`$yellow`, `--green`→`$green`. **REQ-UX3-04**

## Verification

- [ ] `npm run build` — no errors
- [ ] Skeleton shimmer animates; reduced-motion clamp works; real cards unaffected
- [ ] Hover: project cards lift 4px, blog cards lift 3px+shadow; skeletons inert
- [ ] Print: blog post hides chrome, black-on-white, URLs shown
- [ ] Mobile nav bar tracks scroll on home; hidden on /blog; returns on back-nav
- [ ] No regression on existing states or components

## Rollback Plan

Revert 2 `main.scss` imports; delete 3 new files; revert 3 TSX + 3 SCSS hunks. All additive—no data/route impact.
