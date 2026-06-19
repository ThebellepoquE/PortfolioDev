import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './not-found.tsx';

describe('NotFound', () => {
  it('renders a 404 heading', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
  });

  it('renders a link back to home', () => {
    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /volver al inicio/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
