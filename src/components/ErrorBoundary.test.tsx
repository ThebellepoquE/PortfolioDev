import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';

import { ErrorBoundary } from './ErrorBoundary';

function BrokenChild(): ReactElement {
  throw new Error('Test error');
}

describe('ErrorBoundary - Enlace semántico', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('muestra fallback UI cuando un hijo lanza un error', () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/algo se ha roto/i)).toBeInTheDocument();
  });

  it('usa un <a> (role="link") y NO un <button> para volver al inicio', () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );

    const link = screen.getByRole('link', { name: /volver al inicio/i });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/');

    const buttons = screen.queryAllByRole('button', { name: /volver al inicio/i });
    expect(buttons).toHaveLength(0);
  });
});

describe('404 Page - Enlace semántico', () => {
  it('usa <Link> (renderiza <a>) y NO un <button> para volver al inicio', async () => {
    const { default: App } = await import('../App');

    render(
      <MemoryRouter initialEntries={['/ruta-que-no-existe']}>
        <App />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /volver al inicio/i });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/');

    const buttons = screen.queryAllByRole('button', { name: /volver al inicio/i });
    expect(buttons).toHaveLength(0);
  });
});
