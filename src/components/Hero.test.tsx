import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renderiza nombre, handle y bio', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { name: /ione/i })).toBeInTheDocument();
    expect(screen.getByText('@thebellepoque')).toBeInTheDocument();
    expect(
      screen.getByText(/Full-stack Developer \| Automatizaciones/i),
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
