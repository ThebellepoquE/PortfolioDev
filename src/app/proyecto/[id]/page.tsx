import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projectsData } from '@/lib/projects';
import { buildMetadata, buildProjectJsonLd } from '@/lib/metadata';

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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);
  if (!project) notFound();

  const jsonLd = buildProjectJsonLd(project);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="project">
        <div className="project__container">
          <Link href="/" className="project__back">
            <span>←</span> Volver a proyectos
          </Link>

          <div className="project__article">
            <header className="project__header">
              <h1 className="project__title">{project.title}</h1>

              <div className="project__meta">
                <time dateTime={project.date}>{project.date}</time>
                <span>•</span>
                <span>{project.technologies.join(', ')}</span>
              </div>
            </header>

            <div className="project__content">
              <div className="project__description">
                <p>{project.shortDescription}</p>
              </div>

              <div className="project__links">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project__link"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}