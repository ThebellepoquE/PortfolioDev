# Design: Fix useInView Client Directive

## Technical Approach

Add the `"use client"` directive as the first line of `src/hooks/useInView.ts`. This is a one-line addition that marks the module as a Client Component, satisfying Next.js App Router's requirement for files that use React hooks and browser APIs.

The hook imports `useEffect`, `useRef`, and `useState` from React, and uses `IntersectionObserver` — all inherently client-side. The directive is mandatory, not optional.

## Architecture Decisions

### Decision: Add `"use client"` directive to useInView.ts

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Add `"use client"` as first line | Standard Next.js pattern; zero downside; fixes build | **Chosen** |
| Refactor hook to avoid React hooks | Massive effort; breaks API; unnecessary | Rejected |
| Move hook logic into consuming component | Couples animation logic to each consumer; violates DRY | Rejected |
| Audit all hooks for same issue | Out of scope per proposal; separate concern | Deferred |

**Rationale**: The `"use client"` directive is the canonical Next.js mechanism. The hook's implementation is correct — it only lacks the module boundary marker. No other change is needed.

### Decision: No changes to hook implementation

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Keep hook logic unchanged | Zero risk; behavior preserved | **Chosen** |
| Optimize IntersectionObserver options | Unnecessary; current config works | Rejected |

**Rationale**: The proposal explicitly scopes out refactoring. The hook works correctly; it just needs the directive.

## Data Flow

```
Reveal.tsx (Client Component)
    │
    └── imports ──→ useInView.ts (now marked "use client")
                         │
                         ├── useEffect (React hook)
                         ├── useRef (React hook)
                         ├── useState (React hook)
                         └── IntersectionObserver (browser API)
```

The directive propagates the client boundary to all modules that import `useInView`, ensuring Next.js correctly bundles them for client-side execution.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useInView.ts` | Modify | Add `"use client";` as line 1, before the existing import statement |

**Exact change**:

```diff
+ "use client";
  import { useEffect, useRef, useState } from 'react';

  export function useInView(options?: IntersectionObserverInit) {
```

## Interfaces / Contracts

No interface changes. The hook's API remains:

```typescript
export function useInView(options?: IntersectionObserverInit): {
  ref: React.RefObject<HTMLDivElement>;
  isInView: boolean;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | Next.js build succeeds | `pnpm run build` exits 0 |
| Lint | No lint violations | `pnpm run lint` passes |
| Type check | TypeScript compiles | `pnpm run typecheck` passes |
| Unit | Existing hook tests pass | `pnpm run test:run` (no test changes needed) |
| Runtime | Reveal component animates on scroll | Manual verification in dev server |

## Migration / Rollout

No migration required. This is a build fix, not a feature change. The directive is additive and backward-compatible.

## Open Questions

None.
