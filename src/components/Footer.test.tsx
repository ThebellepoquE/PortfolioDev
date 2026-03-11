import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renderiza el texto principal con el año actual', () => {
    render(<Footer />);

    const year = new Date().getFullYear().toString();
    const text = screen.getByText((content) =>
      content.includes('Hecho con mucha Luz') && content.includes(year),
    );

    expect(text).toBeInTheDocument();
  });

  it('incluye enlace a GitHub con aria-label', () => {
    render(<Footer />);

    const githubLink = screen.getByLabelText(/github/i);
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href');
  });
});

