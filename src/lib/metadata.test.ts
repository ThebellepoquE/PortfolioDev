import { describe, it, expect } from 'vitest';
import {
  buildMetadata,
  buildHomeJsonLd,
  buildBlogJsonLd,
  buildBlogPostJsonLd,
  buildProjectJsonLd,
} from './metadata';
import { SITE_CONFIG } from './config';

describe('buildMetadata', () => {
  it('añade el sufijo del sitio al título por defecto', () => {
    const result = buildMetadata({ title: 'Blog', description: 'Desc' });

    expect(result.title).toBe(`Blog | ${SITE_CONFIG.name} | ${SITE_CONFIG.title}`);
  });

  it('omite el sufijo cuando noSuffix es true', () => {
    const result = buildMetadata({
      title: 'Ione | Full-stack Developer',
      description: 'Desc',
      noSuffix: true,
    });

    expect(result.title).toBe('Ione | Full-stack Developer');
  });

  it('construye la URL canónica a partir de path', () => {
    const result = buildMetadata({
      title: 'Blog',
      description: 'Desc',
      path: '/blog',
    });

    expect(result.alternates).toEqual({
      canonical: `${SITE_CONFIG.baseUrl}/blog`,
    });
  });

  it('usa baseUrl como canónica cuando no hay path', () => {
    const result = buildMetadata({ title: 'Home', description: 'Desc' });

    expect(result.alternates).toEqual({ canonical: SITE_CONFIG.baseUrl });
  });

  it('construye URL absoluta para path relativo sin barra', () => {
    const result = buildMetadata({
      title: 'Test',
      description: 'Desc',
      path: 'blog',
    });

    expect(result.alternates).toEqual({
      canonical: `${SITE_CONFIG.baseUrl}/blog`,
    });
  });

  it('preserva URLs absolutas en la imagen', () => {
    const result = buildMetadata({
      title: 'Test',
      description: 'Desc',
      image: 'https://example.com/img.webp',
    });

    const ogImages = result.openGraph?.images as Array<{ url: string }>;
    expect(ogImages[0].url).toBe('https://example.com/img.webp');
  });

  it('usa la imagen OG por defecto cuando no se proporciona imagen', () => {
    const result = buildMetadata({ title: 'Test', description: 'Desc' });

    const ogImages = result.openGraph?.images as Array<{ url: string }>;
    expect(ogImages[0].url).toBe(`${SITE_CONFIG.baseUrl}/og-image-default.webp`);
  });

  it('construye URL absoluta para imagen relativa', () => {
    const result = buildMetadata({
      title: 'Test',
      description: 'Desc',
      image: '/images/post.webp',
    });

    const ogImages = result.openGraph?.images as Array<{ url: string }>;
    expect(ogImages[0].url).toBe(`${SITE_CONFIG.baseUrl}/images/post.webp`);
  });

  it('configura OpenGraph con tipo website por defecto', () => {
    const result = buildMetadata({ title: 'Test', description: 'Desc' });

    expect(result.openGraph).toMatchObject({
      type: 'website',
      locale: SITE_CONFIG.locale,
      siteName: 'thebellepoque.dev',
    });
  });

  it('configura OpenGraph con tipo article y metadatos de artículo', () => {
    const result = buildMetadata({
      title: 'Post',
      description: 'Desc',
      type: 'article',
      publishedTime: '2025-11-01',
      tags: ['react', 'typescript'],
    });

    expect(result.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2025-11-01',
      tags: ['react', 'typescript'],
    });
  });

  it('omite publishedTime y tags cuando el tipo es website', () => {
    const result = buildMetadata({
      title: 'Test',
      description: 'Desc',
      type: 'website',
      publishedTime: '2025-11-01',
      tags: ['react'],
    });

    expect(result.openGraph).not.toHaveProperty('publishedTime');
    expect(result.openGraph).not.toHaveProperty('tags');
  });

  it('configura OpenGraph image con dimensiones 1200x630', () => {
    const result = buildMetadata({ title: 'Test', description: 'Desc' });

    const ogImages = result.openGraph?.images as Array<Record<string, unknown>>;
    expect(ogImages[0]).toMatchObject({
      width: 1200,
      height: 630,
      type: 'image/webp',
    });
  });

  it('configura Twitter Card como summary_large_image', () => {
    const result = buildMetadata({ title: 'Test', description: 'Desc' });

    expect(result.twitter).toMatchObject({
      card: 'summary_large_image',
      site: `@${SITE_CONFIG.username}`,
      creator: `@${SITE_CONFIG.username}`,
    });
  });

  it('incluye la descripción en Twitter Card', () => {
    const result = buildMetadata({
      title: 'Test',
      description: 'Mi descripción',
    });

    expect(result.twitter).toMatchObject({
      description: 'Mi descripción',
      title: `Test | ${SITE_CONFIG.name} | ${SITE_CONFIG.title}`,
    });
  });

  it('añade directivas robots cuando se proporcionan', () => {
    const result = buildMetadata({
      title: 'Test',
      description: 'Desc',
      robots: 'noindex',
    });

    expect(result.robots).toEqual({
      index: false,
      follow: true,
    });
  });

  it('parsea noindex y nofollow en robots', () => {
    const result = buildMetadata({
      title: 'Test',
      description: 'Desc',
      robots: 'noindex, nofollow',
    });

    expect(result.robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it('no añade robots cuando no se proporciona', () => {
    const result = buildMetadata({ title: 'Test', description: 'Desc' });

    expect(result.robots).toBeUndefined();
  });
});

describe('buildHomeJsonLd', () => {
  it('devuelve un schema Person', () => {
    const result = buildHomeJsonLd();

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('Person');
  });

  it('incluye nombre y alternateName', () => {
    const result = buildHomeJsonLd();

    expect(result.name).toBe('Ione Rodríguez');
    expect(result.alternateName).toBe('thebellepoque');
  });

  it('incluye la URL del sitio', () => {
    const result = buildHomeJsonLd();

    expect(result.url).toBe(SITE_CONFIG.baseUrl);
  });

  it('incluye la imagen de perfil', () => {
    const result = buildHomeJsonLd();

    expect(result.image).toBe(`${SITE_CONFIG.baseUrl}/profile.webp`);
  });

  it('incluye enlaces sameAs a redes sociales', () => {
    const result = buildHomeJsonLd();

    expect(result.sameAs).toEqual([
      SITE_CONFIG.social.github,
      SITE_CONFIG.social.linkedin,
    ]);
  });

  it('incluye jobTitle y description', () => {
    const result = buildHomeJsonLd();

    expect(result.jobTitle).toBe('Full-stack Developer');
    expect(result.description).toContain('full-stack');
  });
});

describe('buildBlogJsonLd', () => {
  const mockPosts = [
    {
      title: 'Post 1',
      description: 'Desc 1',
      date: '2025-01-01',
      slug: 'post-1',
    },
    {
      title: 'Post 2',
      description: 'Desc 2',
      date: '2025-06-15',
      slug: 'post-2',
    },
  ];

  it('devuelve un schema CollectionPage', () => {
    const result = buildBlogJsonLd(mockPosts);

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('CollectionPage');
  });

  it('usa el título y descripción del blog desde config', () => {
    const result = buildBlogJsonLd(mockPosts);

    expect(result.name).toBe(SITE_CONFIG.blog.title);
    expect(result.description).toBe(SITE_CONFIG.blog.description);
  });

  it('construye la URL y @id de la colección', () => {
    const result = buildBlogJsonLd(mockPosts);

    expect(result.url).toBe(`${SITE_CONFIG.baseUrl}/blog`);
    expect(result['@id']).toBe(`${SITE_CONFIG.baseUrl}/blog#collectionpage`);
  });

  it('mapea cada post a un BlogPosting en hasPart', () => {
    const result = buildBlogJsonLd(mockPosts);
    const hasPart = result.hasPart as Array<Record<string, unknown>>;

    expect(hasPart).toHaveLength(2);
    expect(hasPart[0]).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Post 1',
      description: 'Desc 1',
      datePublished: '2025-01-01',
      url: `${SITE_CONFIG.baseUrl}/blog/post-1`,
    });
  });

  it('devuelve hasPart vacío cuando no hay posts', () => {
    const result = buildBlogJsonLd([]);
    const hasPart = result.hasPart as unknown[];

    expect(hasPart).toHaveLength(0);
  });
});

describe('buildBlogPostJsonLd', () => {
  const mockPost = {
    title: 'Mi Post',
    description: 'Descripción del post',
    date: '2025-11-01',
    slug: 'mi-post',
    image: '/images/mi-post.webp',
  };

  it('devuelve un schema BlogPosting', () => {
    const result = buildBlogPostJsonLd(mockPost);

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('BlogPosting');
  });

  it('incluye headline, description y datePublished', () => {
    const result = buildBlogPostJsonLd(mockPost);

    expect(result.headline).toBe('Mi Post');
    expect(result.description).toBe('Descripción del post');
    expect(result.datePublished).toBe('2025-11-01');
  });

  it('construye la URL absoluta de la imagen', () => {
    const result = buildBlogPostJsonLd(mockPost);

    expect(result.image).toBe(`${SITE_CONFIG.baseUrl}/images/mi-post.webp`);
  });

  it('usa imagen por defecto cuando el post no tiene imagen', () => {
    const postWithoutImage = { ...mockPost, image: undefined };
    const result = buildBlogPostJsonLd(postWithoutImage);

    expect(result.image).toBe(`${SITE_CONFIG.baseUrl}/profile.webp`);
  });

  it('construye URL y @id del post', () => {
    const result = buildBlogPostJsonLd(mockPost);

    expect(result.url).toBe(`${SITE_CONFIG.baseUrl}/blog/mi-post`);
    expect(result['@id']).toBe(`${SITE_CONFIG.baseUrl}/blog/mi-post#blogposting`);
    expect(result.mainEntityOfPage).toBe(`${SITE_CONFIG.baseUrl}/blog/mi-post`);
  });

  it('incluye el autor con schema Person', () => {
    const result = buildBlogPostJsonLd(mockPost);
    const author = result.author as Record<string, unknown>;

    expect(author['@type']).toBe('Person');
    expect(author.name).toBe('Ione Rodríguez');
    expect(author.url).toBe(SITE_CONFIG.baseUrl);
  });
});

describe('buildProjectJsonLd', () => {
  const mockProject = {
    id: 'mi-proyecto',
    title: 'Mi Proyecto',
    shortDescription: 'Descripción corta',
    image: '/og-image-default.jpg',
    date: '2025-11',
    technologies: ['React', 'TypeScript', 'Node'],
  };

  it('devuelve un schema CreativeWork', () => {
    const result = buildProjectJsonLd(mockProject);

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('CreativeWork');
  });

  it('incluye name, description y datePublished', () => {
    const result = buildProjectJsonLd(mockProject);

    expect(result.name).toBe('Mi Proyecto');
    expect(result.description).toBe('Descripción corta');
    expect(result.datePublished).toBe('2025-11');
  });

  it('construye URL absoluta para imagen relativa', () => {
    const result = buildProjectJsonLd(mockProject);

    expect(result.image).toBe(`${SITE_CONFIG.baseUrl}/og-image-default.jpg`);
  });

  it('preserva URLs absolutas en la imagen', () => {
    const project = { ...mockProject, image: 'https://cdn.example.com/img.jpg' };
    const result = buildProjectJsonLd(project);

    expect(result.image).toBe('https://cdn.example.com/img.jpg');
  });

  it('construye URL y @id del proyecto', () => {
    const result = buildProjectJsonLd(mockProject);

    expect(result.url).toBe(`${SITE_CONFIG.baseUrl}/proyecto/mi-proyecto`);
    expect(result['@id']).toBe(
      `${SITE_CONFIG.baseUrl}/proyecto/mi-proyecto#creativework`,
    );
  });

  it('incluye el autor con schema Person', () => {
    const result = buildProjectJsonLd(mockProject);
    const author = result.author as Record<string, unknown>;

    expect(author['@type']).toBe('Person');
    expect(author.name).toBe('Ione Rodríguez');
  });

  it('incluye las tecnologías como keywords', () => {
    const result = buildProjectJsonLd(mockProject);

    expect(result.keywords).toBe('React, TypeScript, Node');
  });
});
