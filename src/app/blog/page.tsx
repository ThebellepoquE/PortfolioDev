import type { Metadata } from 'next';
import { BlogList } from '@/components/Blog/BlogList';
import { getAllPosts } from '@/lib/posts.server';
import { buildMetadata, buildBlogJsonLd } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description:
    'El Laberinto del Código: pensamientos sobre desarrollo, automatización y el ecosistema de JavaScript.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getAllPosts();
  const jsonLd = buildBlogJsonLd(posts);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogList posts={posts} />
    </>
  );
}
