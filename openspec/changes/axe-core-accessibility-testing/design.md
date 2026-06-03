# Design: axe-core-accessibility-testing

## Overview

Complete jsdom migration + vitest-axe integration for automated WCAG 2.1 AA accessibility testing.

## Files Summary

| File | Action |
|------|--------|
| `package.json` | Modify - add deps |
| `vitest.config.ts` | Modify - change environment to jsdom |
| `src/test/setup.ts` | Modify - add vitest-axe import |
| `src/test/a11y-utils.ts` | Create - axe utility |
| `src/components/*.test.tsx` (10 files) | Modify - add a11y tests |
| `README.md` | Modify - add docs |

---

## 1. vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',  // Changed from 'happy-dom'
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/components/**/*.tsx'],
      exclude: ['src/test/**', '**/*.d.ts'],
    },
  },
});
```

---

## 2. src/test/setup.ts

```typescript
import '@testing-library/jest-dom';
import 'vitest-axe/extend-expect';  // ADD THIS LINE
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

---

## 3. src/test/a11y-utils.ts (NEW FILE)

```typescript
import { axe, type AxeResults } from 'vitest-axe';

/**
 * Run axe accessibility check on a container element.
 * Region rule disabled to avoid false positives in isolated component tests.
 */
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

---

## 4. Hero.test.tsx - Add accessibility tests

Add at end of file:

```typescript
describe('accessibility', () => {
  it('should have no accessibility violations', async () => {
    render(<Hero />);
    const results = await checkA11y(document.body);
    expect(results).toHaveNoViolations();
  });

  it.skip('color contrast requires manual browser verification', async () => {
    // TODO: axe color-contrast rule doesn't work in jsdom, test manually in browser
    // Ref: https://github.com/dequelabs/axe-core/issues/4201
  });
});
```

---

## 5. Contact.test.tsx - Add accessibility tests

```typescript
describe('accessibility', () => {
  it('should have no accessibility violations', async () => {
    render(<Contact />);
    const results = await checkA11y(document.body);
    expect(results).toHaveNoViolations();
  });

  it.skip('color contrast requires manual browser verification', async () => {
    // TODO: axe color-contrast rule doesn't work in jsdom, test manually in browser
  });
});
```

---

## 6. CI Workflow Changes

**No changes needed** - the same `pnpm test -- --run` command runs unit + a11y tests. CI already blocks on test failures.

---

## 7. Rollback Plan

1. Revert `vitest.config.ts`: `environment: 'happy-dom'`
2. Remove from `package.json`: `axe-core`, `jsdom`, `vitest-axe`
3. Revert `src/test/setup.ts`: remove `vitest-axe/extend-expect` import
4. Delete `src/test/a11y-utils.ts`
5. Run `pnpm install && pnpm test -- --run`

---

## 8. README.md Section to Add

```markdown
## Accessibility Testing

Automated accessibility testing is integrated into the test suite using [axe-core](https://github.com/dequelabs/axe-core).

### Running Tests
```bash
pnpm test -- --run
```

### Limitations

The `color-contrast` rule cannot be fully tested in jsdom environment. These checks must be verified manually in a real browser:
- Run the app locally with `pnpm dev`
- Use browser DevTools accessibility auditor
- Test with keyboard navigation

### CI Gate

All PRs must pass accessibility tests. The CI pipeline runs `pnpm test -- --run` which includes a11y checks.
```