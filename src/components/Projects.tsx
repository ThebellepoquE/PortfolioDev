import { projects } from '../lib/projects';
import { ProjectCard } from './ProjectCard';

/** Sección de proyectos */
export function Projects() {
  return (
    <section id="proyectos" className="projects">
      <div className="projects__container">
        {/* Título */}
        <h2 className="projects__title title-neon text-gradient">
          Proyectos
        </h2>

        {/* Listado de proyectos modularizado */}
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}

