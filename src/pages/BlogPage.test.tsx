import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BlogPage } from './BlogPage';
import type { JsonLd } from '../lib/jsonLd';

const mockGetAllPosts = vi.fn();

vi.mock('../lib/posts', () => ({
  getAllPosts: () => mockGetAllPosts(),
}));

function renderBlogPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <BlogPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function getJsonLd(): JsonLd | null {
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script?.textContent) return null;
  return JSON.parse(script.textContent);
}

describe('BlogPage JSON-LD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.head.innerHTML = '';
  });

  it('CollectionPage jsonLd contains @type: "CollectionPage"', () => {
    mockGetAllPosts.mockReturnValue([]);
    renderBlogPage();

    const jsonLd = getJsonLd();
    expect(jsonLd).not.toBeNull();
    expect(jsonLd!['@type']).toBe('CollectionPage');
  });

  it('hasPart is an array of BlogPosting summaries', () => {
    mockGetAllPosts.mockReturnValue([
      {
        slug: 'post-one',
        title: 'First Post',
        description: 'Desc one',
        date: '2025-05-01',
        tags: ['react'],
      },
      {
        slug: 'post-two',
        title: 'Second Post',
        description: 'Desc two',
        date: '2025-06-01',
        tags: ['vitest'],
      },
    ]);
    renderBlogPage();

    const jsonLd = getJsonLd();
    expect(jsonLd).not.toBeNull();
    const hasPart = jsonLd!.hasPart as JsonLd[];
    expect(Array.isArray(hasPart)).toBe(true);
    expect(hasPart).toHaveLength(2);
    expect(hasPart[0]['@type']).toBe('BlogPosting');
    expect(hasPart[0].headline).toBe('First Post');
    expect(hasPart[0].url).toBe('https://thebellepoque.dev/blog/post-one');
    expect(hasPart[1].headline).toBe('Second Post');
  });

  it('empty posts array → hasPart: []', () => {
    mockGetAllPosts.mockReturnValue([]);
    renderBlogPage();

    const jsonLd = getJsonLd();
    expect(jsonLd).not.toBeNull();
    expect(jsonLd!.hasPart).toEqual([]);
  });
});
