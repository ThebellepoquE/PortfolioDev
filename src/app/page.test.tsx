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

    const blogLinks = screen.getAllByRole('link', { name: /blog/i });
    expect(blogLinks.length).toBeGreaterThan(0);
    blogLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/blog');
    });
  });
});
