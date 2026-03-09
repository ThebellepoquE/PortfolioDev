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
      'Sitio web corporativo para empresa de instalaciones eléctricas. Migración completa de JavaScript a TypeScript, con Express en backend y SCSS para estilos. Diseño profesional, responsive y optimizado para conversión. Incluye formularios de contacto, integración con flujos de negocio y preparado para SEO local. Problema: pasar de una web mínima a un sitio estable y medible. Solución: monorepo TypeScript + Express, SCSS modular y pipeline de despliegue reproducible. Resultado: sitio en producción con formularios funcionando, SEO local aplicado y monitorización básica.',
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
      {
        title: 'Pruebas E2E con Playwright',
        description: 'Necesidad de validar rutas críticas y flujos de usuario en entorno real',
        solution: 'Configuración de Playwright para LightOn: tests E2E de navegación, formularios y páginas clave. Suite ejecutable en CI y local para detectar regresiones antes de desplegar.',
        technologies: ['Playwright', 'TypeScript', 'E2E'],
      },
    ],
    architecture: 'Monorepo: frontend en root, backend en carpeta con package.json propio',
    learnings: ['Migración incremental en proyectos en producción', 'SCSS y variables de marca reutilizables', 'Configuración de tests E2E con Playwright para rutas críticas'],
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
      'Portfolio moderno con diseño fluorescente neón, migrado desde Reflex a React + Vite + TypeScript. Incluye lazy loading, formulario con API Serverless (Resend) y 74 tests con Vitest. Desplegado en Vercel con headers de seguridad. Uso de GitGuardian para detección de secretos y limpieza de historial de credenciales en repos. Trabajo con un equipo de agentes y subagentes de IA para automatizar tareas repetitivas de desarrollo y documentación, apoyándome en Context7 para consultar documentación viva de librerías y frameworks. SCSS con variables de marca, tema claro/oscuro y blog con Markdown.',
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
        value: '74 tests',
        label: 'Cobertura con Vitest',
        description: 'Suite de tests para componentes críticos, formulario, ProjectCard, MetricBadge y BlogPost',
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
    learnings: [
      'React 19 y Vite 7',
      'Resend para emails',
      'Headers de seguridad en Vercel',
      'GitGuardian para detección de secretos y limpieza de historial de credenciales en repos',
      'Context7 para documentación viva de librerías',
      'Diseño de agentes y subagentes para automatizar flujos de desarrollo',
    ],
    featured: true,
    date: '2026-01',
    role: 'Desarrolladora full-stack',
    relatedPosts: [],
  },
  {
    id: 'discografica',
    title: 'Discográfica',
    tagline: 'En construcción',
    shortDescription:
      'Proyecto en desarrollo: aplicación web para gestión y difusión de catálogo discográfico. Stack moderno y diseño orientado a artista y oyente.',
    fullDescription:
      'Proyecto en construcción. Aplicación web para gestión y difusión de catálogo discográfico (Next.js + Sanity), con foco en experiencia de artista y oyente. Sustituye al WordPress actual; la URL definitiva será decadenciacorporal.com. Imágenes optimizadas con next/image para mejorar LCP. Problema: crear una web para una discográfica independiente con gestión de contenido dinámica y buen SEO. Solución: App Router de Next.js 15 con Sanity como CMS headless y next/image para servir portadas optimizadas. Resultado: catálogo navegable, editable desde Sanity y con métricas de LCP mejores en Lighthouse. Se irá actualizando conforme avance el desarrollo.',
    complexity: 0,
    innovation: 0,
    impact: 0,
    technologies: ['Next.js', 'Sanity'],
    image: '/images/projects/portfolio.webp',
    imageAlt: 'Proyecto Discográfica en construcción',
    metrics: [
      {
        id: 'discografica-perf',
        type: 'performance',
        value: 'LCP',
        label: 'Imágenes optimizadas',
        description: 'Uso de next/image para tamaños responsivos y prioridad en above-the-fold; mejora de LCP en Lighthouse',
      },
    ],
    links: [
      { type: 'live', url: 'https://decadencia-corporal.vercel.app', title: 'Ver preview', isPrimary: true },
    ],
    challenges: [
      {
        title: 'Rendimiento y LCP',
        description: 'Imágenes del catálogo y portadas impactando el tiempo de carga y Core Web Vitals',
        solution: 'Integración de next/image con tamaños responsivos, prioridad para imágenes above-the-fold y formatos modernos (WebP/AVIF) para reducir peso y mejorar LCP en Lighthouse',
        technologies: ['Next.js', 'next/image', 'Core Web Vitals'],
      },
    ],
    learnings: ['Optimización de imágenes con next/image para mejorar LCP y Core Web Vitals'],
    featured: false,
    status: 'wip',
    date: '2026-03',
    role: 'Desarrolladora full-stack',
    relatedPosts: [],
  },
];

// Export para la UI actual (Fase 1): misma forma que antes
export const projects: Project[] = projectsData.map(toLegacy);
