import type { Project as ProjectFull } from '../types/project';

// ---------------------------------------------------------------------------
// Fase 1: compatibilidad con la UI actual (ProjectCard usa title, description, url, techStack)
// En Fase 2 se cambiará a usar ProjectFull y projectsData
// ---------------------------------------------------------------------------

export interface Project {
  title: string;
  description: string;
  url: string;
  techStack: string[];
}

function toLegacy(p: ProjectFull): Project {
  const primary = p.links.find((l) => l.isPrimary) ?? p.links.find((l) => l.type === 'live') ?? p.links[0];
  return {
    title: p.title,
    description: p.shortDescription,
    url: primary?.url ?? '#',
    techStack: p.technologies,
  };
}

// ---------------------------------------------------------------------------
// Datos enriquecidos (modelo completo)
// ---------------------------------------------------------------------------

export const projectsData: ProjectFull[] = [
  {
    id: 'lighton-es',
    title: 'Lighton.es',
    tagline: 'Sitio corporativo para instalaciones eléctricas',
    shortDescription:
      'Sitio web corporativo para empresa de instalaciones eléctricas. Migración completa de JavaScript a TypeScript, con Express en backend y SCSS para estilos. Diseño profesional, responsive y optimizado para conversión.',
    fullDescription:
      'Sitio web corporativo para empresa de instalaciones eléctricas. Migración completa de JavaScript a TypeScript, con Express en backend y SCSS para estilos. Diseño profesional, responsive y optimizado para conversión. Incluye formularios de contacto, integración con flujos de negocio y preparado para SEO local.',
    complexity: 7,
    innovation: 6,
    impact: 8,
    technologies: ['TypeScript', 'Express', 'SCSS', 'JavaScript', 'Responsive'],
    image: '/images/projects/lighton.webp',
    imageAlt: 'Captura del sitio web Lighton.es',
    metrics: [
      {
        id: 'lighton-perf',
        type: 'technical',
        value: 'Migración 100% TS',
        label: 'Código tipado',
        description: 'Eliminación de errores en runtime gracias a TypeScript',
      },
      {
        id: 'lighton-business',
        type: 'business',
        value: 'Conversión',
        label: 'Optimizado para conversión',
        description: 'Diseño orientado a captación de leads y contacto',
      },
    ],
    links: [
      { type: 'live', url: 'https://www.lighton.es', title: 'Visitar sitio', isPrimary: true },
    ],
    challenges: [
      {
        title: 'Migración JS → TypeScript',
        description: 'Código legacy sin tipos en backend y frontend',
        solution: 'Migración incremental por módulos y tipado estricto en Express y plantillas',
        technologies: ['TypeScript', 'Express'],
      },
    ],
    architecture: 'Monorepo: frontend en root, backend en carpeta con package.json propio',
    learnings: ['Migración incremental en proyectos en producción', 'SCSS y variables de marca reutilizables'],
    featured: true,
    date: '2025-11',
    role: 'Desarrolladora full-stack',
    team: { size: 1, structure: 'Solo desarrollo' },
    relatedPosts: ['lighton-de-cero-a-produccion', 'modularizacion-lighton'],
  },
  {
    id: 'lighton-encuestas',
    title: 'Sistema de Encuestas & Reseñas (Lighton)',
    tagline: 'Automatización de feedback y Google Reviews',
    shortDescription:
      'Script Python que automatiza el envío de encuestas de satisfacción post-servicio. Si el cliente puntúa 4+ estrellas, se redirige automáticamente a Google Reviews. Optimiza la reputación online filtrando feedback negativo y potenciando reviews positivas.',
    fullDescription:
      'Script Python que automatiza el envío de encuestas de satisfacción post-servicio. Si el cliente puntúa 4+ estrellas, se redirige automáticamente a Google Reviews. Optimiza la reputación online filtrando feedback negativo y potenciando reviews positivas. Integrado con APIs de email y lógica de flujo condicional.',
    complexity: 6,
    innovation: 8,
    impact: 8,
    technologies: ['Python', 'Automatización', 'Email APIs', 'Logic Flow', 'Data Processing'],
    image: '/images/projects/encuestas.webp',
    imageAlt: 'Flujo de encuestas y reseñas',
    metrics: [
      {
        id: 'encuestas-business',
        type: 'business',
        value: 'Reputación online',
        label: 'Feedback dirigido a Google Reviews',
        description: 'Solo puntuaciones altas derivan a reseña pública; el resto queda interno',
      },
      {
        id: 'encuestas-users',
        type: 'users',
        value: 'Experiencia cliente',
        label: 'Un solo clic para opinar',
        description: 'El cliente recibe un email con enlace directo según su valoración',
      },
    ],
    links: [
      { type: 'live', url: 'https://www.lighton.es', title: 'Contexto: Lighton.es', isPrimary: true },
    ],
    challenges: [
      {
        title: 'Flujo condicional según valoración',
        description: 'Distinguir respuestas positivas de negativas y redirigir correctamente',
        solution: 'Lógica en Python con umbral 4+ estrellas y URLs distintas para Google Reviews vs feedback interno',
        technologies: ['Python', 'Email APIs'],
      },
    ],
    learnings: ['Automatización de procesos de negocio', 'Integración con servicios externos'],
    featured: true,
    date: '2025-12',
    role: 'Desarrolladora / Automatización',
    relatedPosts: ['modularizacion-lighton'],
  },
  {
    id: 'portfolio-thebellepoque',
    title: 'Portfolio Personal (thebellepoque.dev)',
    tagline: 'Portfolio moderno con stack React + Vite',
    shortDescription:
      'Portfolio moderno con diseño fluorescente neón, migrado desde Reflex a React + Vite + TypeScript. Incluye lazy loading, formulario con API Serverless (Resend) y tests con Vitest. Desplegado en Vercel con headers de seguridad.',
    fullDescription:
      'Portfolio moderno con diseño fluorescente neón, migrado desde Reflex a React + Vite + TypeScript. Incluye lazy loading, formulario con API Serverless (Resend) y 47+ tests con Vitest. Desplegado en Vercel con headers de seguridad y middleware de protección. SCSS con variables de marca, tema claro/oscuro y blog con Markdown.',
    complexity: 6,
    innovation: 7,
    impact: 5,
    technologies: ['React', 'TypeScript', 'Vite', 'SCSS', 'Vitest'],
    image: '/images/projects/portfolio.webp',
    imageAlt: 'Portfolio thebellepoque.dev',
    metrics: [
      {
        id: 'portfolio-quality',
        type: 'code-quality',
        value: '47+ tests',
        label: 'Cobertura con Vitest',
        description: 'Suite de tests para componentes críticos y formulario',
      },
      {
        id: 'portfolio-technical',
        type: 'technical',
        value: 'Lazy loading',
        label: 'Code-splitting por ruta',
        description: 'Chunks separados para React, Markdown y páginas below-the-fold',
      },
    ],
    links: [
      { type: 'github', url: 'https://github.com/ThebellepoquE/PortfolioDev', title: 'Ver código', isPrimary: true },
      { type: 'live', url: 'https://thebellepoque.dev', title: 'Visitar sitio' },
    ],
    challenges: [
      {
        title: 'Migración Reflex → React',
        description: 'Portfolio original en stack distinto',
        solution: 'Reescritura con Vite 7, React 19, react-router-dom 7 y contenido estático en src/lib',
        technologies: ['React', 'TypeScript', 'Vite'],
      },
    ],
    architecture: 'SPA con rutas /, /blog, /blog/:slug; API serverless Vercel para contacto',
    learnings: ['React 19 y Vite 7', 'Resend para emails', 'Headers de seguridad en Vercel'],
    featured: true,
    date: '2026-01',
    role: 'Desarrolladora full-stack',
    relatedPosts: [],
  },
];

// Export para la UI actual (Fase 1): misma forma que antes
export const projects: Project[] = projectsData.map(toLegacy);
