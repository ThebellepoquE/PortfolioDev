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