import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { buildMetadata, buildHomeJsonLd } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Desarrolladora Web',
  description:
    'Portfolio de Ione: Desarrolladora Web. Python, JavaScript, React, TypeScript & Automatizaciones.',
});

export default function HomePage() {
  const jsonLd = buildHomeJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Projects />
      <Contact />
    </>
  );
}