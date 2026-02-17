import type { Project } from '../lib/projects';

interface ProjectCardProps {
  project: Project;
}

/** Tarjeta de proyecto con diseño fluorescente */
export function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, url, techStack } = project;
  
  return (
    <div className="project-card">
      <div className="project-card__content">
        {/* Título */}
        <h3 className="project-card__title title-neon">{title}</h3>

        {/* Descripción */}
        <p className="project-card__description">
          {description}
        </p>

        {/* Stack técnico */}
        <div className="project-card__stack">
          {techStack.map((tech, index) => {
            const modifiers = ['--pink', '--yellow', '--green'];
            const modifier = modifiers[index % 3];
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

        {/* Link al proyecto */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__link"
        >
          Visitar Proyecto →
        </a>
      </div>
    </div>
  );
}
