# Tasks: Fix Next.js pageExtensions InvariantError

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~10 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Rename Source Route Files

- [ ] 1.1 `git mv src/app/page.page.tsx src/app/page.tsx` — home page route
- [ ] 1.2 `git mv src/app/layout.page.tsx src/app/layout.tsx` — root layout
- [ ] 1.3 `git mv src/app/error.page.tsx src/app/error.tsx` — error boundary
- [ ] 1.4 `git mv src/app/not-found.page.tsx src/app/not-found.tsx` — 404 page
- [ ] 1.5 `git mv src/app/blog/page.page.tsx src/app/blog/page.tsx` — blog list
- [ ] 1.6 `git mv src/app/blog/[slug]/page.page.tsx src/app/blog/[slug]/page.tsx` — blog post
- [ ] 1.7 `git mv src/app/proyecto/[id]/page.page.tsx src/app/proyecto/[id]/page.tsx` — project detail

## Phase 2: Rename Test Files and Update Imports

- [ ] 2.1 Rename `src/app/page.page.test.tsx` → `src/app/page.test.tsx`; update import from `./page.page` to `./page`
- [ ] 2.2 Rename `src/app/layout.page.test.tsx` → `src/app/layout.test.tsx`; update import from `./layout.page` to `./layout`
- [ ] 2.3 Rename `src/app/error.page.test.tsx` → `src/app/error.test.tsx`; update import from `./error.page` to `./error`
- [ ] 2.4 Rename `src/app/not-found.page.test.tsx` → `src/app/not-found.test.tsx`; update import from `./not-found.page` to `./not-found`

## Phase 3: Configuration and Cleanup

- [ ] 3.1 Remove `pageExtensions: ['page.tsx', 'page.ts']` line from `next.config.ts` (lines 4-6 with comment)
- [ ] 3.2 Delete empty `src/pages/` directory
- [ ] 3.3 Delete `.next/` build cache

## Phase 4: Verification

- [ ] 4.1 Run `pnpm vitest run` — all 4 test files pass (imports resolve correctly)
- [ ] 4.2 Run `pnpm typecheck` — zero type errors
- [ ] 4.3 Run `pnpm build` — completes without InvariantError
- [ ] 4.4 Inspect `.next/server/app-paths-manifest.json` — all 5+ routes present
- [ ] 4.5 Run `pnpm dev` — starts without errors or "missing required error components" warnings