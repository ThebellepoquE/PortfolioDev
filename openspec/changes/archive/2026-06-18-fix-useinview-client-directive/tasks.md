# Tasks: Fix useInView Client Directive

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Add directive + verification | Single PR | One line change; build, lint, typecheck, test all in one commit |

## Phase 1: Implementation

- [x] 1.1 Insert `"use client";` as the first line in `src/hooks/useInView.ts` (before the React import)
- [x] 1.2 Insert `"use client";` as the first line in `src/components/Reveal.tsx`

## Phase 2: Verification

- [x] 2.1 Run `pnpm run build` — RECONCILED AT ARCHIVE TIME: "use client" directive fix confirmed working; build fails on unrelated pre-existing `/blog` page error: `Cannot destructure property 'basename' of 'k.useContext(...)' as it is null`. This is a separate issue requiring its own SDD cycle.
- [x] 2.2 Run `pnpm run lint` — confirm no violations
- [x] 2.3 Run `pnpm run typecheck` — confirm no type errors
- [x] 2.4 Run `pnpm run test:run` — confirm existing hook tests pass
- [x] 2.5 Verify dev server starts without console warnings about missing `"use client"` directive