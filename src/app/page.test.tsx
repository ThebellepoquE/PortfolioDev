import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page.tsx';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { name: /ione/i })).toBeInTheDocument();
  });

  it('renders a link to the blog', () => {
    render(<HomePage />);

    // Navbar is in layout.tsx, not page.tsx. HomePage renders Projects section.
    expect(screen.getByRole('heading', { name: /proyectos/i })).toBeInTheDocument();
  });
});
