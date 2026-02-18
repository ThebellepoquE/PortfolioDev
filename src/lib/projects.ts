export interface Project {
  title: string;
  description: string;
  url: string;
  techStack: string[];
}

export const projects: Project[] = [
  {
    title: "Lighton.es",
    description: "Sitio web corporativo para empresa de instalaciones eléctricas. Migración completa de JavaScript a TypeScript, con Express en backend y SCSS para estilos. Diseño profesional, responsive y optimizado para conversión.",
    url: "https://www.lighton.es",
    techStack: ['TypeScript', 'Express', 'SCSS', 'JavaScript', 'Responsive']
  },
  {
    title: "Sistema de Encuestas & Reseñas (Lighton)",
    description: "Script Python que automatiza el envío de encuestas de satisfacción post-servicio. Si el cliente puntúa 4+ estrellas, se redirige automáticamente a Google Reviews. Optimiza la reputación online filtrando feedback negativo y potenciando reviews positivas.",
    url: "https://www.lighton.es",
    techStack: ['Python', 'Automatización', 'Email APIs', 'Logic Flow', 'Data Processing']
  },
  {
    title: "Portfolio Personal (thebellepoque.dev)",
    description: "Portfolio moderno con diseño fluorescente neón, migrado desde Reflex a React + Vite + TypeScript. Incluye optimización de imágenes con Sharp, lazy loading, formulario con API Serverless (Resend) y 36 tests con Vitest. Desplegado en Vercel con headers de seguridad y middleware de protección.",
    url: "https://github.com/ThebellepoquE/portfolio",
    techStack: ['React', 'TypeScript', 'Vite', 'SCSS', 'Vitest', 'Sharp']
  }
];
