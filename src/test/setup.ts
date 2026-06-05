import '@testing-library/jest-dom';
import { afterEach, expect, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
// vitest-axe: matchers.d.ts uses export type *, bypass for verbatimModuleSyntax
// types provided by src/test/axe-matchers.d.ts
import { toHaveNoViolations } from 'vitest-axe/dist/matchers.js';

expect.extend({ toHaveNoViolations });

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
