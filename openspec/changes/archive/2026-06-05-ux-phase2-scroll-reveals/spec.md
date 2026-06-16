# Specs: UX Phase 2 — Scroll Reveals

## Requirements Overview

| ID | Description | Priority |
|----|-------------|----------|
| REQ-UX2-01 | `useInView` hook — IntersectionObserver | High |
| REQ-UX2-02 | `fade-up` keyframes + `.reveal` CSS class | High |
| REQ-UX2-03 | Hero entrance animation | High |
| REQ-UX2-04 | Staggered project card reveals | High |
| REQ-UX2-05 | Staggered blog card reveals | High |

---

## REQ-UX2-01: `useInView` hook

Named export `useInView` from `src/hooks/useInView.ts`. Uses `IntersectionObserver` to detect when an element enters the viewport. Returns a `ref` to attach to a DOM element and a boolean `isInView` that flips from `false` to `true` once and never resets. Disconnects the observer on both triggers: element entering the viewport AND component unmount. Accepts an optional `IntersectionObserverInit` parameter merged with default `threshold: 0.15`.

### Scenarios

**Scenario 1: Element scrolls into viewport**
- **Given** a component uses `useInView()` and attaches `ref` to a `<div>`
- **When** the element scrolls into the viewport and intersects at the configured threshold (default 0.15)
- **Then** `isInView` becomes `true`, the observer disconnects, and no further observations occur

**Scenario 2: Component unmounts before element enters view**
- **Given** a component uses `useInView()` and the element has not yet intersected
- **When** the component unmounts (e.g., SPA navigation away from the section)
- **Then** the observer disconnects cleanly via the `useEffect` cleanup function, with no memory leak

**Scenario 3: options override default threshold**
- **Given** a component calls `useInView({ threshold: 0.5 })`
- **When** the element scrolls toward the viewport
- **Then** `isInView` only flips when 50% of the element is visible, overriding the default 0.15

### Acceptance Criteria

- File: `src/hooks/useInView.ts` (new, ~27 lines)
- Named export: `export function useInView`
- Returns `{ ref, isInView }` where `ref` is `React.RefObject<HTMLDivElement>` and `isInView` is `boolean`
- Uses `useRef` for the HTMLDivElement ref and `useState(false)` for `isInView`
- Uses `useEffect` with dependencies `[options]`; cleanup returns `() => observer.disconnect()`
- Observer callback: when entry is intersecting, calls `observer.disconnect()` AND `setIsInView(true)`
- Default threshold: `0.15` merged with `...options` via `{ threshold: 0.15, ...options }`
- Follows existing hook patterns from `src/hooks/useTheme.ts`: named export, function declaration, typed return value, `useEffect` with cleanup
- Zero external dependencies (native `IntersectionObserver` only)
- SSR-safe: guard `IntersectionObserver` availability (though not strictly required for this SPA, it matches quality conventions)

---

## REQ-UX2-02: `fade-up` keyframes + `.reveal` class

A `@keyframes fade-up` animation and `.reveal` utility class added to `src/styles/utilities/_common.scss`. The animation fades the element from invisible and 20px below to visible at its natural position. The `.reveal` class sets initial hidden state; adding the `.revealed` class triggers the animation. Must be covered by the existing `prefers-reduced-motion` rule in `_global.scss` (Phase 1) — no extra media query needed because the global rule already clamps all `animation-duration` values to `0.01ms`.

### Scenarios

**Scenario 1: Element with `.reveal` class only**
- **Given** an element has `class="reveal"`
- **When** the page renders
- **Then** the element is invisible (`opacity: 0`) and no animation is playing

**Scenario 2: `.revealed` class is added**
- **Given** an element has `class="reveal"`
- **When** the `.revealed` class is added (via React state, making `class="reveal revealed"`)
- **Then** the element plays `fade-up 0.6s ease forwards` — it fades from opacity 0 to 1 and translates from 20px below to its natural position, remaining at the final frame (`forwards` fill mode)

**Scenario 3: Reduced motion is active**
- **Given** the user has `prefers-reduced-motion: reduce` enabled
- **When** `.revealed` is added to the element
- **Then** the animation duration is clamped to `0.01ms` by the existing global rule in `_global.scss:10-17`, making the element appear instantly (no visible fade-up)

### Acceptance Criteria

- Defined in `src/styles/utilities/_common.scss` (modify, +18 lines)
- `@keyframes fade-up`: `from { opacity: 0; transform: translateY(20px); }` → `to { opacity: 1; transform: translateY(0); }`
- `.reveal`: initial state with `opacity: 0`
- `.reveal.revealed`: `animation: fade-up 0.6s ease forwards`
- No separate `prefers-reduced-motion` block inside `_common.scss` — the existing global rule in `_global.scss` handles this automatically
- No `will-change` property (animation is short-lived and runs once per element; proposal explicitly rules this out)
- SCSS nesting follows existing conventions (the codebase uses standard SCSS, no BEM-flattening via `&` for nested classes is needed)

---

## REQ-UX2-03: Hero entrance animation

The hero section container fades in on page load using the `useInView` hook and `.reveal` class. Since the hero is above the fold, `isInView` fires immediately on mount. The entire hero block fades up as one cohesive unit — no per-element stagger.

### Scenarios

**Scenario 1: Page loads**
- **Given** the user navigates to the home page
- **When** the `Hero` component mounts and renders
- **Then** the hero container fades up from 20px below over 0.6s with the `fade-up` animation applied

**Scenario 2: Reduced motion is active**
- **Given** the user has reduced motion enabled
- **When** the page loads
- **Then** the hero appears instantly with no animation (global reduced-motion rule applies)

### Acceptance Criteria

- File: `src/components/Hero.tsx` (modify, +6 lines)
- A wrapper `<div>` is added inside the `<section id="inicio" className="hero">` surrounding all existing hero content
- The wrapper uses `useInView()` and applies `className={isInView ? 'reveal revealed' : 'reveal'}`
- No `animation-delay` is applied (entire hero fades as one unit)
- No **new** `<div>` wrapping the `<section>`; the wrapper goes **inside** the `<section>`, around the existing `<div className="hero__container">` or around the `<section>` content
- No animation-delay inline style needed — hero is a single unit, not staggered
- Import added: `import { useInView } from '../hooks/useInView';`

---

## REQ-UX2-04: Staggered project card reveals

Each project card fades up one by one with a 100ms stagger between them as the user scrolls into the Projects section. Each `.project-card` is wrapped in a reveal `<div>` driven by `useInView`. Because `useInView()` is called inside `.map()`, the ESLint `react-hooks/rules-of-hooks` rule must be suppressed with a per-line comment. The stagger is achieved via inline `animation-delay` set to `index * 100ms`.

### Scenarios

**Scenario 1: User scrolls into Projects section**
- **Given** the page has multiple project cards rendered below the fold
- **When** the user scrolls down and the first project card wrapper intersects the viewport at 15% visibility
- **Then** each card fades up with a 100ms stagger (`index * 100ms`) — card 0 at 0ms, card 1 at 100ms, card 2 at 200ms, etc.

**Scenario 2: Cards are already above the fold (e.g., on short pages or resize)**
- **Given** a card element is visible on mount (above the fold or viewport is tall)
- **When** the component mounts and IntersectionObserver fires the callback
- **Then** the card still reveals with its stagger delay applied; `isInView` flips immediately and the CSS animation plays with the assigned delay

**Scenario 3: Reduced motion is active**
- **Given** the user has reduced motion enabled
- **When** project cards enter the viewport
- **Then** all cards appear instantly with no stagger (global rule clamps animation-duration to 0.01ms)

### Acceptance Criteria

- File: `src/components/Projects.tsx` (modify, +8 lines)
- Each `<ProjectCard>` is wrapped in a `<div>` with `ref={ref}`, `className={isInView ? 'reveal revealed' : 'reveal'}`, and `style={{ animationDelay: \`${i * 100}ms\` }}`
- The `.map()` callback destructures the index as the second argument and saves it as `i`
- `useInView()` is called inside the `.map()` callback with `// eslint-disable-next-line react-hooks/rules-of-hooks` on the same line
- The `sortedProjects` array is stable (derived from static `projectsData` via `useMemo([], [])`), ensuring hook call count is invariant across renders
- The wrapper `<div>` uses `key={project.id}` (same key that was on `<ProjectCard>`) — the `<ProjectCard>` no longer needs a `key` prop
- Wrapper has no border, padding, or margin that could disrupt layout
- Imports added: `import { useInView } from '../hooks/useInView';`

---

## REQ-UX2-05: Staggered blog card reveals

Each blog card fades up with a 100ms stagger, identical pattern to project cards. Key difference: the `.blog-card` is already a `<Link>` element (which is the interactive/anchor element), so it cannot also serve as the `ref` target for `useInView`. A wrapper `<div>` goes around each `<Link>` to hold the `ref`, `className`, and `animation-delay`. The wrapper must NOT break the `.blog-list__grid` layout, which uses `gap` for spacing (no per-card margins).

### Scenarios

**Scenario 1: User scrolls into Blog section**
- **Given** the blog list has multiple cards rendered below the fold
- **When** the user scrolls and the first blog card wrapper intersects at 15% visibility
- **Then** each card fades up with a 100ms stagger — card 0 at 0ms, card 1 at 100ms, card 2 at 200ms, etc.

**Scenario 2: Empty blog list**
- **Given** there are no blog posts (`posts.length === 0`)
- **When** the `BlogList` component renders
- **Then** the empty state message is shown — no reveal wrappers are rendered (the `.map()` over the empty array produces no elements)

**Scenario 3: Grid layout is preserved**
- **Given** blog cards with reveal wrappers are rendered inside `.blog-list__grid`
- **When** the grid layout is computed by the browser
- **Then** the wrapper `<div>` is invisible to the grid (no extra margin, padding, or border) and the grid gap between cards is determined solely by `.blog-list__grid`'s `gap` property

**Scenario 4: Reduced motion is active**
- **Given** the user has reduced motion enabled
- **When** blog cards enter the viewport
- **Then** all cards appear instantly (global reduced-motion rule applies)

### Acceptance Criteria

- File: `src/components/Blog/BlogList.tsx` (modify, +10 lines)
- Each `<Link className="blog-card">` is wrapped in a `<div>` with `ref={ref}`, `className={isInView ? 'reveal revealed' : 'reveal'}`, and `style={{ animationDelay: \`${i * 100}ms\` }}`
- The `.map()` callback destructures the index as `i`
- `useInView()` is called inside `.map()` with ESLint suppression comment
- The wrapper `<div>` receives `key={post.slug}` — the `<Link>` no longer carries `key`
- No CSS changes to `.blog-list__grid` or `.blog-card` are required
- Wrapper has no visible box-model properties that could alter grid cell sizing
- Imports added: `import { useInView } from '../../hooks/useInView';`
- The existing `posts = useMemo(() => getAllPosts(), [])` ensures stable hook call count across renders

---

## Non-Functional Requirements

| ID | Description |
|----|-------------|
| NFR-01 | Zero new runtime dependencies (no Framer Motion, no AOS, no animation library) |
| NFR-02 | CSS-only animations triggered by React class toggle; SCSS keyframes, no CSS-in-JS |
| NFR-03 | All changes pass existing ESLint, Stylelint, and TypeScript checks (with intentional per-line ESLint suppression for hooks-in-map) |
| NFR-04 | `IntersectionObserver` disconnects after single fire — no ongoing listeners after reveal |
| NFR-05 | `prefers-reduced-motion` handled exclusively by the existing global rule in `_global.scss:10-17` — no new media queries |
| NFR-06 | Total diff under 115 lines across 5 files |
| NFR-07 | Follows AGENTS.md conventions: named exports, functional components, inline styles only for dynamic values (`animation-delay`) |
| NFR-08 | Hook follows existing `src/hooks/useTheme.ts` pattern: named function export, typed return value, `useEffect` with cleanup |

---

## Edge Cases

| ID | Case | Handling |
|----|------|----------|
| EC-01 | Element intersects before observer connects (race condition) | `useEffect` runs after mount; if the element is already visible, the observer fires the callback on the next frame and `isInView` flips to `true` immediately |
| EC-02 | Component re-renders after `isInView` is already `true` | `isInView` never resets to `false`; observer is already disconnected; subsequent renders are no-ops for the hook |
| EC-03 | `sortedProjects` or `posts` array length changes between renders | Both arrays are derived from static data via `useMemo([], [])` — they are stable with empty dependency arrays; no length mutation occurs |
| EC-04 | Browser does not support `IntersectionObserver` (IE11, very old mobile) | No polyfill per scope decision (proposal explicitly states no polyfill needed; all target browsers support it natively) |
| EC-05 | `animation-delay` exceeds total scroll time (user scrolls fast past all cards at once) | All cards observe and flip `isInView` on the same frame; CSS staggers their animation start times via `animation-delay` — they visibly cascade even though JS flipped them all at once |
| EC-06 | `.reveal.revealed` specificity conflict with component-level SCSS | `.reveal` sets only `opacity: 0` and `.reveal.revealed` sets only `animation` — no properties overlap with component styles; `animation` has no equivalent in component-level stylesheets |
| EC-07 | Grid gap appears to shift when cards transition from invisible to visible | Cards start at `opacity: 0` and remain in layout flow — their space is reserved from the start; no layout shift occurs |
