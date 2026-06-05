# Proposal: UX Phase 2 — Scroll Reveals

## Summary

Add scroll-driven reveal animations to PortfolioDev using IntersectionObserver and CSS keyframes. Elements fade-up when they enter the viewport. Each section (hero, projects, blog) gets a progressively staggered entrance. Respects the Phase 1 `prefers-reduced-motion` rule already in place.

Zero new dependencies. One custom hook, one CSS utility class, three component wiring changes.

## Scope

### 1. Custom `useInView` hook
**File:** `src/hooks/useInView.ts` (new)
One-time reveal via IntersectionObserver. Returns `{ ref, isInView }`. Disconnects observer after element enters viewport. Accepts optional `IntersectionObserverInit` overrides. Default `threshold: 0.15`.

### 2. `.reveal` CSS class + `fade-up` keyframes
**File:** `src/styles/utilities/_common.scss` (modify)
Add `@keyframes fade-up` (opacity 0 → 1, translateY 20px → 0). Add `.reveal` (initial `opacity: 0`) and `.reveal.revealed` (plays `fade-up 0.6s ease forwards`). The existing `prefers-reduced-motion` rule in `_global.scss` already clamps all animation durations to 0.01ms, so `.reveal` needs no extra media query.

### 3. Staggered reveal for project cards
**File:** `src/components/Projects.tsx` (modify)
Wrap each `<ProjectCard>` in a `<div>` using `useInView`. Apply staggered `animation-delay` via inline style (`index * 100ms`). The `animation-delay` is a truly dynamic value — inline style is the appropriate pattern per AGENTS.md.

### 4. Staggered reveal for blog cards
**File:** `src/components/Blog/BlogList.tsx` (modify)
Same pattern as projects: wrap each `.blog-card` entry in a reveal `<div>`, staggered by `index * 100ms`. Blog cards are `<Link>` elements, so the wrapper div goes around them.

> **Note:** The `.blog-card` IS the `<Link>` — it can't also be the `ref` target for `useInView`. A wrapper `<div>` is required.

### 5. Hero entrance animation
**File:** `src/components/Hero.tsx` (modify)
Apply `.reveal` to the hero section container. Subtle fade-in on first page load. No stagger — the whole hero block fades in as one unit since it's above the fold.

## Approach

| Concern | Strategy |
|---------|----------|
| **Dependencies** | Zero. `IntersectionObserver` is native, available in all modern browsers. No polyfill needed. |
| **Animation engine** | CSS `@keyframes` triggered by class toggle. React sets `isInView`, CSS handles the motion. |
| **Reduced motion** | Already handled. Phase 1's `@media (prefers-reduced-motion: reduce)` in `_global.scss:10-17` clamps ALL `animation-duration` to 0.01ms. The `.reveal` animation is covered automatically. |
| **Performance** | Observer disconnects after one fire (`observer.disconnect()` in the effect cleanup). No ongoing listeners after reveal. `will-change: opacity, transform` not needed — the animation is short-lived and runs once. |
| **Stagger** | Inline `animation-delay` on the wrapper div. This is a genuinely dynamic value (index-dependent), so inline style is appropriate per AGENTS.md ("No inline styles salvo valores dinámicos reales"). |
| **Hook pattern** | Follows `useTheme.ts` conventions: named export, function declaration, typed return value. |

## Technical Design

### Hook API

```typescript
export function useInView(options?: IntersectionObserverInit): {
  ref: React.RefObject<HTMLDivElement>;
  isInView: boolean;
}
```

- `ref` — attach to the wrapper `<div>`
- `isInView` — flips `false → true` once, never resets
- `options` — merged with `{ threshold: 0.15 }` defaults; allows per-use overrides

### CSS API

```scss
.reveal {
  opacity: 0;

  &.revealed {
    animation: fade-up 0.6s ease forwards;
  }
}
```

Usage in JSX: `<div ref={ref} className={isInView ? 'reveal revealed' : 'reveal'}>`

### Component wiring pattern

```tsx
// Projects.tsx
{sortedProjects.map((project, i) => {
  const { ref, isInView } = useInView(); // eslint-disable-line react-hooks/rules-of-hooks
  return (
    <div
      key={project.id}
      ref={ref}
      className={isInView ? 'reveal revealed' : 'reveal'}
      style={{ animationDelay: `${i * 100}ms` }}
    >
      <ProjectCard project={project} />
    </div>
  );
})}
```

> **ESLint note:** Calling `useInView()` inside `.map()` triggers `react-hooks/rules-of-hooks`. Since `sortedProjects` is stable (derived from static `projectsData` via `useMemo([], [])`), the call count is invariant — the hook runs correctly. We suppress the rule with a comment.

### Why not custom properties for delay?

CSS custom properties (`--reveal-delay`) would require per-element inline styles anyway and add indirection. Inline `animation-delay` is simpler and directly expresses the intent: "this element delays its animation by N × 100ms". For two elements (Projects, BlogList), the inline pattern is less abstracted and easier to scan.

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| `useInView` inside `.map()` triggers hooks lint rule | **Medium** | Stable arrays (static data + `useMemo`). Suppress with per-line comment. Hook count invariant per render. |
| Observer memory leak if component unmounts before disconnect | Low | `useEffect` cleanup returns `() => observer.disconnect()`. Covered. |
| `.blog-card` wrapper breaks grid layout | Low | The wrapper `<div>` is invisible (no border, no padding, no margin). Grid gap comes from parent `.blog-list__grid` which uses `gap`. No layout shift. |
| `prefers-reduced-motion` overrides apply too aggressively | Low | Phase 1 already uses the 0.01ms pattern. Same rule covers all animations. No new code needed. |
| Hero animation flash on SPA navigation (not first load) | Low | Hero content is static and cached. `isInView` fires instantly on mount for above-the-fold content. The fade-up is barely perceptible — it looks intentional. |

## Estimated Effort

~115 lines across 5 files. Fits within 400-line review budget.

## Files Affected

| File | Action | Est. Lines |
|------|--------|------------|
| `src/hooks/useInView.ts` | **New** — IntersectionObserver hook | +27 |
| `src/styles/utilities/_common.scss` | Modify — add `@keyframes fade-up` + `.reveal` | +18 |
| `src/components/Hero.tsx` | Modify — wrap hero container with reveal | +6 |
| `src/components/Projects.tsx` | Modify — wrap each card with staggered reveal | +8 |
| `src/components/Blog/BlogList.tsx` | Modify — wrap each card with staggered reveal | +10 |
