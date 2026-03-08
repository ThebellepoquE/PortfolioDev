import { Link } from 'react-router-dom';
import type { Project } from '../types/project';
import { MetricBadge } from './MetricBadge';

interface ProjectCardProps {
  project: Project;
}

/** Tarjeta de proyecto con diseño fluorescente, métricas y enlaces */
export function ProjectCard({ project }: ProjectCardProps) {
  const { title, shortDescription, technologies, metrics, links, featured, status } = project;
  const metricsToShow = metrics.slice(0, 3);
  const colorModifiers = ['--pink', '--yellow', '--green'] as const;

  return (
    <div className="project-card">
      <div className="project-card__content">
        {/* Badge en construcción */}
        {status === 'wip' && (
          <span className="project-card__featured project-card__featured--wip" aria-label="Proyecto en construcción">
            En construcción
          </span>
        )}
        {/* Badge destacado (si no es wip) */}
        {featured && status !== 'wip' && (
          <span className="project-card__featured" aria-label="Proyecto destacado">
            Destacado
          </span>
        )}

        {/* Título */}
        <h3 className="project-card__title title-neon">{title}</h3>

        {/* Descripción */}
        <p className="project-card__description">{shortDescription}</p>

        {/* Métricas (primeras 3) */}
        {metricsToShow.length > 0 && (
          <div className="project-card__metrics" role="list" aria-label="Métricas del proyecto">
            {metricsToShow.map((metric, index) => (
              <div key={metric.id} role="listitem">
                <MetricBadge
                  metric={metric}
                  colorModifier={colorModifiers[index % 3]}
                />
              </div>
            ))}
          </div>
        )}

        {/* Enlace a página de detalle / caso de estudio */}
        <div className="project-card__actions">
          <Link
            to={`/proyecto/${project.id}`}
            className="project-card__details-link"
          >
            Ver caso de estudio →
          </Link>
        </div>

        {/* Stack técnico */}
        <div className="project-card__stack">
          {technologies.map((tech, index) => {
            const modifier = colorModifiers[index % 3];
            return (
              <span
                key={tech}
                className={`project-card__tech project-card__tech${modifier}`}
              >
                {tech}
              </span>
            );
          })}
        </div>

        {/* Enlaces: primario primero, luego el resto */}
        <div className="project-card__links">
          {links.map((link) => (
            <a
              key={`${link.type}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`project-card__link ${link.isPrimary ? 'project-card__link--primary' : 'project-card__link--secondary'}`}
              aria-label={link.title}
            >
              {link.title} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
