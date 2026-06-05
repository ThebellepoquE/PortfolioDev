# Specs: UX Phase 1 — Foundation

## Requirements Overview

| ID | Description | Priority |
|----|-------------|----------|
| REQ-UX1-01 | Smooth scroll behavior | High |
| REQ-UX1-02 | Reduced motion support | High |
| REQ-UX1-03 | Scroll-to-top button component | High |
| REQ-UX1-04 | Focus ring utility class | Medium |
| REQ-UX1-05 | Selective theme transition | High |

---

## REQ-UX1-01: Smooth scroll behavior

### Scenarios

**Scenario 1: User clicks an anchor link**
- **Given** `html` has `scroll-behavior: smooth` applied
- **When** user clicks any anchor link targeting an element on the same page
- **Then** the viewport smoothly scrolls to the target element with native browser interpolation

**Scenario 2: User has reduced-motion preference**
- **Given** the OS-level `prefers-reduced-motion: reduce` is active
- **When** user clicks an anchor link
- **Then** scroll is instant (`scroll-behavior: auto`), overriding smooth behavior

### Acceptance Criteria

- `scroll-behavior: smooth` is set on the `html` element in `_global.scss`
- No JavaScript is required for the animation itself
- The existing `<ScrollToTop />` (route-change handler in `App.tsx`) continues to use `behavior: 'instant'` and is not affected by this change

---

## REQ-UX1-02: Reduced motion support

### Scenarios

**Scenario 1: OS reduced motion enabled**
- **Given** the user's operating system has reduced motion enabled
- **When** any CSS animation, transition, or smooth scroll would fire
- **Then** all animations, transitions, and scroll-behavior are disabled globally via a single `@media (prefers-reduced-motion: reduce)` block

**Scenario 2: OS normal motion**
- **Given** the user has no motion preference set
- **When** any CSS animation, transition, or scroll runs
- **Then** all animations and transitions work at their default values

### Acceptance Criteria

- `@media (prefers-reduced-motion: reduce)` is defined in `_global.scss`
- Block sets `*, *::before, *::after` with `animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`, `transition-duration: 0.01ms !important`, `scroll-behavior: auto !important`
- Covers both CSS animations and transitions defined anywhere in the stylesheet
- Zero new dependencies

---

## REQ-UX1-03: Scroll-to-top button component

### Scenarios

**Scenario 1: User scrolls down**
- **Given** the user has scrolled more than 300px from the top of the page
- **When** the scroll position crosses the 300px threshold
- **Then** a floating button fades in (opacity transition from 0 to 1) at the bottom-right of the viewport

**Scenario 2: User clicks the button**
- **Given** the scroll-to-top button is visible
- **When** user clicks or activates the button
- **Then** the page smoothly scrolls to the top and the button fades out (opacity 0)

**Scenario 3: User tabs to the button**
- **Given** the button is in the DOM (visible or hidden)
- **When** user navigates via keyboard and focuses the button
- **Then** a focus ring is visible (using `.focus-ring` utility from REQ-UX1-04) and pressing Enter activates the scroll

**Scenario 4: Printing the page**
- **Given** the user prints the page (print media query)
- **When** the print layout is rendered
- **Then** the scroll-to-top button is not visible (hidden via print media query)

### Acceptance Criteria

- Component file: `src/components/ScrollToTopButton/ScrollToTopButton.tsx`
- Style file: `src/components/ScrollToTopButton/ScrollToTopButton.module.scss`
- Named export: `export const ScrollToTopButton`
- Uses `window.scrollTo({ top: 0, behavior: 'smooth' })` on click
- Mounted in `App.tsx` inside the `.app` container (not inside `<main>`, not at root level)
- Tracks scroll position via `useEffect` with scroll event listener, debounced via `requestAnimationFrame`
- `aria-label="Volver al inicio"` on the button element
- Hidden with `opacity: 0; pointer-events: none` when below threshold; `opacity: 1; pointer-events: auto` when visible
- Fade transition: `transition: opacity 0.3s ease`
- Print hiding: `@media print { display: none; }` or equivalent
- Uses `%btn-main` extend from `_common.scss`, or includes equivalent base button styles
- The button icon is a simple Unicode arrow or CSS triangle (no SVG asset)
- Zero new dependencies

### Coexistence with existing ScrollToTop

- Existing `<ScrollToTop />` in `App.tsx` (line 14) is not modified
- It handles route-change scroll (invisible, behavior `instant`)
- New `<ScrollToTopButton />` is a visible user-facing button (behavior `smooth`)
- Different export names prevent any import collision

---

## REQ-UX1-04: Focus ring utility class

### Scenarios

**Scenario 1: Keyboard navigation**
- **Given** an interactive element has the `.focus-ring` class
- **When** user tabs to that element via keyboard
- **Then** a solid 2px outline in brand yellow (`$yellow`) appears around the element

**Scenario 2: Mouse click**
- **Given** an interactive element has the `.focus-ring` class
- **When** user clicks the element with a mouse
- **Then** no outline appears (native `:focus-visible` behavior: no ring on pointer interaction)

### Acceptance Criteria

- Defined in `src/styles/utilities/_common.scss`
- Uses `:focus-visible`, NOT `:focus`
- Outline: `2px solid $yellow`, offset `2px`
- Exported as a Sass `@mixin focus-ring` AND a `.focus-ring` utility class
- Existing per-component `:focus-visible` rules are NOT modified in this phase (migration is tracked separately); they can coexist

---

## REQ-UX1-05: Selective theme transition

### Scenarios

**Scenario 1: User toggles theme**
- **Given** targeted elements have `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease`
- **When** user switches between light and dark theme
- **Then** the color change animates smoothly on section containers, cards, links, buttons, navbar, and footer

**Scenario 2: DOM mutation occurs**
- **Given** the global `*` transition rule has been removed
- **When** any DOM element is added, removed, or modified
- **Then** no unnecessary repaint or layout cost is incurred on elements that should not transition (e.g., code blocks, icons, skeleton loaders)

### Acceptance Criteria

- `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease` is **removed** from the `*` rule in `_global.scss`
- The following files receive an explicit `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease` on their root/container element:
  - `src/styles/components/Navbar.scss`
  - `src/styles/components/Footer.scss`
  - `src/styles/components/Hero.scss`
  - `src/styles/components/Projects.scss`
  - `src/styles/components/Contact.scss`
  - `src/styles/components/BlogList.scss`
  - `src/styles/components/ProjectCard.scss`
  - `src/styles/layout/_sections.scss` (section containers, if they exist)
- `src/styles/components/ThemeToggle.scss` is reviewed to ensure its own transitions are self-contained and not broken
- Theme toggle feels unchanged to the user — no visual regression in transition smoothness

---

## Non-Functional Requirements

| ID | Description |
|----|-------------|
| NFR-01 | Zero new runtime dependencies (no Framer Motion, no animation library) |
| NFR-02 | SCSS-only animations and transitions; no CSS-in-JS |
| NFR-03 | All changes pass existing ESLint, Stylelint, and TypeScript checks |
| NFR-04 | Scroll event listener uses `requestAnimationFrame` throttling, not `setTimeout` |
| NFR-05 | `prefers-reduced-motion` is respected by ALL motion-related CSS in this change |
| NFR-06 | Total diff under 200 lines |

---

## Edge Cases

| ID | Case | Handling |
|----|------|----------|
| EC-01 | User scrolls below 300px then quickly back above | Button opacity transition reverses mid-animation; no visual glitch |
| EC-02 | User clicks scroll-to-top while already at top | `window.scrollTo` is a no-op; button is already hidden |
| EC-03 | Button is focused while hidden (opacity 0) | `pointer-events: none` prevents interaction when hidden; focus cannot land on it |
| EC-04 | `prefers-reduced-motion` changes while page is open | Browsers re-evaluate media queries live; no JS listener needed |
| EC-05 | Component using `*` transition for non-theme purpose | Audit via grep before removal; no component relies on `*` for essential non-theme transitions |
| EC-06 | Scroll-to-top button on mobile with safe-area-inset | Button uses `bottom: 2rem` plus `env(safe-area-inset-bottom)` if available |
