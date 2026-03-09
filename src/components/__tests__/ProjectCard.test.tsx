import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectCard } from '../ProjectCard';
import type { Project } from '../../types/project';

/** Proyecto mínimo válido para tests */
function buildProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'test-project',
    title: 'Proyecto Test',
    tagline: 'Tagline',
    shortDescription: 'Descripción corta del proyecto.',
    fullDescription: 'Descripción larga.',
    complexity: 0,
    innovation: 0,
    impact: 0,
    technologies: ['React', 'TypeScript'],
    image: '/img.webp',
    metrics: [],
    links: [
      { type: 'live', url: 'https://example.com', title: 'Ver demo', isPrimary: true },
    ],
    challenges: [],
    featured: false,
    date: '2025-01',
    role: 'Developer',
    ...overrides,
  };
}

function renderProjectCard(project: Project) {
  return render(
    <MemoryRouter>
      <ProjectCard project={project} />
    </MemoryRouter>,
  );
}

describe('ProjectCard', () => {
  describe('Renderizado básico', () => {
    it('muestra título y descripción del proyecto', () => {
      const project = buildProject({ title: 'Mi App', shortDescription: 'Una app increíble.' });
      renderProjectCard(project);

      expect(screen.getByRole('heading', { name: 'Mi App' })).toBeInTheDocument();
      expect(screen.getByText('Una app increíble.')).toBeInTheDocument();
    });

    it('muestra las tecnologías del stack', () => {
      const project = buildProject({ technologies: ['React', 'Node', 'Postgres'] });
      renderProjectCard(project);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node')).toBeInTheDocument();
      expect(screen.getByText('Postgres')).toBeInTheDocument();
    });

    it('no muestra badge cuando no es destacado ni wip', () => {
      const project = buildProject({ featured: false });
      renderProjectCard(project);

      expect(screen.queryByLabelText(/destacado/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/en construcción/i)).not.toBeInTheDocument();
    });
  });

  describe('Badge "En construcción"', () => {
    it('muestra badge "En construcción" cuando status es wip', () => {
      const project = buildProject({ status: 'wip' });
      renderProjectCard(project);

      const badge = screen.getByLabelText('Proyecto en construcción');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('En construcción');
      expect(badge).toHaveClass('project-card__featured', 'project-card__featured--wip');
    });

    it('no muestra badge destacado cuando es wip aunque featured sea true', () => {
      const project = buildProject({ status: 'wip', featured: true });
      renderProjectCard(project);

      expect(screen.getByLabelText('Proyecto en construcción')).toBeInTheDocument();
      expect(screen.queryByLabelText('Proyecto destacado')).not.toBeInTheDocument();
    });
  });

  describe('Badge "Destacado"', () => {
    it('muestra badge "Destacado" cuando featured es true y no es wip', () => {
      const project = buildProject({ featured: true });
      renderProjectCard(project);

      const badge = screen.getByLabelText('Proyecto destacado');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Destacado');
    });

    it('no muestra badge destacado cuando status es wip', () => {
      const project = buildProject({ featured: true, status: 'wip' });
      renderProjectCard(project);

      expect(screen.queryByLabelText('Proyecto destacado')).not.toBeInTheDocument();
    });
  });

  describe('Enlaces', () => {
    it('incluye enlace interno a la página del proyecto', () => {
      const project = buildProject({ id: 'discografica' });
      renderProjectCard(project);

      const link = screen.getByRole('link', { name: /ver caso de estudio/i });
      expect(link).toHaveAttribute('href', '/proyecto/discografica');
    });

    it('incluye enlaces externos con href, target y rel correctos', () => {
      const project = buildProject({
        links: [
          { type: 'live', url: 'https://app.com', title: 'Ver app', isPrimary: true },
          { type: 'github', url: 'https://github.com/repo', title: 'Código', isPrimary: false },
        ],
      });
      renderProjectCard(project);

      const verApp = screen.getByRole('link', { name: 'Ver app' });
      expect(verApp).toHaveAttribute('href', 'https://app.com');
      expect(verApp).toHaveAttribute('target', '_blank');
      expect(verApp).toHaveAttribute('rel', 'noopener noreferrer');

      const codigo = screen.getByRole('link', { name: 'Código' });
      expect(codigo).toHaveAttribute('href', 'https://github.com/repo');
      expect(codigo).toHaveAttribute('target', '_blank');
    });

    it('aplica clase primary al enlace con isPrimary', () => {
      const project = buildProject({
        links: [
          { type: 'live', url: 'https://x.com', title: 'Principal', isPrimary: true },
        ],
      });
      renderProjectCard(project);

      const link = screen.getByRole('link', { name: 'Principal' });
      expect(link).toHaveClass('project-card__link--primary');
    });
  });

  describe('Métricas', () => {
    it('muestra como máximo 3 métricas', () => {
      const project = buildProject({
        metrics: [
          { id: '1', type: 'users', value: '10k', label: 'Usuarios' },
          { id: '2', type: 'performance', value: '99%', label: 'Uptime' },
          { id: '3', type: 'business', value: '+20%', label: 'Ventas' },
          { id: '4', type: 'technical', value: '5', label: 'Extra' },
        ],
      });
      renderProjectCard(project);

      const list = screen.getByRole('list', { name: 'Métricas del proyecto' });
      expect(list).toBeInTheDocument();
      const items = list.querySelectorAll('[role="listitem"]');
      expect(items).toHaveLength(3);
      expect(screen.getByText('10k')).toBeInTheDocument();
      expect(screen.getByText('99%')).toBeInTheDocument();
      expect(screen.getByText('+20%')).toBeInTheDocument();
      expect(screen.queryByText('5')).not.toBeInTheDocument();
    });

    it('no renderiza bloque de métricas cuando no hay métricas', () => {
      const project = buildProject({ metrics: [] });
      renderProjectCard(project);

      expect(screen.queryByRole('list', { name: 'Métricas del proyecto' })).not.toBeInTheDocument();
    });
  });
});
