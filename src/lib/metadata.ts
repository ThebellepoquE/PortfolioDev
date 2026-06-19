import type { Metadata } from 'next';
import { SITE_CONFIG } from './config';

const OG_IMAGE_DEFAULT = `${SITE_CONFIG.baseUrl}/og-image-default.webp`;

interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
  noSuffix?: boolean;
  robots?: string;
}

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  const base = SITE_CONFIG.baseUrl.replace(/\/$/, '');
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

/**
 * Build Next.js Metadata object matching the previous SEO component behaviour.
 * Handles title suffix, OG, Twitter Cards, and canonical URL.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  tags,
  noSuffix = false,
  robots,
}: MetadataOptions): Metadata {
  const fullTitle = noSuffix ? title : `${title} | ${SITE_CONFIG.name} | ${SITE_CONFIG.title}`;
  const url = path ? absoluteUrl(path) : SITE_CONFIG.baseUrl;
  const imageUrl = image ? absoluteUrl(image) : OG_IMAGE_DEFAULT;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: 'image/webp',
        },
      ],
      url,
      siteName: 'thebellepoque.dev',
      type,
      locale: SITE_CONFIG.locale,
      ...(type === 'article' && publishedTime
        ? { publishedTime }
        : {}),
      ...(type === 'article' && tags?.length
        ? { tags }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: `@${SITE_CONFIG.username}`,
      creator: `@${SITE_CONFIG.username}`,
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };

  if (robots) {
    metadata.robots = { index: true, follow: true, ...parseRobots(robots) };
  }

  return metadata;
}

function parseRobots(robots: string): { index?: boolean; follow?: boolean } {
  const directives: { index?: boolean; follow?: boolean } = {};
  if (robots.includes('noindex')) directives.index = false;
  if (robots.includes('nofollow')) directives.follow = false;
  return directives;
}

// ---------------------------------------------------------------------------
// JSON-LD helpers (rendered as <script type="application/ld+json"> in pages)
// ---------------------------------------------------------------------------

export interface JsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

export function buildHomeJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ione',
    alternateName: 'thebellepoque',
    url: SITE_CONFIG.baseUrl,
    image: `${SITE_CONFIG.baseUrl}/profile.webp`,
    sameAs: [
      SITE_CONFIG.social.github,
      SITE_CONFIG.social.linkedin,
    ],
    jobTitle: 'Full-stack Developer',
    description:
      'Desarrolladora full-stack especializada en React, TypeScript y automatizaciones.',
  };
}

export function buildBlogJsonLd(posts: { title: string; description: string; date: string; slug: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: SITE_CONFIG.blog.title,
    description: SITE_CONFIG.blog.description,
    url: `${SITE_CONFIG.baseUrl}/blog`,
    '@id': `${SITE_CONFIG.baseUrl}/blog#collectionpage`,
    hasPart: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${SITE_CONFIG.baseUrl}/blog/${post.slug}`,
    })),
  };
}

export function buildBlogPostJsonLd(post: {
  title: string;
  description: string;
  date: string;
  slug: string;
  image?: string;
}): JsonLd {
  const postUrl = `${SITE_CONFIG.baseUrl}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image ? `${SITE_CONFIG.baseUrl}${post.image}` : `${SITE_CONFIG.baseUrl}/profile.webp`,
    datePublished: post.date,
    url: postUrl,
    '@id': `${postUrl}#blogposting`,
    mainEntityOfPage: postUrl,
    author: {
      '@type': 'Person',
      name: 'Ione Rodríguez',
      url: SITE_CONFIG.baseUrl,
      '@id': `${SITE_CONFIG.baseUrl}/#person`,
    },
  };
}

export function buildProjectJsonLd(project: {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
  date: string;
  technologies: string[];
}): JsonLd {
  const projectUrl = `${SITE_CONFIG.baseUrl}/proyecto/${project.id}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription,
    image: project.image.startsWith('http')
      ? project.image
      : `${SITE_CONFIG.baseUrl}${project.image}`,
    datePublished: project.date,
    url: projectUrl,
    '@id': `${projectUrl}#creativework`,
    author: {
      '@type': 'Person',
      name: 'Ione Rodríguez',
      url: SITE_CONFIG.baseUrl,
      '@id': `${SITE_CONFIG.baseUrl}/#person`,
    },
    keywords: project.technologies.join(', '),
  };
}
