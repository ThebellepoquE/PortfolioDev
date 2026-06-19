# Proposal: Fix Legacy SPA Imports

## Intent

Fix Vercel build errors (`Module not found: Can't resolve 'react-router-dom'` / `'react-helmet-async'`). The Next.js migration removed these dependencies from `package.json` but left source files importing them. App Router replacements already exist in `src/app/`. This change deletes orphaned legacy SPA files and updates the few shared components still in use to use Next.js primitives, completing the migration and unblocking the build.

## Scope

### In Scope
- Delete 4 legacy SPA files with App Router replacements: `HomePage.tsx`, `BlogPage.tsx`, `BlogPostPage.tsx`, `SEO.tsx`
- Delete 1 legacy SPA component superseded by App Router integration: `BlogPost.tsx`
- Replace `Link` from `react-router-dom` with `Link` from `next/link` in: `BlogList.tsx`, `ProjectCard.tsx`
- Verify `Projects.tsx` has no `react-router-dom` or `useNavigate` imports (already clean)
- Confirm zero remaining `useNavigate` and `Helmet` usage across source

### Out of Scope
- Route logic or metadata changes (already in `src/app/`)
- Test file wrapper cleanup (separate concern)
- Other migration tasks (API routes, image optimization)

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `nextjs-static-routing`: Remove legacy SPA files conflicting with App Router build
- `seo-perf-improvements`: Delete `SEO.tsx` (superseded by `generateMetadata()`)

## Approach

Delete orphaned files whose functionality now lives in App Router pages. Update the two shared components (`BlogList`, `ProjectCard`) still actively imported by App Router pages to use `next/link`. Verify `Projects.tsx` is clean. Grep-confirm zero residual `useNavigate` / `Helmet` imports in source.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/HomePage.tsx` | Deleted | Replaced by `src/app/page.tsx` |
| `src/pages/BlogPage.tsx` | Deleted | Replaced by `src/app/blog/page.tsx` |
| `src/pages/BlogPostPage.tsx` | Deleted | Replaced by `src/app/blog/[slug]/page.tsx` |
| `src/components/SEO.tsx` | Deleted | Replaced by Next.js `generateMetadata()` |
| `src/components/Blog/BlogPost.tsx` | Deleted | Functionality integrated into App Router pages |
| `src/components/Blog/BlogList.tsx` | Modified | `Link` from `react-router-dom` → `next/link` |
| `src/components/ProjectCard.tsx` | Modified | `Link` from `react-router-dom` → `next/link` |
| `src/components/Projects.tsx` | Verified | Confirm no `useNavigate` or `react-router-dom` imports |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| App Router page imports a deleted file | Low | Grep confirms only `BlogList` and `ProjectCard` are imported by App Router pages; deleted files are not |
| `BlogList` or `ProjectCard` `Link` API mismatch | Low | `next/link` uses `href` prop (same as `react-router-dom` `Link`); verify no `to` prop usage |
| Residual imports in non-obvious files | Low | Full grep for `react-router-dom` and `react-helmet-async` after changes |

## Rollback Plan

`git revert` restores all deleted files and original imports. Zero data loss.

## Dependencies

- `react-router-dom` and `react-helmet-async` already removed from `package.json`
- App Router pages exist in `src/app/` (from `migrate-to-nextjs`)

## Success Criteria

- [ ] `next build` completes without `Module not found` errors
- [ ] Zero `react-router-dom` imports in `src/`
- [ ] Zero `react-helmet-async` imports in `src/`
- [ ] Zero `useNavigate` calls in `src/`
- [ ] Zero `Helmet` usage in `src/`
- [ ] Vercel deploy succeeds
