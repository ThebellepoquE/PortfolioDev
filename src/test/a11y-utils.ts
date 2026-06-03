import { axe } from 'vitest-axe';
import type { AxeResults } from 'axe-core';

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