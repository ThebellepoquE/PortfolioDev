# Tasks: axe-core-accessibility-testing

## Phase 1: Infrastructure ✅ (PR #8 - MERGED)

### 1.1 Add dependencies to package.json
**Files:** `package.json`
**Changes:**
- Add `"axe-core": "^4.12.0"` to devDependencies
- Add `"jsdom": "^29.1.1"` to devDependencies
- Add `"vitest-axe": "^0.1.0"` to devDependencies
- Keep `happy-dom` (will be replaced by jsdom)
**Verification:** `pnpm install` succeeds, no errors

### 1.2 Update vitest.config.ts
**Files:** `vitest.config.ts`
**Changes:**
```typescript
environment: 'jsdom',  // Changed from 'happy-dom'
```
**Verification:** `pnpm test -- --run` starts without environment errors

### 1.3 Update src/test/setup.ts
**Files:** `src/test/setup.ts`
**Changes:** Add after jest-dom import:
```typescript
import 'vitest-axe/extend-expect';
```
**Verification:** TypeScript compiles without errors

### 1.4 Create src/test/a11y-utils.ts
**Files:** `src/test/a11y-utils.ts` (NEW FILE)
**Content:**
```typescript
import { axe, type AxeResults } from 'vitest-axe';

export async function checkA11y(
  container: HTMLElement,
  options?: Parameters<typeof axe>[1]
): Promise<AxeResults> {
  return axe(container, {
    rules: {
      region: { enabled: false },
    },
    ...options,
  });
}
```
**Verification:** File exists, TypeScript compiles

### 1.5 VERIFICATION - Run tests
**Command:** `pnpm test -- --run`
**Expected:** All 74 tests pass
**If fails:** Rollback to happy-dom, investigate before proceeding

---

## Phase 2: Component Tests ✅ (PR #10)

### 2.1 Hero.test.tsx
Add accessibility describe block at end of file.

### 2.2 Projects.test.tsx
Add accessibility describe block at end of file.

### 2.3 Footer.test.tsx
Add accessibility describe block at end of file.

### 2.4 Contact.test.tsx
Add accessibility describe block at end of file.

### 2.5 SectionTitle.test.tsx
Add accessibility describe block at end of file.

### 2.6 ErrorBoundary.test.tsx
Add accessibility describe block at end of file.

### 2.7 ProjectCard.test.tsx (src/components/__tests__/)
Add accessibility describe block at end of file.

### 2.8 MetricBadge.test.tsx (src/components/__tests__/)
Add accessibility describe block at end of file.

### 2.9 BlogPost.test.tsx (src/components/Blog/__tests__/)
Add accessibility describe block at end of file.

### 2.10 BlogList.test.tsx (src/components/Blog/)
Add accessibility describe block at end of file.

---

## Phase 3: CI + Docs ✅ (PR #11)

### 3.1 Update README.md
Add accessibility testing section.

### 3.2 VERIFICATION - Final test run
**Command:** `pnpm test -- --run`
**Expected:** All tests pass (74+ original + 10 a11y blocks + skipped color-contrast tests)

---

## Rollback Plan

If Phase 1 verification fails:
1. Revert vitest.config.ts: `environment: 'happy-dom'`
2. Remove deps: `axe-core`, `jsdom`, `vitest-axe`
3. Revert setup.ts: remove `vitest-axe/extend-expect`
4. Delete a11y-utils.ts
5. Run `pnpm install && pnpm test -- --run`