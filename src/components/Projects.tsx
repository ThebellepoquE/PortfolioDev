import { projects } from '../lib/projects';
import { ProjectCard } from './ProjectCard';
import { SectionTitle } from './SectionTitle';

/** Sección de proyectos */
export function Projects() {
  return (
    <section id="proyectos" className="projects">
      <div className="projects__container">
        {/* Título */}
        <SectionTitle className="projects__title">
          Proyectos
        </SectionTitle>

        {/* Listado de proyectos modularizado */}
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}

