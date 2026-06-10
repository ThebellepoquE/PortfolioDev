import { useMemo } from 'react';
import { SEO } from '../components/SEO';
import { BlogList } from '../components/Blog/BlogList';
import { SITE_CONFIG } from '../lib/config';
import { getAllPosts } from '../lib/posts';

/** Página listado del blog */
export function BlogPage() {
  const posts = useMemo(() => getAllPosts(), []);

  const jsonLd: Record<string, unknown> = {
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

  return (
    <>
      <SEO
        title="Blog"
        description="El Laberinto del Código: pensamientos sobre desarrollo, automatización y el ecosistema de JavaScript."
        url="/blog"
        jsonLd={jsonLd}
      />
      <BlogList posts={posts} />
    </>
  );
}
