import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from './SEO';

function renderSEO(props: React.ComponentProps<typeof SEO>) {
  return render(
    <HelmetProvider>
      <SEO {...props} />
    </HelmetProvider>,
  );
}

function metaContent(property: string): string | null {
  const el = document.querySelector(`meta[property="${property}"]`);
  return el?.getAttribute('content') ?? null;
}

function metaName(name: string): string | null {
  const el = document.querySelector(`meta[name="${name}"]`);
  return el?.getAttribute('content') ?? null;
}

describe('SEO', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
  });

  describe('title rendering', () => {
    it('renders title with suffix by default', () => {
      renderSEO({ title: 'Blog', description: 'My blog' });

      expect(document.title).toBe('Blog | Ione | Full-stack Developer');
    });

    it('renders title without suffix when noSuffix is true', () => {
      renderSEO({ title: 'Home', description: 'Welcome', noSuffix: true });

      expect(document.title).toBe('Home');
    });
  });

  describe('meta tags', () => {
    it('renders og:locale, twitter:site, twitter:creator meta tags', () => {
      renderSEO({ title: 'Test', description: 'A test page' });

      expect(metaContent('og:locale')).toBe('es_ES');
      expect(metaName('twitter:site')).toBe('@thebellepoque');
      expect(metaName('twitter:creator')).toBe('@thebellepoque');
    });

    it('renders default OG image when no custom image passed', () => {
      renderSEO({ title: 'Test', description: 'A test page' });

      expect(metaContent('og:image')).toBe(
        'https://www.thebellepoque.dev/og-image-default.webp',
      );
    });

    it('renders custom OG image when image prop is passed', () => {
      renderSEO({
        title: 'Post',
        description: 'A post',
        image: '/images/hero.webp',
      });

      expect(metaContent('og:image')).toBe(
        'https://www.thebellepoque.dev/images/hero.webp',
      );
    });

    it('renders og:image:width, og:image:height, og:image:type with correct defaults', () => {
      renderSEO({ title: 'Test', description: 'A test page' });

      expect(metaContent('og:image:width')).toBe('1200');
      expect(metaContent('og:image:height')).toBe('630');
      expect(metaContent('og:image:type')).toBe('image/webp');
    });

    it('renders custom dimensions when ogImageWidth/ogImageHeight are passed', () => {
      renderSEO({
        title: 'Post',
        description: 'A post',
        ogImageWidth: '800',
        ogImageHeight: '450',
        ogImageType: 'image/jpeg',
      });

      expect(metaContent('og:image:width')).toBe('800');
      expect(metaContent('og:image:height')).toBe('450');
      expect(metaContent('og:image:type')).toBe('image/jpeg');
    });
  });

  describe('article type', () => {
    it('does NOT render article tags when type is website', () => {
      renderSEO({ title: 'Home', description: 'Welcome', type: 'website' });

      expect(document.querySelector('meta[property="article:published_time"]')).toBeNull();
      expect(document.querySelector('meta[property="article:tag"]')).toBeNull();
    });

    it('renders article tags when type is article with publishedTime', () => {
      renderSEO({
        title: 'Post',
        description: 'A blog post',
        type: 'article',
        publishedTime: '2025-06-01',
      });

      expect(metaContent('article:published_time')).toBe('2025-06-01');
    });

    it('renders article tags when type is article with publishedTime and tags', () => {
      renderSEO({
        title: 'Post',
        description: 'A blog post',
        type: 'article',
        publishedTime: '2025-06-01',
        tags: ['react', 'vitest'],
      });

      const tagElements = document.querySelectorAll('meta[property="article:tag"]');
      expect(tagElements).toHaveLength(2);
      expect(tagElements[0].getAttribute('content')).toBe('react');
      expect(tagElements[1].getAttribute('content')).toBe('vitest');
    });
  });

  describe('JSON-LD', () => {
    it('renders JSON-LD script when jsonLd prop is passed', () => {
      renderSEO({
        title: 'Post',
        description: 'A blog post',
        jsonLd: { '@type': 'BlogPosting', headline: 'Hello' },
      });

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      const parsed = JSON.parse(script!.textContent || '{}');
      expect(parsed['@type']).toBe('BlogPosting');
    });

    it('does NOT render JSON-LD script when jsonLd is not passed', () => {
      renderSEO({ title: 'Page', description: 'No json-ld' });

      expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
    });
  });

  describe('canonical URL', () => {
    it('renders canonical URL when url prop is passed', () => {
      renderSEO({
        title: 'Post',
        description: 'A post',
        url: '/blog/my-post',
      });

      const link = document.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute('href')).toBe('https://www.thebellepoque.dev/blog/my-post');
    });

    it('falls back to baseUrl when no url is passed', () => {
      renderSEO({ title: 'Home', description: 'Welcome' });

      const link = document.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute('href')).toBe('https://www.thebellepoque.dev');
    });
  });

  describe('image URL resolution', () => {
    it('correctly converts relative image URLs to absolute', () => {
      renderSEO({
        title: 'Post',
        description: 'A post',
        image: 'images/photo.jpg',
      });

      expect(metaContent('og:image')).toBe(
        'https://www.thebellepoque.dev/images/photo.jpg',
      );
    });

    it('keeps absolute image URLs unchanged', () => {
      renderSEO({
        title: 'Post',
        description: 'A post',
        image: 'https://cdn.example.com/hero.jpg',
      });

      expect(metaContent('og:image')).toBe('https://cdn.example.com/hero.jpg');
    });
  });
});
