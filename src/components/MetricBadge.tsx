import type { ProjectMetric } from '../types/project';

interface MetricBadgeProps {
  metric: ProjectMetric;
  /** Modificador de color BEM (--pink, --yellow, --green) */
  colorModifier?: '--pink' | '--yellow' | '--green';
}

/** Badge de métrica con tooltip accesible (hover muestra description) */
export function MetricBadge({ metric, colorModifier = '--pink' }: MetricBadgeProps) {
  const tooltipText = metric.description ?? `${metric.label}: ${metric.value}`;

  return (
    <span
      className={`metric-badge metric-badge${colorModifier}`}
      tabIndex={0}
      title={tooltipText}
      data-tooltip={tooltipText}
    >
      <span className="metric-badge__value">{metric.value}</span>
      {metric.label && (
        <span className="metric-badge__label">{metric.label}</span>
      )}
    </span>
  );
}
