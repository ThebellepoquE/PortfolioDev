import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ProjectPage } from './ProjectPage';
import type { JsonLd } from '../lib/jsonLd';

function renderProjectPage(id: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/proyecto/${id}`]}>
        <Routes>
          <Route path="/proyecto/:id" element={<ProjectPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function getJsonLd(): JsonLd | null {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script?.textContent) return null;
  return JSON.parse(script.textContent);
}

describe('ProjectPage JSON-LD', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('CreativeWork jsonLd contains @type: "CreativeWork"', () => {
    renderProjectPage('portfolio-thebellepoque');

    const jsonLd = getJsonLd();
    expect(jsonLd).not.toBeNull();
    expect(jsonLd!['@type']).toBe('CreativeWork');
  });

  it('contains name, description, datePublished, url, @id, author', () => {
    renderProjectPage('portfolio-thebellepoque');

    const jsonLd = getJsonLd();
    expect(jsonLd).not.toBeNull();
    expect(jsonLd!.name).toBe('Portfolio Personal');
    expect(typeof jsonLd!.description).toBe('string');
    expect(jsonLd!.datePublished).toBe('2026-01-01');
    expect(jsonLd!.url).toBe('https://thebellepoque.dev/proyecto/portfolio-thebellepoque');
    expect(jsonLd!['@id']).toBe('https://thebellepoque.dev/proyecto/portfolio-thebellepoque#creativework');
    expect(jsonLd!.author).toEqual({
      '@type': 'Person',
      name: 'Ione Rodríguez',
      url: 'https://thebellepoque.dev',
      '@id': 'https://thebellepoque.dev/#person',
    });
  });

  it('shows 404 page when project id does not exist', () => {
    renderProjectPage('no-existe');

    const jsonLd = getJsonLd();
    expect(jsonLd).toBeNull();
  });
});
