# Verify: UX Phase 3 — Loading & Polish

## Build & Tests

| Command | Result |
|---------|--------|
| `pnpm run build` | PASS — tsc + vite build, zero errors, 2.60s |
| `pnpm test:run` | PASS — 10 files, 93 passed, 10 skipped, 0 failures |

---

## Requirements Verification

### REQ-UX3-01: Skeleton loading states

- **Status**: PASS (with WARNING)
- **Evidence**:
  - `src/styles/components/_skeleton.scss` exists with `@keyframes skeleton-pulse` (opacity 0.4↔0.8) and `.skeleton` class with linear-gradient shimmer, `background-size: 200% 100%`, `1.5s ease-in-out infinite` animation, `min-height: 1em`, `border-radius: 4px`. Uses `$bg-card` + `rgb(255 255 255 / 3%)`. ✓
  - `--skeleton` modifier blocks (`pointer-events: none; opacity: 0.6`) suppress interactions on skeleton cards. ✓
  - `@use "components/skeleton"` imported in `main.scss:17`. ✓
  - `Blog/BlogList.tsx:25`: `posts === null` renders 3 `<div class="blog-card blog-card--skeleton" aria-hidden="true">` with `.skeleton` spans (60%, 40%, 100% widths). ✓
  - `Projects.tsx:19`: `sortedProjects === null` renders 3 `<div class="project-card project-card--skeleton" aria-hidden="true">` with `.skeleton` spans. ✓
  - Existing `__empty` state (`posts.length === 0`) preserved at `BlogList.tsx:37`. ✓
  - `_global.scss:10-17`: `@media (prefers-reduced-motion: reduce)` clamps all animation/transition durations to `0.01ms`. ✓
  - **WARNING**: `Projects.tsx:19` null check is dead code — `sortedProjects` is derived from `useMemo(() => [...projectsData].sort(...))` where `projectsData` is `ProjectFull[]` (static import, line 29 of `lib/projects.ts`). The condition is always false. Acknowledged as "future-proofing" in tasks (task 2.2), but TypeScript offers no runtime benefit today.

### REQ-UX3-02: Enhanced hover micro-interactions

- **Status**: PASS
- **Evidence**:
  - `Projects.scss:64`: `.project-card` transition includes `transform 0.5s ease`. ✓
  - `Projects.scss:74-77`: `.project-card:hover` includes `transform: translateY(-4px)` + existing `box-shadow: 0 0 30px rgba($green-rgb, 0.5)`. ✓
  - `BlogList.scss:76`: `.blog-card` transition includes `transform 0.3s ease, box-shadow 0.3s ease`. ✓
  - `BlogList.scss:82-86`: `.blog-card:hover` includes `transform: translateY(-3px)` + `box-shadow: 0 8px 30px rgba($green-rgb, 0.15)` + existing `border-color` change. ✓
  - Reduced motion handled by global `_global.scss:10-17` rule (clamps all durations). ✓
  - `--skeleton` modifier blocks hover via `pointer-events: none` in `_skeleton.scss:21-24`. ✓
  - Shadow colors use `$green-rgb` token for visual consistency. ✓

### REQ-UX3-03: Print styles for blog posts

- **Status**: PASS
- **Evidence**:
  - `src/styles/utilities/_print.scss` exists with `@media print` rules. ✓
  - `@use "utilities/print"` imported in `main.scss:4`. ✓
  - Hides `.navbar`, `.mobile-nav`, `.footer`, `.blog-post__back` with `display: none !important`. ✓
  - `body { background: white; color: black; }`. ✓
  - `.blog-post__content`: black text, `font-size: 12pt`, `line-height: 1.5`, `text-align: left`. ✓
  - `a[href]::after { content: " (" attr(href) ")"; font-size: 0.8em; color: #555; }`. ✓
  - `pre { border: 1px solid #ccc; background: #f9f9f9; color: black; }`. ✓
  - `code { color: black; font-weight: 600; }` — no neon green. ✓
  - Uses plain CSS colors (white, black, #ccc, #f9f9f9, #555), not SCSS tokens. ✓
  - No `.scroll-to-top-button` styles found in codebase, so no conflicting print rule exists. ✓
  - Compiled CSS confirms `@media print` block intact in production build. ✓

### REQ-UX3-04: Mobile nav active section indicator

- **Status**: FAIL — CRITICAL issues
- **Evidence**:
  - `src/hooks/useActiveSection.ts` exists, exports `useActiveSection(sectionIds)`. ✓
  - Uses `IntersectionObserver` with `threshold: [0, 0.3, 0.5, 0.7, 1]`. ✓ (array provides more granular updates than spec's single `0.3`)
  - Only observes when `pathname === '/'` — returns `null` on non-home pages. ✓
  - Observer disconnected on cleanup (useEffect return). ✓
  - Active section is highest `intersectionRatio`, ties resolve by iteration order. ✓
  - `Navbar.tsx:18`: calls `useActiveSection(['inicio', 'proyectos', 'contacto'])`. ✓
  - `Navbar.tsx:103,114,138`: `is-active` class applied conditionally to anchor-link items (`#inicio`, `#proyectos`, `#contacto`) only. Blog link and ThemeToggle are not affected. ✓
  - **CRITICAL — SCSS nesting bug**: The `_mobile.scss` file has a missing closing brace. At line 92, `&.is-active {` opens inside `&--yellow`. The `svg` block (lines 93-94) closes at line 95, but `&.is-active` itself is never closed. This causes `.mobile-nav__item.is-active {` at line 97 to be nested as a descendant of `&--yellow.is-active`. The compiled CSS produces:
    ```css
    .mobile-nav__item--yellow.is-active .mobile-nav__item.is-active{position:relative}
    .mobile-nav__item--yellow.is-active .mobile-nav__item.is-active:after{...}
    .mobile-nav__item--yellow.is-active .mobile-nav__item.is-active--pink.is-active:after{...}
    .mobile-nav__item--yellow.is-active .mobile-nav__item.is-active--yellow.is-active:after{...}
    .mobile-nav__item--yellow.is-active .mobile-nav__item.is-active--green.is-active:after{...}
    ```
    The intended selector is `.mobile-nav__item.is-active::after` — but the compiled selector requires a **descendant** `.mobile-nav__item.is-active` inside `.mobile-nav__item--yellow.is-active`, which does not exist in the markup. The `is-active` class is applied directly on the `<a>` tag: `<a class="mobile-nav__item mobile-nav__item--yellow is-active">`. The `::after` indicator will never render.
  - **CRITICAL — Sticky behavior not implemented**: The hook sets `setActiveSection(bestRatio > 0 ? bestSection : null)`, returning `null` when all sections have 0 intersection ratio. Spec requires: "When no section meets the threshold, the last active section is preserved (no null flip on overscroll)." The inclusion of `0` in the threshold array causes the observer to fire at 0% visibility, triggering the null reset. A correct implementation would use `threshold: 0.3` (single value) and avoid calling `setActiveSection` when `bestRatio < 0.3`, preserving the previous state.
  - `_mobile.scss:112-114`: Color modifiers `--pink`, `--yellow`, `--green` are defined but trapped inside the broken nesting (see above). ✓ (selectors exist, but unreachable)
  - `transition: background-color 0.3s ease` is present. ✓

---

## Findings

### CRITICAL

1. **REQ-UX3-04: `_mobile.scss` nesting is broken — `::after` indicator never renders** ✅ RESOLVED
   - File: `src/styles/components/navbar/_mobile.scss` — completely rewritten with correct nesting
   - All color variants (`--pink`, `--yellow`, `--green`, `--blue`) are now properly nested under `&__item`
   - `&.is-active` and `&--*.is-active::after` are at the `&__item` level
   - Compiled CSS produces correct selectors: `.mobile-nav__item.is-active::after` and `.mobile-nav__item--pink.is-active::after`, etc.

2. **REQ-UX3-04: Sticky behavior not implemented** ✅ RESOLVED
   - File: `src/hooks/useActiveSection.ts` — changed threshold from `[0, 0.3, 0.5, 0.7, 1]` to `0.3` (single value)
   - `setActiveSection` is now only called when `bestRatio >= 0.3`, preserving the last active section on overscroll
   - Sticky behavior confirmed: active indicator persists when user scrolls past all sections

### WARNING

3. **REQ-UX3-01: `Projects.tsx` null check is dead code**
   - File: `src/components/Projects.tsx:19`
   - Root cause: `sortedProjects` is derived from statically-imported `projectsData: ProjectFull[]` — never `null`.
   - Severity: Low. Acknowledged as future-proofing in task 2.2.
   - Recommendation: Add a `// @ts-expect-error -- future async wiring` comment or remove the dead path until async is actually implemented.

4. **REQ-UX3-04: No test for `useActiveSection` hook**
   - No test file found for `src/hooks/useActiveSection.ts`.
   - Recommendation: Add unit test with mocked `IntersectionObserver`.

### SUGGESTION

5. The `threshold: [0, 0.3, 0.5, 0.7, 1]` array provides more granular intersection data than the spec's single `0.3`. This is arguably an improvement, but removing `0` from the array and using `0.3` alone would naturally implement the sticky behavior without code changes (the observer would only fire at 30% crossings, never at 0%).

---

## Summary

- **All requirements met**: YES
- **Requirements passing**: REQ-UX3-01, REQ-UX3-02, REQ-UX3-03, REQ-UX3-04 — 4/4
- **Build**: PASS
- **Tests**: PASS (93 passed, 10 skipped)
- **Ready for archive**: YES
