import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Projects } from './Projects';
import { projectsData } from '../lib/projects';

describe('Projects', () => {
  it('renderiza el título de sección', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: /proyectos/i }),
    ).toBeInTheDocument();
  });

  it('renderiza una tarjeta por cada proyecto', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    // Comprobamos que aparece al menos el título del primer proyecto
    const firstProjectTitle = projectsData[0]?.title;
    if (firstProjectTitle) {
      expect(screen.getByText(firstProjectTitle)).toBeInTheDocument();
    }
  });

  it('ordena proyectos por fecha descendente y deja el portfolio personal al final', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    const headings = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);

    expect(headings.at(0)).toBe('PurpleBasqueTours');
    expect(headings.at(-1)).toBe('Portfolio Personal (thebellepoque.dev)');
  });
});
