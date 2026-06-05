# Tasks: UX Phase 2 — Scroll Reveals

## Task 1: Create `useInView` hook

**Implements:** REQ-UX2-01
**Files:** `src/hooks/useInView.ts` (new, +27 lines)
**Steps:**

1. Create `src/hooks/useInView.ts` with this exact content:

```typescript
import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
```

**Verification:**
- Named export `useInView`, function declaration (matches `useTheme.ts:11` pattern)
- Returns `{ ref, isInView }` with correct types inferred by TypeScript
- `useEffect` cleanup returns `() => observer.disconnect()`
- Default `threshold: 0.15`, overridable via `...options` spread
- Observer disconnects inside callback AND on unmount
- SSR-safe: `if (!el) return` guards `ref.current` access

---

## Task 2: Add `fade-up` keyframes + `.reveal` class

**Implements:** REQ-UX2-02
**Files:** `src/styles/utilities/_common.scss` (modify, +18 lines)
**Steps:**

1. At the end of `_common.scss` (after line 86, `.focus-ring` block), append:

```scss
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  opacity: 0;

  &.revealed {
    animation: fade-up 0.6s ease forwards;
  }
}
```

**Verification:**
- `@keyframes fade-up` defined with `opacity` 0→1 and `translateY` 20px→0
- `.reveal` sets `opacity: 0` (hidden initial state)
- `.reveal.revealed` plays `fade-up 0.6s ease forwards` (final frame persists)
- No `prefers-reduced-motion` block here — existing rule at `_global.scss:10-17` clamps all `animation-duration` to `0.01ms` globally
- No `will-change` property (animation is short-lived, runs once per element)
- SCSS nesting uses `&.revealed` pattern consistent with `%btn-main:hover` style at line 23

---

## Task 3: Hero entrance animation

**Implements:** REQ-UX2-03
**Files:** `src/components/Hero.tsx` (modify, +5 lines)
**Current state:** `Hero.tsx:6-96` — functional component with `<section id="inicio" className="hero">` containing `<div className="hero__container">`
**Steps:**

1. Add import at line 1 (after existing imports):

```typescript
import { useInView } from '../hooks/useInView';
```

2. Inside the component function body (line 7), before the `return`, add:

```typescript
const { ref, isInView } = useInView();
```

3. Inside `<section id="inicio" className="hero">` (line 8), wrap the existing `<div className="hero__container">` in a reveal wrapper:

```tsx
<section id="inicio" className="hero">
  <div ref={ref} className={isInView ? 'reveal revealed' : 'reveal'}>
    <div className="hero__container">
      {/* ... existing content unchanged ... */}
    </div>
  </div>
</section>
```

**Verification:**
- Wrapper `<div>` is **inside** `<section>`, not outside
- Wrapper surrounds the entire `hero__container` (all hero content fades as one unit)
- No `animationDelay` inline style (hero is not staggered)
- Hero is above the fold → `isInView` fires on mount, fade-up plays immediately
- `prefers-reduced-motion` handled automatically by `_global.scss:10-17`

---

## Task 4: Staggered project card reveals

**Implements:** REQ-UX2-04
**Files:** `src/components/Projects.tsx` (modify, +8 lines)
**Current state:** `Projects.tsx:25-27` — `.map()` destructures only `project`, not index; `<ProjectCard key={project.id} project={project} />`
**Steps:**

1. Add import at line 1 (after existing imports):

```typescript
import { useInView } from '../hooks/useInView';
```

2. Replace the `.map()` block (lines 25-27) with:

```tsx
{sortedProjects.map((project, i) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { ref, isInView } = useInView();
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

**Verification:**
- `.map()` destructures index as `i` (second argument)
- `useInView()` called inside `.map()` with ESLint suppression comment on the preceding line
- `key={project.id}` moved to wrapper `<div>`; `<ProjectCard>` no longer carries `key`
- `animationDelay` uses inline style (`i * 100ms`) — genuinely dynamic value per AGENTS.md
- `sortedProjects` is stable via `useMemo([], [])` at line 8 → hook call count invariant across renders
- Wrapper `<div>` has no border, padding, or margin that could disrupt layout
- `prefers-reduced-motion` handled by `_global.scss:10-17`

---

## Task 5: Staggered blog card reveals

**Implements:** REQ-UX2-05
**Files:** `src/components/Blog/BlogList.tsx` (modify, +10 lines)
**Current state:** `BlogList.tsx:31-78` — `.map()` destructures only `post`, not index; `<Link key={post.slug} to={...} className="blog-card">` wraps all card content
**Steps:**

1. Add import at line 1 (after existing imports):

```typescript
import { useInView } from '../../hooks/useInView';
```

2. Replace the `.map()` block (lines 31-78) with:

```tsx
{posts.map((post, i) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { ref, isInView } = useInView();
  return (
    <div
      key={post.slug}
      ref={ref}
      className={isInView ? 'reveal revealed' : 'reveal'}
      style={{ animationDelay: `${i * 100}ms` }}
    >
      <Link to={`/blog/${post.slug}`} className="blog-card">
        {/* existing card content unchanged (lines 37-76) */}
      </Link>
    </div>
  );
})}
```

3. Remove `key={post.slug}` from the `<Link>` element (currently at line 33)

**Verification:**
- `.map()` destructures index as `i`
- `useInView()` called inside `.map()` with ESLint suppression comment
- `key={post.slug}` moved to wrapper `<div>`; `<Link>` no longer carries `key`
- Wrapper `<div>` is invisible to the grid (no margin, padding, border) → `.blog-list__grid` `gap` determines spacing
- `<Link>` is the interactive element; wrapper holds only the `ref`, `className`, and `animationDelay`
- `posts` is stable via `useMemo(() => getAllPosts(), [])` at line 9 → hook call count invariant
- Empty state (lines 25-27) unchanged — no reveal wrappers when `posts.length === 0`
- `prefers-reduced-motion` handled by `_global.scss:10-17`

---

## Verification

After implementing all tasks:

```bash
npm run lint          # ESLint: per-line suppression for react-hooks/rules-of-hooks accepted; no new violations
npx stylelint "**/*.scss"  # Stylelint: _common.scss additions pass
npm run build         # TypeScript: strict mode, no type errors
```

Manual checks:
- Scroll home page: hero fades up on load, project cards stagger as you scroll down, blog cards stagger as you scroll further
- Enable `prefers-reduced-motion: reduce` in DevTools → all elements appear instantly
- Navigate away and back to home → hero re-animates (SPA navigation, component remounts)
- Verify no layout shift: cards reserve their grid space from initial render even at `opacity: 0`

NFR verification:
- `git diff --stat` shows ≤115 lines across 5 files
- Zero new dependencies in `package.json` (`IntersectionObserver` is native)
- No CSS-in-JS animation — all motion defined in SCSS keyframes
- No `will-change` properties added
- No new `prefers-reduced-motion` media queries added

---

## Rollback Plan

| File | Rollback |
|------|----------|
| `src/hooks/useInView.ts` | Delete file |
| `src/styles/utilities/_common.scss` | Remove lines added after line 86 (`@keyframes fade-up` + `.reveal` blocks) |
| `src/components/Hero.tsx` | Remove `useInView` import; remove wrapper `<div>`; restore original structure |
| `src/components/Projects.tsx` | Remove `useInView` import; restore original `.map()` with `key` on `<ProjectCard>` |
| `src/components/Blog/BlogList.tsx` | Remove `useInView` import; restore original `.map()` with `key` on `<Link>` |

Each file change is self-contained. Rolling back any file does not break the others — if only the hook rollback is needed, the three component files would fail TypeScript compilation (missing import), so a full rollback of all 5 files is a single atomic revert.

---

## Review Workload Forecast

| File | Lines | Complexity |
|------|-------|------------|
| `src/hooks/useInView.ts` | +27 | Low — pure hook, standard IntersectionObserver pattern |
| `src/styles/utilities/_common.scss` | +18 | Low — standard keyframes + class toggle |
| `src/components/Hero.tsx` | +5 | Low — one wrapper div, no stagger logic |
| `src/components/Projects.tsx` | +8 | Medium — `.map()` refactor, ESLint suppression, staggered delay |
| `src/components/Blog/BlogList.tsx` | +10 | Medium — same pattern as Projects, plus `<Link>` wrapper awareness |

**Total:** ~68 lines across 5 files (within the 115-line budget; actual diff may be slightly less due to removal of `key` props on existing elements). All changes follow existing conventions. The two `.map()` refactors (Projects + BlogList) deserve reviewer attention for the ESLint suppression rationale, but the pattern is identical between them — reviewing one covers both.
