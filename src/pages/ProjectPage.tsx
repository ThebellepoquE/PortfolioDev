import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsData } from '../lib/projects';
import { formatDateDayMonthYear } from '../lib/formatDate';
import { SEO } from '../components/SEO';

/** Convierte YYYY-MM a ISO 8601 (YYYY-MM-01) para meta y <time dateTime>. */
function toISODate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01`;
  return value;
}

function highlightCaseStudy(text: string): ReactNode {
  const tokens = text.split(/(Problema:|Solución:|Resultado:)/);

  return (
    <>
      {tokens.map((part, index) => {
        if (part === 'Problema:' || part === 'Solución:' || part === 'Resultado:') {
          return (
            <span key={`kw-${index}`} className="project-page__keyword">
              {part}
            </span>
          );
        }
        return <span key={`txt-${index}`}>{part}</span>;
      })}
    </>
  );
}

/** Página de detalle de proyecto con SEO específico */
export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const project = useMemo(
    () => projectsData.find((p) => p.id === id) ?? null,
    [id]
  );

  if (!project) {
    return (
      <div className="error-boundary">
        <div className="error-content">
          <span className="error-icon">🕵️‍♀️</span>
          <h1>Proyecto no encontrado</h1>
          <p>No existe un proyecto con ese identificador.</p>
          <Link className="btn-main" to="/#proyectos">
            Ver proyectos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={project.title}
        description={project.shortDescription}
        image={project.image}
        url={`/proyecto/${project.id}`}
        type="article"
        publishedTime={toISODate(project.date)}
        tags={project.technologies}
      />
      <article className="project-page">
        <div className="project-page__container">
          <Link to="/#proyectos" className="project-page__back">
            ← Volver a proyectos
          </Link>
          <header className="project-page__header">
            <h1 className="project-page__title">{project.title}</h1>
            {project.tagline && (
              <p className="project-page__tagline">{project.tagline}</p>
            )}
            <p className="project-page__description">
              {highlightCaseStudy(project.fullDescription)}
            </p>
            <div className="project-page__meta">
              <span>{project.role}</span>
              <span>•</span>
              <time dateTime={toISODate(project.date)}>{formatDateDayMonthYear(project.date)}</time>
            </div>
          </header>
          <div className="project-page__stack">
            {project.technologies.map((tech) => (
              <span key={tech} className="project-page__tech">
                {tech}
              </span>
            ))}
          </div>
          {project.metrics.length > 0 && (
            <section className="project-page__metrics">
              <h2 className="project-page__section-title">Métricas</h2>
              <ul>
                {project.metrics.map((m) => (
                  <li key={m.id}>
                    <strong>{m.value}</strong> — {m.label}
                    {m.description && `: ${m.description}`}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {project.challenges.length > 0 && (
            <section className="project-page__section">
              <h2 className="project-page__section-title">Decisiones clave</h2>
              <div className="project-page__challenges">
                {project.challenges.map((challenge) => (
                  <article key={challenge.title} className="project-page__challenge">
                    <h3>{challenge.title}</h3>
                    <p>{challenge.description}</p>
                    <p>
                      <strong>Enfoque:</strong> {challenge.solution}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
          {project.architecture && (
            <section className="project-page__section">
              <h2 className="project-page__section-title">Base técnica</h2>
              <p className="project-page__text">{project.architecture}</p>
            </section>
          )}
          {project.learnings && project.learnings.length > 0 && (
            <section className="project-page__section">
              <h2 className="project-page__section-title">Aprendizajes aplicables</h2>
              <ul className="project-page__list">
                {project.learnings.map((learning) => (
                  <li key={learning}>{learning}</li>
                ))}
              </ul>
            </section>
          )}
          <div className="project-page__links">
            {project.links.map((link) => (
              <a
                key={`${link.type}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-page__link"
              >
                {link.title} →
              </a>
            ))}
            <Link to="/#contacto" className="project-page__link project-page__link--secondary">
              Hablemos de un proyecto parecido →
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
