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

const observerCallbacks = new Set<IntersectionObserverCallback>();

function IntersectionObserverMock(
  this: { observe: () => void; unobserve: () => void; disconnect: () => void; takeRecords: () => IntersectionObserverEntry[] },
  callback: IntersectionObserverCallback,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options?: IntersectionObserverInit
) {
  observerCallbacks.add(callback);
  this.observe = vi.fn();
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
  this.takeRecords = vi.fn(() => []);
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});
