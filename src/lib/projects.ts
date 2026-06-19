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
    id: 'purple-basque-tours',
    title: 'Turismo',
    tagline: 'Web turística multilingüe con CMS, booking y SEO internacional',
    shortDescription:
      'Plataforma web para una marca de tours privados en Euskadi. Next.js 15 + Sanity CMS con contenido multilingüe EN/ES, integración de booking con Cal.com, formularios con Resend + Zod, galerías de fotos con lightbox y SEO internacional completo.',
    fullDescription:
      'Plataforma web completa para PurpleBasqueTours, operador de experiencias y tours privados en el País Vasco. Problema: necesitaban una presencia online que gestionara tours, precios y contenido en varios idiomas sin depender de un desarrollador para cada cambio. Solución: Next.js 15 App Router con Sanity CMS headless como backend de contenido, routing internacionalizado por [locale] (EN/ES), integración de booking con Cal.com, formulario de contacto con validación Zod y envío por Resend, galerías de fotos con yet-another-react-lightbox, y monitoreo con Sentry + Vercel Analytics. Seguridad: CSP headers, HSTS, permisos restrictivos. Testing: Jest + Playwright E2E. Resultado: sitio autogestionable preparado para público internacional con infraestructura profesional.',
    complexity: 8,
    innovation: 7,
    impact: 9,
    technologies: ['Next.js 15', 'Sanity CMS', 'TypeScript', 'SCSS', 'SEO internacional', 'i18n'],
    image: '/og-image-default.jpg',
    imageAlt: 'Caso de estudio PurpleBasqueTours',
    metrics: [
      {
        id: 'pbt-cms',
        type: 'technical',
        value: 'Autogestionable',
        label: 'Contenido desde Sanity CMS',
        description: 'Tours, precios, fotos y textos multilingües editables sin tocar código',
      },
      {
        id: 'pbt-booking',
        type: 'business',
        value: 'Booking integrado',
        label: 'Cal.com embebido',
        description: 'Sistema de reservas profesional con slots, confirmaciones y sin fricción para el usuario',
      },
      {
        id: 'pbt-i18n',
        type: 'users',
        value: 'EN + ES',
        label: 'Multilingüe completo',
        description: 'Routing por locale, contenido traducido en Sanity y SEO por idioma',
      },
    ],
    links: [
      { type: 'live', url: 'https://purplebasquetours.com', title: 'Visitar sitio', isPrimary: true },
    ],
    challenges: [
      {
        title: 'Contenido multilingüe gestionable por el cliente',
        description: 'El operador necesitaba controlar textos, tours y precios en inglés y español sin asistencia técnica.',
        solution: 'Sanity CMS con schema de traducciones por campo, flujo de publicación con webhooks y scripts de validación automática.',
        technologies: ['Sanity CMS', 'i18n', 'TypeScript'],
      },
      {
        title: 'Integración de booking sin fricción',
        description: 'El sistema de reservas debía sentirse parte del sitio, no un iframe externo.',
        solution: 'Cal.com embed con React SDK, sincronización de estilos con el design system y CSP configurado para permitir el frame sin romper seguridad.',
        technologies: ['Cal.com', 'React', 'CSP'],
      },
      {
        title: 'Calidad de código y despliegue confiable',
        description: 'Un sitio con CMS + booking + formularios necesita tests sólidos para no romper nada en cada cambio.',
        solution: 'Jest para unitarios, Playwright para E2E, Sentry para errores en producción, Vercel Analytics para rendimiento, y CI con lint + typecheck + test + build.',
        technologies: ['Jest', 'Playwright', 'Sentry', 'CI/CD'],
      },
    ],
    architecture: 'Next.js 15 App Router + Sanity CMS headless. Routing i18n por [locale] (EN/ES). Componentes server-first con client islands para interactividad (booking, formularios, lightbox). CSP headers, HSTS, next/image con remotePatterns de Sanity CDN. Webhooks de Sanity para revalidación on-demand.',
    learnings: [
      'Arquitectura de contenido multilingüe con Sanity CMS y routing por locale en Next.js App Router',
      'Integración de booking embebido (Cal.com) con diseño cohesivo y CSP restrictivo',
      'Formularios server-side con React Hook Form + Zod + Resend',
      'E2E testing con Playwright para flujos multilingües críticos (navegación, booking, contacto)',
      'Security headers hardening (CSP, HSTS, COOP, CORP) en Next.js',
    ],
    featured: true,
    featuredText: 'purplebasquetours.com',
    status: 'live',
    date: '2026-04',
    role: 'Full-stack developer & arquitecta',
    team: { size: 1, structure: 'Desarrollo full-stack + arquitectura CMS' },
    relatedPosts: [],
  },
  {
    id: 'lighton-es',
    title: 'Electricista',
    tagline: 'Plataforma full-stack con automatización, E2E y PostgreSQL',
    shortDescription:
      'Web corporativa full-stack para empresa de instalaciones eléctricas en Benidorm. React 19 + Vite en frontend, Node.js + Express + PostgreSQL en backend, automatización Python para encuestas y reseñas, y test suite completa con Vitest + Playwright E2E.',
    fullDescription:
      'Plataforma web completa para LightON, empresa líder en instalaciones eléctricas en Benidorm. Problema: necesitaban presencia digital profesional, formularios de contacto funcionales y un sistema para gestionar la reputación online automatizando encuestas de satisfacción post-servicio. Solución: frontend en React 19 + Vite + TypeScript con SCSS modular y diseño responsive; backend en Node.js + Express con PostgreSQL para formularios y datos de negocio; automatización Python con scheduler para encuestas post-servicio que redirigen a Google Reviews según puntuación. Infraestructura: Docker + docker-compose para desarrollo local, despliegue en Render + Vercel, CSP headers. Testing: Vitest para unitarios y Playwright para E2E (formularios, navegación, rutas críticas). Resultado: sitio en producción con formularios funcionando, SEO local aplicado, automatización de feedback corriendo en scheduler y monitorización de rendimiento (Core Web Vitals, INP < 100ms).',
    complexity: 9,
    innovation: 8,
    impact: 9,
    technologies: ['React 19', 'TypeScript', 'Express', 'PostgreSQL', 'Python', 'Playwright', 'Docker'],
    image: '/og-image-default.jpg',
    imageAlt: 'Captura del sitio web Lighton.es',
    metrics: [
      {
        id: 'lighton-e2e',
        type: 'technical',
        value: 'Playwright E2E',
        label: 'Tests end-to-end',
        description: 'Suite E2E para formularios, navegación y rutas críticas con Playwright',
      },
      {
        id: 'lighton-automation',
        type: 'business',
        value: 'Automatización',
        label: 'Encuestas → Google Reviews',
        description: 'Python scheduler que envía encuestas post-servicio y redirige a Google Reviews según puntuación',
      },
      {
        id: 'lighton-perf',
        type: 'performance',
        value: 'INP < 100ms',
        label: 'Core Web Vitals',
        description: 'Optimizado para Interaction to Next Paint por debajo de 100ms',
      },
    ],
    links: [
      { type: 'live', url: 'https://www.lighton.es', title: 'Visitar sitio', isPrimary: true },
    ],
    challenges: [
      {
        title: 'Arquitectura full-stack con contratos tipados',
        description: 'Frontend y backend necesitaban compartir tipos sin duplicación ni desincronización.',
        solution: 'Paquete compartido @lighton/contracts con tipos TypeScript, compilado como paso previo al build. Validación en ambos lados con el mismo schema.',
        technologies: ['TypeScript', 'Monorepo', 'Contracts'],
      },
      {
        title: 'Automatización de feedback post-servicio',
        description: 'El cliente necesitaba recoger opiniones automáticamente y derivar solo las positivas a Google Reviews.',
        solution: 'Scripts Python con scheduler: envío de email con encuesta, lógica condicional (4+ estrellas → Google Reviews, menos → feedback interno). Containerizado con Docker.',
        technologies: ['Python', 'Docker', 'Email APIs'],
      },
      {
        title: 'Cobertura de tests en frontend y backend',
        description: 'Un sistema con formularios, API, automatización y múltiples entornos necesita tests sólidos.',
        solution: 'Vitest para unitarios en frontend y backend. Playwright para E2E en flujos críticos (contacto, navegación, formularios). CI con lint + test + build.',
        technologies: ['Vitest', 'Playwright', 'CI/CD'],
      },
    ],
    architecture: 'Monorepo pnpm: frontend Vite + React 19 en root, backend Express + PostgreSQL en /backend, automatización Python en /automation, contratos compartidos en /shared. Docker Compose para desarrollo local (frontend + backend + PostgreSQL). Despliegue: frontend en Vercel, backend en Render, scheduler Python como servicio separado.',
    learnings: [
      'Contratos tipados compartidos entre frontend y backend con TypeScript',
      'Pipeline completo de tests: Vitest unitarios + Playwright E2E + CI',
      'Automatización Python con scheduler para flujos de negocio reales',
      'Docker Compose multi-servicio para desarrollo local (React, Express, PostgreSQL)',
      'Core Web Vitals: INP < 100ms en producción',
    ],
    featured: true,
    featuredText: 'lighton.es',
    date: '2025-11',
    role: 'Full-stack developer & arquitecta',
    team: { size: 1, structure: 'Desarrollo full-stack + automatización' },
    relatedPosts: ['lighton-de-cero-a-produccion', 'modularizacion-lighton'],
  },
  {
    id: 'lighton-encuestas',
    title: 'Sistema de Encuestas & Reseñas',
    tagline: 'Automatización de feedback y Google Reviews',
    shortDescription:
      'Script Python que automatiza el envío de encuestas de satisfacción post-servicio. Si el cliente puntúa 4+ estrellas, se redirige automáticamente a Google Reviews. Optimiza la reputación online filtrando feedback negativo y potenciando reviews positivas.',
    fullDescription:
      'Script Python que automatiza el envío de encuestas de satisfacción post-servicio. Si el cliente puntúa 4+ estrellas, se redirige automáticamente a Google Reviews. Optimiza la reputación online filtrando feedback negativo y potenciando reviews positivas. Integrado con APIs de email y lógica de flujo condicional.',
    complexity: 6,
    innovation: 8,
    impact: 8,
    technologies: ['Python', 'Automatización', 'Email APIs', 'Logic Flow', 'Data Processing'],
    image: '/og-image-default.jpg',
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
    links: [],
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
    featuredText: 'lighton.es',
    date: '2025-12',
    role: 'Desarrolladora / Automatización',
    relatedPosts: ['modularizacion-lighton'],
  },
  {
    id: 'portfolio-thebellepoque',
    title: 'Portfolio Personal',
    tagline: 'Portfolio moderno con React 19, Vite 7 y SEO completo',
    shortDescription:
      'Portfolio personal con diseño neón, tema claro/oscuro, blog con Markdown y formulario serverless. React 19 + Vite 7 + TypeScript, 124 tests con Vitest, SEO completo (metadatos, datos estructurados, imágenes responsivas WebP/AVIF), bundle visualizer y despliegue en Vercel.',
    fullDescription:
      'Portfolio moderno con diseño fluorescente neón, migrado desde Reflex a React 19 + Vite 7 + TypeScript. Incluye lazy loading y code-splitting por ruta, formulario de contacto con API Serverless (Resend), 124 tests con Vitest + Testing Library, y blog con Markdown (react-markdown + remark-gfm). SEO completo: Open Graph + Twitter Cards, JSON-LD estructurado (BlogPosting, CreativeWork, CollectionPage), imágenes responsivas con srcSet WebP/AVIF vía sharp, sitemap con extensiones de imagen, y robots meta configurable. Desplegado en Vercel con headers de seguridad y CI/CD con lint + typecheck + test + build. Bundle visualizer con rollup-plugin-visualizer. Tema claro/oscuro con variables SCSS. Desarrollo asistido por agentes IA con SDD (Spec-Driven Development).',
    complexity: 7,
    innovation: 8,
    impact: 5,
    technologies: ['React 19', 'TypeScript', 'Vite 7', 'SCSS', 'Vitest', 'SEO', 'WebP/AVIF'],
    image: '/og-image-default.jpg',
    imageAlt: 'Portfolio thebellepoque.dev',
    metrics: [
      {
        id: 'portfolio-quality',
        type: 'code-quality',
        value: '124 tests',
        label: 'Cobertura con Vitest',
        description: 'Suite de tests para SEO, componentes críticos, formulario, imágenes y esquemas JSON-LD',
      },
      {
        id: 'portfolio-seo',
        type: 'performance',
        value: '103 criterios',
        label: 'SEO completo verificado',
        description: '13 requisitos SEO con 103 criterios de aceptación: metadatos, datos estructurados, imágenes responsivas, sitemap',
      },
      {
        id: 'portfolio-technical',
        type: 'technical',
        value: 'SDD workflow',
        label: 'Spec-Driven Development',
        description: 'Ciclo completo de desarrollo con proposal → spec → design → tasks → apply → verify → archive',
      },
    ],
    links: [],
    challenges: [
      {
        title: 'Migración Reflex → React 19 + Vite 7',
        description: 'Portfolio original en stack distinto (Python/Reflex) sin control granular sobre el output HTML ni SEO.',
        solution: 'Reescritura completa con Vite 7, React 19 y Next.js para SEO y contenido estático en TypeScript.',
        technologies: ['React 19', 'TypeScript', 'Vite 7'],
      },
      {
        title: 'SEO integral desde cero',
        description: 'Un portfolio sin metadatos, sin datos estructurados y sin imágenes optimizadas pierde visibilidad orgánica.',
        solution: 'Implementación de 13 requisitos SEO en 3 fases: metadatos (OG, Twitter), datos estructurados (JSON-LD), imágenes responsivas (WebP/AVIF con srcSet), sitemap con imágenes, y bundle analyzer. Verificado con 103 criterios de aceptación.',
        technologies: ['SEO', 'JSON-LD', 'Sharp', 'WebP', 'AVIF'],
      },
    ],
    architecture: 'Next.js 14 App Router + TypeScript. SEO gestionado por Next.js. Blog con Markdown (react-markdown + remark-gfm). API Serverless en Vercel para formulario de contacto (Resend). Imágenes optimizadas con sharp (WebP/AVIF). Bundle analyzer con rollup-plugin-visualizer. Tema claro/oscuro con variables SCSS.',
    learnings: [
      'React 19 y Vite 7 en producción',
      'SEO completo: Open Graph, Twitter Cards, JSON-LD, sitemap con imágenes',
      'Imágenes responsivas con srcSet, WebP y AVIF usando sharp',
      'Spec-Driven Development con agentes IA: proposal → spec → design → tasks → apply → verify → archive',
      'Resend para emails serverless y headers de seguridad en Vercel',
    ],
    featured: true,
    featuredText: 'thebellepoque.dev',
    date: '2026-01',
    role: 'Full-stack developer & arquitecta',
    relatedPosts: [],
  },
  {
    id: 'discografica',
    title: 'Discográfica',
    tagline: 'Web para discográfica independiente con CMS y catálogo',
    shortDescription:
      'Aplicación web para gestión y difusión de catálogo discográfico. Next.js 16 + Sanity CMS con next/image para portadas optimizadas, Lighthouse CI para Core Web Vitals, Playwright E2E y Sentry para monitoreo. Sustituye al WordPress actual.',
    fullDescription:
      'Plataforma web para una discográfica independiente con catálogo navegable y gestión de contenido dinámica (Next.js 16 + Sanity CMS headless). Sustituye al WordPress actual; la URL definitiva será decadenciacorporal.com. Problema: crear una web con buen SEO, imágenes de portadas optimizadas y gestión de contenido sin depender de un desarrollador. Solución: Next.js 16 App Router con Sanity como CMS, next/image para servir portadas en formatos modernos con tamaños responsivos, Lighthouse CI para monitoreo de Core Web Vitals (LCP, CLS, INP), y Sentry para tracking de errores en producción. Testing: Jest para unitarios, Playwright para E2E, bundle budget checker. Resultado: catálogo navegable, editable desde Sanity, con métricas de rendimiento verificadas y preparado para reemplazar WordPress.',
    complexity: 8,
    innovation: 7,
    impact: 8,
    technologies: ['Next.js 16', 'Sanity CMS', 'TypeScript', 'next/image', 'Lighthouse CI', 'Playwright'],
    image: '/og-image-default.jpg',
    imageAlt: 'Proyecto Discográfica en construcción',
    metrics: [
      {
        id: 'discografica-perf',
        type: 'performance',
        value: 'Lighthouse CI',
        label: 'Core Web Vitals monitoreados',
        description: 'Lighthouse CI en pipeline para LCP, CLS e INP con presupuesto de bundle automatizado',
      },
      {
        id: 'discografica-cms',
        type: 'technical',
        value: 'CMS autogestionable',
        label: 'Sanity Studio integrado',
        description: 'Catálogo, artistas y contenido editable sin tocar código desde Sanity Studio',
      },
    ],
    links: [
      { type: 'live', url: 'https://decadencia-corporal.vercel.app', title: 'Ver preview', isPrimary: true },
    ],
    challenges: [
      {
        title: 'Rendimiento con catálogo rico en imágenes',
        description: 'Portadas de discos y fotos de artistas impactando LCP y CLS en Lighthouse.',
        solution: 'next/image con remotePatterns de Sanity CDN, tamaños responsivos, prioridad para above-the-fold, formatos WebP/AVIF. Lighthouse CI para regresiones y bundle budget checker.',
        technologies: ['Next.js', 'next/image', 'Lighthouse CI'],
      },
      {
        title: 'Migración desde WordPress sin perder SEO',
        description: 'El WordPress actual tiene URLs indexadas y contenido que no puede romperse.',
        solution: 'Mapeo de rutas con redirects, conservación de slugs, metadatos por página y sitemap dinámico desde Sanity.',
        technologies: ['Next.js', 'Sanity', 'SEO'],
      },
    ],
    architecture: 'Next.js 16 App Router + Sanity CMS headless con next/image. Studio de Sanity embebido en ruta /admin. Lighthouse CI en pipeline. Sentry para monitoreo de errores. Playwright para E2E. Bundle budget automatizado.',
    learnings: [
      'Next.js 16 con Sanity CMS headless y next/image para catálogo de medios',
      'Lighthouse CI para monitoreo automatizado de Core Web Vitals',
      'Estrategia de migración WordPress → Next.js preservando SEO y URLs',
    ],
    featured: true,
    featuredText: 'decadenciacorporal.com',
    status: 'live',
    date: '2026-03',
    role: 'Full-stack developer & arquitecta',
    relatedPosts: [],
  },
];

// Export para la UI actual (Fase 1): misma forma que antes
export const projects: Project[] = projectsData.map(toLegacy);
