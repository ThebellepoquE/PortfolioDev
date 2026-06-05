import { useMemo } from 'react';
import { projectsData } from '../lib/projects';
import { ProjectCard } from './ProjectCard';
import { SectionTitle } from './SectionTitle';
import { Reveal } from './Reveal';

/** Sección de proyectos: destacados primero, luego el resto */
export function Projects() {
  const sortedProjects = useMemo(
    () => [...projectsData].sort((a, b) => {
      if (a.id === 'portfolio-thebellepoque') return 1;
      if (b.id === 'portfolio-thebellepoque') return -1;

      return b.date.localeCompare(a.date);
    }),
    []
  );

  if (sortedProjects === null) {
    return (
      <section id="proyectos" className="projects">
        <div className="projects__container">
          <SectionTitle className="projects__title">Proyectos</SectionTitle>
          {[1, 2, 3].map((i) => (
            <div key={i} className="project-card project-card--skeleton" aria-hidden="true">
              <span className="skeleton" style={{ width: '70%', height: '1.5rem' }} />
              <span className="skeleton" style={{ width: '100%', height: '0.875rem', marginTop: '0.75rem' }} />
              <span className="skeleton" style={{ width: '50%', height: '1.5rem', marginTop: '1rem' }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="proyectos" className="projects">
      <div className="projects__container">
        <SectionTitle className="projects__title">
          Proyectos
        </SectionTitle>

        {sortedProjects.map((project, i) => (
          <Reveal key={project.id} delay={i * 100}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
