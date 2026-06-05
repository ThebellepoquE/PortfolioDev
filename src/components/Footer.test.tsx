import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { checkA11y } from '../test/a11y-utils';

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
  });});

describe('Footer a11y', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Footer />);
    const results = await checkA11y(container);
    expect(results).toHaveNoViolations();
  });

  it.skip('color contrast requires manual browser verification', async () => {
    // TODO: axe color-contrast rule doesn't work in jsdom, test manually in browser
  });
});

