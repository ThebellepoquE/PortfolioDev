# Proposal: Fix useInView Client Directive

## Intent

Fix build failure caused by `useInView.ts` importing React hooks (`useEffect`, `useRef`, `useState`) without the `"use client"` directive. Next.js App Router requires any file using React hooks to be explicitly marked as a Client Component. Without this directive, the build fails with: "You're importing a component that needs `useEffect`. This React Hook only works in a Client Component."

## Scope

### In Scope
- Add `"use client"` directive to `src/hooks/useInView.ts`
- Verify build passes after the fix

### Out of Scope
- Refactoring the hook's implementation
- Auditing other hooks or components for missing directives (separate concern)
- Changing the hook's behavior or API

## Capabilities

### New Capabilities
None

### Modified Capabilities
None

## Approach

Add `"use client"` as the first line of `src/hooks/useInView.ts`. This is the standard Next.js mechanism for marking Client Components, as documented in the official Next.js documentation. The hook uses React hooks (`useEffect`, `useRef`, `useState`) and `IntersectionObserver` (browser API), which are inherently client-side. Marking it as a Client Component is not optional—it's a requirement.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/useInView.ts` | Modified | Add `"use client"` directive as first line |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| None identified | N/A | This is a standard Next.js pattern with zero downside |

## Rollback Plan

Revert the commit or remove the `"use client"` line. However, this would restore the build failure, so rollback is only viable if an alternative fix is implemented.

## Dependencies

None

## Success Criteria

- [ ] Build completes without errors
- [ ] All tests pass (`pnpm run test:run`)
- [ ] Lint passes (`pnpm run lint`)
- [ ] Type check passes (`pnpm run typecheck`)
- [ ] The hook continues to function identically (no behavior change)
