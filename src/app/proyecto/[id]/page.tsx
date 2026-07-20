import type { ReactNode } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projectsData } from '@/lib/projects';
import { formatDateDayMonthYear } from '@/lib/formatDate';
import { buildMetadata, buildProjectJsonLd, buildBreadcrumbJsonLd } from '@/lib/metadata';
import { SITE_CONFIG } from '@/lib/config';

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

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);
  if (!project) return {};

  return buildMetadata({
    title: project.title,
    description: project.shortDescription,
    path: `/proyecto/${project.id}`,
    image: project.image,
    type: 'article',
    publishedTime: project.date,
    tags: project.technologies,
  });
}

/** Página de detalle de proyecto con SEO específico */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const jsonLd = buildProjectJsonLd(project);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Inicio', url: SITE_CONFIG.baseUrl },
    { name: 'Proyectos', url: `${SITE_CONFIG.baseUrl}/#proyectos` },
    { name: project.title, url: `${SITE_CONFIG.baseUrl}/proyecto/${project.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="project-page">
        <div className="project-page__container">
          <Link href="/#proyectos" className="project-page__back">
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
              <time dateTime={toISODate(project.date)}>
                {formatDateDayMonthYear(project.date)}
              </time>
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
                  <article
                    key={challenge.title}
                    className="project-page__challenge"
                  >
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
              <h2 className="project-page__section-title">
                Aprendizajes aplicables
              </h2>
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
            <Link
              href="/#contacto"
              className="project-page__link project-page__link--secondary"
            >
              Hablemos de un proyecto parecido →
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}