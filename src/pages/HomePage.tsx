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
        title="Ione | Desarrolladora Web"
        description="Portfolio de Ione: Desarrolladora Web. Python, JavaScript, React, TypeScript & Automatizaciones."
        url="/"
        noSuffix
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Ione',
          alternateName: 'thebellepoque',
          url: 'https://thebellepoque.dev',
          image: 'https://thebellepoque.dev/profile.webp',
          sameAs: [
            'https://github.com/ThebellepoquE',
            'https://www.linkedin.com/in/thebellepoque',
          ],
          jobTitle: 'Desarrolladora Web · Formación Full-stack',
          description:
            'Desarrolladora web. Python, JavaScript, React, TypeScript & Automatizaciones.',
        }}
      />
      <Hero />
      <Suspense fallback={<div className="loading-placeholder" />}>
        <Projects />
        <Contact />
      </Suspense>
    </>
  );
}
