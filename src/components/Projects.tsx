import { useMemo } from 'react';
import { projectsData } from '../lib/projects';
import { ProjectCard } from './ProjectCard';
import { SectionTitle } from './SectionTitle';

/** Sección de proyectos: destacados primero, luego el resto */
export function Projects() {
  const sortedProjects = useMemo(
    () => [...projectsData].sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1)),
    [projectsData]
  );

  return (
    <section id="proyectos" className="projects">
      <div className="projects__container">
        <SectionTitle className="projects__title">
          Proyectos
        </SectionTitle>

        {sortedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
