# Tasks: UX Phase 1 — Foundation

## Task 1: Smooth scroll + reduced motion in _global.scss
**Implements:** REQ-UX1-01, REQ-UX1-02

**Files:**
- `src/styles/base/_global.scss` (modify)

**Steps:**
1. Add `scroll-behavior: smooth` to the `html` element (new rule above `body`)
2. Add `@media (prefers-reduced-motion: reduce)` block below the `*` rule:
   - Target `*, *::before, *::after`
   - Set `animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`, `transition-duration: 0.01ms !important`, `scroll-behavior: auto !important`

**Verification:**
- `git diff src/styles/base/_global.scss` — only additions, no removals
- `pnpm run lint:styles` passes
- Manual: open page, OS-level reduced-motion ON → anchor clicks jump instantly

---

## Task 2: Focus ring utility class and mixin
**Implements:** REQ-UX1-04

**Files:**
- `src/styles/utilities/_common.scss` (modify)

**Steps:**
1. Add a `@mixin focus-ring` that sets:
   ```scss
   &:focus-visible {
     outline: 2px solid $yellow;
     outline-offset: 2px;
   }
   ```
2. Add a `.focus-ring` utility class using the same mixin (or the same `:focus-visible` block):
   ```scss
   .focus-ring {
     &:focus-visible {
       outline: 2px solid $yellow;
       outline-offset: 2px;
     }
   }
   ```
3. Do NOT modify any existing per-component `:focus-visible` rules (migration is out of scope for this phase)

**Verification:**
- `pnpm run lint:styles` passes
- `git diff src/styles/utilities/_common.scss` — only additions
- Manual: add `class="focus-ring"` to any interactive element and tab to it — yellow outline appears; click it with mouse — no outline

---

## Task 3: ScrollToTopButton component
**Implements:** REQ-UX1-03

**Files:**
- `src/components/ScrollToTopButton/ScrollToTopButton.tsx` (create)
- `src/components/ScrollToTopButton/ScrollToTopButton.module.scss` (create)
- `src/App.tsx` (modify — mount component)

**Steps:**

### 3a. Create component file
`src/components/ScrollToTopButton/ScrollToTopButton.tsx`:
- Named export: `export const ScrollToTopButton`
- State: `const [isVisible, setIsVisible] = useState(false)`
- `useEffect` with scroll listener throttled via `requestAnimationFrame`:
  - Check `window.scrollY > 300` → set `isVisible` (true if above, false if below)
  - Cleanup: cancel pending `requestAnimationFrame` and remove listener on unmount
- Render: `<button>` with:
  - `className={styles.button}` (from CSS Module), conditionally add visible class
  - `aria-label="Volver al inicio"`
  - `onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}`
  - Content: Unicode arrow `↑` or CSS triangle (no SVG asset)
- When hidden (`!isVisible`): element uses `opacity: 0; pointer-events: none`
- When visible: `opacity: 1; pointer-events: auto`

### 3b. Create SCSS module
`src/components/ScrollToTopButton/ScrollToTopButton.module.scss`:
- `@use` the variables and `_common.scss` partial
- `.button`:
  - `position: fixed; bottom: 2rem; right: 2rem; z-index: 999`
  - `opacity: 0; pointer-events: none`
  - `transition: opacity 0.3s ease`
  - Use `@extend %btn-main` from `_common.scss` for base button styles
  - Add safe-area: `bottom: calc(2rem + env(safe-area-inset-bottom, 0px))`
- `.visible` modifier: `opacity: 1; pointer-events: auto`
- `@media print { display: none; }`
- Use `.focus-ring` class or `@include focus-ring` mixin for `:focus-visible`

### 3c. Mount in App.tsx
- Import `ScrollToTopButton`
- Add `<ScrollToTopButton />` inside `.app` container, AFTER `<main>` and BEFORE the `<Suspense>` wrapping `<Footer />`
- Do NOT modify the existing `<ScrollToTop />` component or its import

**Verification:**
- `pnpm test:run` — all existing tests pass
- `pnpm run lint` — no ESLint errors
- `pnpm run build` — compiles without errors
- Manual: scroll down >300px → button fades in; click → smooth scroll to top, button fades out; print preview → button hidden; tab to button → yellow focus ring visible

---

## Task 4: Selective theme transition (remove `*` transition, add targeted)
**Implements:** REQ-UX1-05

**Files:**
- `src/styles/base/_global.scss` (modify — remove `*` transition line)
- `src/styles/components/Footer.scss` (modify)
- `src/styles/components/hero/_layout.scss` (modify)
- `src/styles/components/Projects.scss` (modify)
- `src/styles/components/contact/_layout.scss` (modify)
- `src/styles/components/BlogList.scss` (modify)
- `src/styles/components/navbar/_desktop.scss` (modify)
- `src/styles/components/ThemeToggle.scss` (audit only — no changes needed)

**Steps:**

### 4a. Remove global `*` transition
In `src/styles/base/_global.scss`, remove the line:
```scss
transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
```
from the `*` rule block. The `*` rule keeps only `margin`, `padding`, and `box-sizing`.

### 4b. Add targeted transitions to section containers
The following root/container selectors currently have ONLY `transition: background-color 0.3s`. Expand each to the full three-property set:

| File | Selector | Current | Change to |
|------|----------|---------|-----------|
| `Footer.scss:11` | `.footer` | `transition: background-color 0.3s` | `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease` |
| `hero/_layout.scss:10` | `.hero` | `transition: background-color 0.3s` | Same as above |
| `Projects.scss:10` | `.projects` | `transition: background-color 0.3s` | Same as above |
| `contact/_layout.scss:10` | `.contact` | `transition: background-color 0.3s` | Same as above |
| `BlogList.scss:8` | `.blog-list` | `transition: background-color 0.3s` | Same as above |
| `navbar/_desktop.scss:11` | `.navbar` | `transition: background-color 0.3s` | Same as above |

### 4c. Replace `transition: all` on cards
Cards currently use `transition: all` which is the problem the global removal is trying to solve. Replace with targeted properties:

| File | Selector | Current | Change to |
|------|----------|---------|-----------|
| `Projects.scss:64` | `.project-card` | `transition: all 0.5s` | `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.5s ease` |
| `BlogList.scss:76` | `.blog-card` | `transition: all 0.3s` | `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease` |

### 4d. Audit ThemeToggle (no changes)
- `.theme-toggle` has `transition: transform 0.2s` — self-contained, not affected by `*` rule removal
- `.theme-toggle__icon` has `transition: all 0.3s` — explicit, not dependent on `*` rule; used for icon rotation/scale/opacity animations. Leave as-is.

### 4e. Skip nonexistent files
- `src/styles/components/ProjectCard.scss` — does not exist; `.project-card` styles live in `Projects.scss` (handled in 4c)
- `src/styles/layout/_sections.scss` — does not exist; no action needed

**Verification:**
- `pnpm run lint:styles` — no Stylelint errors
- `pnpm run build` — compiles without errors
- Manual: toggle theme (light ↔ dark) → all sections, cards, navbar, footer transition smoothly with no visual regression
- Manual: use browser DevTools Performance tab → verify theme toggle repaint cost is lower than before
- `git diff --stat` — confirm total diff is under 200 lines

---

## Verification

Run after all tasks are implemented:

```bash
pnpm run check:local
```

This executes `pnpm test:run && pnpm run lint && pnpm run build` (ESLint, Stylelint, TypeScript, Vite build, and Vitest tests).

### Manual verification checklist

- [ ] `scroll-behavior: smooth` — click any anchor link; viewport scrolls smoothly
- [ ] Reduced motion — enable OS-level reduced motion; anchor clicks jump instantly; animations/transitions disabled
- [ ] ScrollToTopButton — scroll >300px, button fades in; click → smooth scroll to top; tab → yellow focus ring; print preview → hidden
- [ ] Theme toggle — switch light ↔ dark; all section backgrounds, text colors, borders transition smoothly; no jank or flash
- [ ] Zero regressions — existing `<ScrollToTop />` still works on route change (behavior: instant)
- [ ] Zero new npm dependencies (`git diff package.json pnpm-lock.yaml` — no changes)

---

## Rollback Plan

Each task is independently reversible:

1. **REQ-UX1-01 / REQ-UX1-02**: Revert `_global.scss` additions (remove `scroll-behavior: smooth` from `html`, remove `@media (prefers-reduced-motion)` block)
2. **REQ-UX1-04**: Remove `.focus-ring` class and `@mixin focus-ring` from `_common.scss`
3. **REQ-UX1-03**: Delete `src/components/ScrollToTopButton/` directory; remove `<ScrollToTopButton />` from `App.tsx` and its import
4. **REQ-UX1-05**: Restore `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease` to the `*` rule in `_global.scss`; revert each component file's transition to its previous value (see Task 4 references for exact line numbers in each file)

Rollback verification: `pnpm run check:local` must pass after reverting any task.

---

## Review Workload Forecast

| Metric | Estimate |
|--------|----------|
| Files touched | ~12 (2 modified + 2 new + 8 theme-transition files) |
| Lines added | ~80 |
| Lines removed | ~15 |
| Net diff | ~95 lines |
| Within 200-line NFR-06 budget? | Yes |
| Within 400-line review budget? | Yes |
| Chained PRs recommended? | No — single PR is well under the 400-line threshold |
| Risk of exceeding budget | Low — each component file change is a 2-3 line edit; the largest block is the new ScrollToTopButton component (~85 lines total TSX + SCSS) |
