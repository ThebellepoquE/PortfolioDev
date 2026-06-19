# Tasks: Fix Legacy SPA Imports

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~180-200 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Delete Orphaned SPA Files

- [x] 1.1 Delete `src/pages/HomePage.tsx` — replaced by `src/app/page.tsx`
- [x] 1.2 Delete `src/pages/BlogPage.tsx` — replaced by `src/app/blog/page.tsx`
- [x] 1.3 Delete `src/pages/BlogPostPage.tsx` — replaced by `src/app/blog/[slug]/page.tsx`
- [x] 1.4 Delete `src/components/Blog/BlogPost.tsx` — functionality in blog slug page
- [x] 1.5 Delete `src/components/SEO.tsx` — replaced by Next.js `generateMetadata()`

**AC**: After deletion, each file path returns "No such file or directory". No imports from App Router pages reference these files.

## Phase 2: Update Shared Components to next/link

- [x] 2.1 In `src/components/Blog/BlogList.tsx`: replace `import { Link } from 'react-router-dom'` with `import Link from 'next/link'` (line 1)
- [x] 2.2 In `src/components/Blog/BlogList.tsx`: replace `to={`/blog/${post.slug}`}` with `href={`/blog/${post.slug}`}` (line 52)
- [x] 2.3 In `src/components/ProjectCard.tsx`: replace `import { Link } from 'react-router-dom'` with `import Link from 'next/link'` (line 1)
- [x] 2.4 In `src/components/ProjectCard.tsx`: replace `to={`/proyecto/${project.id}`}` with `href={`/proyecto/${project.id}`}` (line 54)

**AC**: Both files import `Link` from `next/link` (named default), use `href` prop. Grep for `react-router-dom` returns zero matches in these files.

## Phase 3: Verification

- [x] 3.1 Verify `src/components/Projects.tsx` has no `useNavigate` or `react-router-dom` imports (grep: zero matches)
- [x] 3.2 Full-source grep: `rg -n "react-router-dom" --include="*.tsx" --include="*.ts" src/` — zero matches outside `*.test.tsx` and `test-utils.*` files
- [x] 3.3 Full-source grep: `rg -n "react-helmet-async" --include="*.tsx" --include="*.ts" src/` — zero matches outside test files
- [x] 3.4 Full-source grep: `rg -n "useNavigate|Helmet" --include="*.tsx" --include="*.ts" src/` — zero matches outside test files
- [x] 3.5 Run `next build` — completes without `Module not found` errors for `react-router-dom` or `react-helmet-async`

**AC**: All grep queries return zero matches in `src/` (test files excluded). `next build` exits with code 0.

## Verification Steps (executor checklist)

```
# Delete verification
ls src/pages/HomePage.tsx src/pages/BlogPage.tsx src/pages/BlogPostPage.tsx
ls src/components/Blog/BlogPost.tsx src/components/SEO.tsx
# → each returns: ls: cannot access ... No such file or directory

# Import verification
rg '"react-router-dom"' src/ --include '*.tsx' --include '*.ts'
rg '"react-helmet-async"' src/ --include '*.tsx' --include '*.ts'
rg 'useNavigate' src/ --include '*.tsx' --include '*.ts'
rg 'Helmet' src/ --include '*.tsx' --include '*.ts'
# → zero matches in non-test files

# Link prop verification
rg '<Link' src/components/Blog/BlogList.tsx src/components/ProjectCard.tsx
# → all instances use href= not to=

# Build verification
pnpm next build
# → zero Module not found errors
```

**Note**: Test files (`*.test.tsx`) may retain `react-router-dom`/`react-helmet-async` imports — these are out of scope per proposal ("Test file wrapper cleanup (separate concern)").