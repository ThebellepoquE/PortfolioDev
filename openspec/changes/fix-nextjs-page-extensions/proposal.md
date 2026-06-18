# Proposal: Fix Next.js pageExtensions InvariantError

## Intent

Fix the runtime `InvariantError: Expected clientReferenceManifest to be defined` in Next.js 15.5.19.

**Problem**: The app fails to start with `InvariantError: Expected clientReferenceManifest to be defined.` Only 2 of 5+ routes appear in `app-paths-manifest.json`, breaking runtime routing.

**Root Cause**: `next.config.ts` defines `pageExtensions: ['page.tsx', 'page.ts']` as a workaround to prevent Next.js from treating legacy Vite SPA files in `src/pages/` as Pages Router routes. This workaround is now harmful:
1. `src/pages/` is empty (all pages migrated to App Router)
2. The custom `pageExtensions` triggers a Next.js 15.5.x regression ([GitHub issue #93862](https://github.com/vercel/next.js/issues/93862)) that breaks manifest generation
3. Files like `loading.tsx` don't follow the `.page.` convention, so Next.js doesn't recognize them

## Scope

### In Scope
- Remove `pageExtensions` from `next.config.ts`
- Rename 7 `.page.tsx` route files to standard naming (e.g., `page.page.tsx` → `page.tsx`)
- Rename 4 `.page.test.tsx` test files and update imports
- Delete empty `src/pages/` directory
- Clear `.next/` cache

### Out of Scope
- Route logic, component code, or metadata changes
- URL structure changes (all routes remain identical)

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `nextjs-static-routing`: File naming changes from `.page.tsx` to standard `.tsx`

## Approach

**Remove the workaround**: Delete `pageExtensions` from `next.config.ts`. This eliminates the regression trigger since `src/pages/` is empty.

**Rename files via `git mv`**: Rename 11 files (7 source + 4 test) using `git mv`. No imports reference `.page.tsx`, so renaming is safe. Update 4 test imports from `./page.page` to `./page`.

**Atomic execution**: Single commit. Zero logic changes.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `next.config.ts` | Modified | Remove `pageExtensions` key |
| `src/app/**/*.page.tsx` | Renamed | 7 route files to standard naming |
| `src/app/**/*.page.test.tsx` | Renamed | 4 test files + import updates |
| `src/pages/` | Deleted | Empty directory |
| `.next/` | Deleted | Stale cache |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `src/pages/` has legacy files | Low | Verified empty via glob |
| Import paths break | Low | No imports reference `.page.tsx` |
| Stale cache | Med | Delete `.next/` before rebuild |

## Rollback Plan

`git revert` restores `pageExtensions` config and original file names. Zero data or logic changes.

## Dependencies

None

## Success Criteria

- [ ] `next dev` starts without InvariantError
- [ ] `next build` completes successfully
- [ ] All 4 routes return 200
- [ ] `app-paths-manifest.json` contains all route entries (5+)
- [ ] No "missing required error components" warnings
- [ ] All tests pass: `pnpm vitest run`
- [ ] Lint and typecheck pass
