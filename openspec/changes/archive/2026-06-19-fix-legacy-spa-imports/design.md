# Design: Fix Legacy SPA Imports

## Technical Approach

Delete 5 orphaned legacy SPA files whose functionality has been migrated to Next.js App Router (`src/app/`), and update 2 shared components still in active use to replace `react-router-dom` Link with `next/link`. This completes the migration by removing build-blocking imports of deleted dependencies (`react-router-dom`, `react-helmet-async`) while preserving components that App Router pages depend on.

## Architecture Decisions

### Decision: Delete orphaned SPA files

**Choice**: Delete `BlogPage.tsx`, `BlogPostPage.tsx`, `HomePage.tsx`, `BlogPost.tsx`, and `SEO.tsx`  
**Alternatives considered**: Keep files but remove imports (rejected: creates dead code)  
**Rationale**: These files are superseded by App Router pages in `src/app/`. `SEO.tsx` uses `react-helmet-async` which is no longer in `package.json`. App Router uses `generateMetadata()` instead. Keeping them causes build failures with no benefit.

### Decision: Update shared components in-place

**Choice**: Modify `BlogList.tsx` and `ProjectCard.tsx` to use `next/link`  
**Alternatives considered**: Create new Next.js-specific versions (rejected: unnecessary duplication)  
**Rationale**: These components are imported by App Router pages. Updating them preserves their functionality while removing the `react-router-dom` dependency. The API change is minimal: `to` prop → `href` prop.

### Decision: Verify Projects.tsx is clean

**Choice**: Grep-verify no `useNavigate` or `react-router-dom` imports exist  
**Alternatives considered**: Blindly trust it's clean (rejected: proposal requires explicit verification)  
**Rationale**: Confirms the component is safe to keep and won't cause build failures.

## Data Flow

Not applicable. This change removes files and updates imports; no data flow changes.

## File Changes

### Deletions (5 files)

| File | Lines | Reason |
|------|-------|--------|
| `src/pages/BlogPage.tsx` | 39 | Replaced by `src/app/blog/page.tsx`. Imports `SEO` (deleted) and `BlogList` (kept). |
| `src/pages/BlogPostPage.tsx` | 6 | Replaced by `src/app/blog/[slug]/page.tsx`. Wrapper for `BlogPost` (deleted). |
| `src/pages/HomePage.tsx` | 40 | Replaced by `src/app/page.tsx`. Imports `SEO` (deleted). |
| `src/components/Blog/BlogPost.tsx` | 129 | Functionality integrated into `src/app/blog/[slug]/page.tsx`. Imports `useParams`, `Link` from `react-router-dom`, and `SEO` (deleted). |
| `src/components/SEO.tsx` | 109 | Replaced by Next.js `generateMetadata()`. Imports `Helmet` from `react-helmet-async` (removed from `package.json`). |

### Modifications (2 files)

#### `src/components/Blog/BlogList.tsx`

**Line 1**: Replace import  
```diff
- import { Link } from 'react-router-dom';
+ import Link from 'next/link';
```

**Line 52**: Replace `to` prop with `href`  
```diff
- to={`/blog/${post.slug}`}
+ href={`/blog/${post.slug}`}
```

**Verification**: After changes, grep for `react-router-dom` in this file returns zero matches. Confirm `next/link` import resolves correctly.

#### `src/components/ProjectCard.tsx`

**Line 1**: Replace import  
```diff
- import { Link } from 'react-router-dom';
+ import Link from 'next/link';
```

**Line 54**: Replace `to` prop with `href`  
```diff
- to={`/proyecto/${project.id}`}
+ href={`/proyecto/${project.id}`}
```

**Verification**: After changes, grep for `react-router-dom` in this file returns zero matches. Confirm `next/link` import resolves correctly.

### Verification (1 file)

#### `src/components/Projects.tsx`

**Action**: Grep-verify no `useNavigate` or `react-router-dom` imports exist.  
**Expected result**: Zero matches for both patterns.  
**Current state**: Already clean (confirmed via grep). No changes needed.

## Interfaces / Contracts

Not applicable. No new interfaces or contracts introduced.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | `next build` succeeds | Run build command; verify zero `Module not found` errors for `react-router-dom` or `react-helmet-async` |
| Grep | Zero residual imports | `grep -r "react-router-dom\|react-helmet-async\|useNavigate\|Helmet" src/` returns zero matches in non-test files |
| Deploy | Vercel deploy succeeds | Push to Vercel; verify production build completes without errors |

**Note**: Test files (`.test.tsx`) may still import `react-router-dom` for mocking. These are out of scope per the proposal ("Test file wrapper cleanup (separate concern)").

## Migration / Rollout

No migration required. This is a destructive change (file deletions) with no data transformation.

**Rollback**: `git revert` restores all deleted files and original imports. Zero data loss.

**Execution order**:
1. Delete 5 files
2. Modify `BlogList.tsx` (2 changes)
3. Modify `ProjectCard.tsx` (2 changes)
4. Verify `Projects.tsx` is clean
5. Run `next build` to confirm zero errors
6. Grep-verify zero residual `react-router-dom` / `react-helmet-async` imports in `src/`

## Open Questions

None. The proposal clearly defines scope, approach, and success criteria.

## Verification Criteria

After implementation, all of the following must be true:

- [ ] `next build` completes without `Module not found` errors
- [ ] Zero `react-router-dom` imports in `src/` (excluding test files)
- [ ] Zero `react-helmet-async` imports in `src/` (excluding test files)
- [ ] Zero `useNavigate` calls in `src/` (excluding test files)
- [ ] Zero `Helmet` usage in `src/` (excluding test files)
- [ ] `BlogList.tsx` imports `Link` from `next/link` and uses `href` prop
- [ ] `ProjectCard.tsx` imports `Link` from `next/link` and uses `href` prop
- [ ] `Projects.tsx` has no `useNavigate` or `react-router-dom` imports
- [ ] Vercel deploy succeeds
