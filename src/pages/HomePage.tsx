import { lazy, Suspense } from 'react';
import { SEO } from '../components/SEO';
import { Hero } from '../components/Hero';

const Projects = lazy(() => import('../components/Projects').then(m => ({ default: m.Projects })));
const Contact = lazy(() => import('../components/Contact').then(m => ({ default: m.Contact })));

/** Página principal: hero + proyectos + contacto (lazy below the fold) */
export function HomePage() {
  return (
    <>
      <SEO
        title="Ione | Full-stack Developer"
        description="Portfolio de Ione: Desarrolladora Full-stack especializada en React, TypeScript y automatizaciones. Descubre mis proyectos y artículos sobre desarrollo."
        url="/"
        noSuffix
      />
      <Hero />
      <Suspense fallback={<div className="loading-placeholder" />}>
        <Projects />
        <Contact />
      </Suspense>
    </>
  );
}
