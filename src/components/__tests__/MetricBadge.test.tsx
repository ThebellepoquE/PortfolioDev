import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricBadge } from '../MetricBadge';
import type { ProjectMetric } from '../../types/project';

function buildMetric(overrides: Partial<ProjectMetric> = {}): ProjectMetric {
  return {
    id: 'm1',
    type: 'users',
    value: '10k',
    label: 'Usuarios',
    ...overrides,
  };
}

describe('MetricBadge', () => {
  describe('Renderizado', () => {
    it('muestra value y label de la métrica', () => {
      const metric = buildMetric({ value: '99%', label: 'Uptime' });
      render(<MetricBadge metric={metric} />);

      expect(screen.getByText('99%')).toBeInTheDocument();
      expect(screen.getByText('Uptime')).toBeInTheDocument();
    });

    it('no renderiza label cuando viene vacío', () => {
      const metric = buildMetric({ label: '' });
      render(<MetricBadge metric={metric} />);

      expect(screen.getByText('10k')).toBeInTheDocument();
      expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
    });

    it('usa description como tooltip cuando está definida', () => {
      const metric = buildMetric({
        value: '5',
        label: 'Reviews',
        description: 'Promedio de valoraciones',
      });
      render(<MetricBadge metric={metric} />);

      const badge = screen.getByTitle('Promedio de valoraciones');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('data-tooltip', 'Promedio de valoraciones');
    });

    it('usa "label: value" como tooltip cuando no hay description', () => {
      const metric = buildMetric({ value: '10k', label: 'Usuarios' });
      render(<MetricBadge metric={metric} />);

      expect(screen.getByTitle('Usuarios: 10k')).toBeInTheDocument();
    });
  });

  describe('Modificador de color', () => {
    it('aplica clase por defecto --pink cuando no se pasa colorModifier', () => {
      const metric = buildMetric();
      render(<MetricBadge metric={metric} />);

      const badge = screen.getByText('10k').closest('.metric-badge');
      expect(badge).toHaveClass('metric-badge--pink');
    });

    it('aplica clase --yellow cuando colorModifier es --yellow', () => {
      const metric = buildMetric();
      render(<MetricBadge metric={metric} colorModifier="--yellow" />);

      const badge = screen.getByText('10k').closest('.metric-badge');
      expect(badge).toHaveClass('metric-badge--yellow');
    });

    it('aplica clase --green cuando colorModifier es --green', () => {
      const metric = buildMetric();
      render(<MetricBadge metric={metric} colorModifier="--green" />);

      const badge = screen.getByText('10k').closest('.metric-badge');
      expect(badge).toHaveClass('metric-badge--green');
    });
  });

  describe('Accesibilidad', () => {
    it('tiene tabIndex 0 para navegación por teclado', () => {
      const metric = buildMetric();
      render(<MetricBadge metric={metric} />);

      const badge = screen.getByTitle('Usuarios: 10k');
      expect(badge).toHaveAttribute('tabIndex', '0');
    });
  });
});
