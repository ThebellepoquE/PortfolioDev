import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import { checkA11y } from '../test/a11y-utils';

describe('Hero', () => {
  it('renderiza nombre, handle y bio', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { name: /ione/i })).toBeInTheDocument();
    expect(screen.getByText('@thebellepoque')).toBeInTheDocument();
    expect(
      screen.getByText(/Desarrolladora Web.*Formación Full-stack/i),
    ).toBeInTheDocument();
  });

  it('incluye enlaces a GitHub y LinkedIn con aria-label accesible', () => {
    render(<Hero />);

    // Los enlaces usan contenido visible solo para lectores de pantalla (span.sr-only)
    // así que los consultamos por su nombre accesible (texto) y rol "link"
    expect(
      screen.getByRole('link', { name: /perfil de github/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /perfil de linkedin/i }),
    ).toBeInTheDocument();
  });
});

describe('Hero a11y', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Hero />);
    const results = await checkA11y(container);
    expect(results).toHaveNoViolations();
  });

  it.skip('color contrast requires manual browser verification', async () => {
    // TODO: axe color-contrast rule doesn't work in jsdom, test manually in browser
  });
});
