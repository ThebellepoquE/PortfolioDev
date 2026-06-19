import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout.tsx';

describe('RootLayout', () => {
  it('renders children', () => {
    render(
      <RootLayout>
        <div data-testid="child">child content</div>
      </RootLayout>,
    );

    expect(screen.getByTestId('child')).toHaveTextContent('child content');
  });

  it('renders a skip link to the main content', () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>,
    );

    const skipLink = screen.getByRole('link', { name: /saltar al contenido principal/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders the footer', () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>,
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('sets the html lang to Spanish', () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>,
    );

    expect(document.documentElement).toHaveAttribute('lang', 'es');
  });
});
