interface ProjectCardProps {
  title: string;
  description: string;
  url: string;
  techStack: string[];
}

/** Tarjeta de proyecto con diseño fluorescente */
function ProjectCard({ title, description, url, techStack }: ProjectCardProps) {
  return (
    <div
      className="w-full max-w-3xl p-6 sm:p-8 md:p-10 lg:p-14 bg-[#000000] hover:shadow-[0_0_30px_rgba(255,20,147,0.5)] transition-all duration-500"
    >
      <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 items-center text-center">
        {/* Título */}
        <h3 className="text-xl sm:text-2xl font-bold title-neon">{title}</h3>

        {/* Descripción */}
        <p className="text-sm sm:text-base text-[#F5F5F5]/90 leading-relaxed">
          {description}
        </p>

        {/* Stack técnico */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {techStack.map((tech, index) => {
            const colors = ['text-[#FF1493]', 'text-[#FFF01F]', 'text-[#00FF00]'];
            const colorClass = colors[index % 3];
            return (
              <span
                key={tech}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm ${colorClass} font-medium`}
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
          className="px-8 py-4 sm:px-12 sm:py-5 md:px-16 md:py-6 font-semibold text-sm sm:text-base text-black bg-[#00FF00] rounded-full hover:shadow-[0_8px_30px_rgba(255,20,147,0.6)] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF01F]"
        >
          Visitar Proyecto →
        </a>
      </div>
    </div>
  );
}

/** Sección de proyectos */
export function Projects() {
  return (
    <section
      id="proyectos"
      className="min-h-screen flex items-center justify-center px-6 sm:px-8 md:px-12 lg:px-16"
      style={{
        scrollMarginTop: '80px',
        paddingTop: '40px',
        paddingBottom: '80px',
        background: '#000000',
      }}
    >
      <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 w-full max-w-[340px] sm:max-w-md md:max-w-2xl lg:max-w-4xl">
        {/* Título */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black title-neon text-center">
          Proyectos
        </h2>

        {/* Proyecto: Lighton */}
        <ProjectCard
          title="Lighton.es"
          description="Sitio web corporativo para empresa de instalaciones eléctricas. Migración completa de JavaScript a TypeScript, con Express en backend y SCSS para estilos. Diseño profesional, responsive y optimizado para conversión."
          url="https://www.lighton.es"
          techStack={['TypeScript', 'Express', 'SCSS', 'JavaScript', 'Responsive']}
        />

        {/* Proyecto: Sistema de Encuestas Automatizado */}
        <ProjectCard
          title="Sistema de Encuestas & Reseñas (Lighton)"
          description="Script Python que automatiza el envío de encuestas de satisfacción post-servicio. Si el cliente puntúa 4+ estrellas, se redirige automáticamente a Google Reviews. Optimiza la reputación online filtrando feedback negativo y potenciando reviews positivas."
          url="https://www.lighton.es"
          techStack={['Python', 'Automatización', 'Email APIs', 'Logic Flow', 'Data Processing']}
        />

        {/* Proyecto: Portfolio Personal */}
        <ProjectCard
          title="Portfolio Personal (thebellepoque.dev)"
          description="Portfolio moderno con diseño fluorescente neón, migrado desde Reflex a React + Vite + TypeScript. Incluye optimización de imágenes con Sharp, lazy loading, formulario con EmailJS y 36 tests con Vitest. Desplegado en Vercel con headers de seguridad y middleware de protección."
          url="https://github.com/ThebellepoquE/portfolio"
          techStack={['React', 'TypeScript', 'Vite', 'Tailwind', 'Vitest', 'Sharp']}
        />
      </div>
    </section>
  );
}
