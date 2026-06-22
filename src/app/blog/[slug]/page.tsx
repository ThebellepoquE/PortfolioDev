import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/posts.server';
import { formatDateDayMonthYear } from '@/lib/formatDate';
import { BlogPostBody } from '@/components/BlogPostBody';
import { buildMetadata, buildBlogPostJsonLd } from '@/lib/metadata';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.meta.title,
    description: post.meta.description,
    path: `/blog/${post.meta.slug}`,
    image: post.meta.image,
    type: 'article',
    publishedTime: post.meta.date,
    tags: post.meta.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = buildBlogPostJsonLd(post.meta);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="blog-post">
        <div className="blog-post__container">
          <Link href="/blog" className="blog-post__back">
            <span>←</span> Volver al blog
          </Link>

          <div className="blog-post__article">
            <header className="blog-post__header">
              {post.meta.image && (
                <Image
                  src={post.meta.image}
                  alt={post.meta.title}
                  width={1200}
                  height={675}
                  className="blog-post__image"
                  sizes="(max-width: 767px) 100vw, 1200px"
                  priority
                />
              )}

              <h1 className="blog-post__title">{post.meta.title}</h1>

              <div className="blog-post__meta">
                <time dateTime={post.meta.date}>
                  {formatDateDayMonthYear(post.meta.date)}
                </time>
                <span>•</span>
                <span>{post.meta.tags.join(', ')}</span>
              </div>
            </header>

            <div className="blog-post__content">
              <BlogPostBody content={post.content} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
