import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../../lib/posts';
import { formatDateDayMonthYear } from '../../lib/formatDate';
import { SEO } from '../SEO';
import { SITE_CONFIG } from '../../lib/config';
import { buildImageAttrs } from '../../lib/images';
import type { JsonLd } from '../../lib/jsonLd';

/** Renderiza un post individual */
export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  const post = useMemo(() => {
    return slug ? getPostBySlug(slug) : null;
  }, [slug]);

  if (!post) {
    return (
      <div className="blog-post__error">
        <p className="blog-post__error-text">Post no encontrado</p>
        <Link to="/blog" className="blog-post__error-link">
          ← Volver al blog
        </Link>
      </div>
    );
  }

  const baseUrl = SITE_CONFIG.baseUrl;
  const postUrl = `${baseUrl}/blog/${post.meta.slug}`;

  // Generar datos estructurados (SEO)
  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.meta.title,
    "description": post.meta.description,
    "image": post.meta.image ? `${baseUrl}${post.meta.image}` : `${baseUrl}/profile.webp`,
    "datePublished": post.meta.date,
    "url": postUrl,
    "@id": `${postUrl}#blogposting`,
    "mainEntityOfPage": postUrl,
    "author": {
      "@type": "Person",
      "name": "Ione Rodríguez",
      "url": baseUrl,
      "@id": `${baseUrl}/#person`
    }
  };

  return (
    <article className="blog-post">
      <SEO
        title={post.meta.title}
        description={post.meta.description}
        image={post.meta.image}
        url={`/blog/${post.meta.slug}`}
        type="article"
        publishedTime={post.meta.date}
        tags={post.meta.tags}
        jsonLd={jsonLd}
      />

      <div className="blog-post__container">
        <Link 
          to="/blog" 
          className="blog-post__back"
        >
          <span>←</span> Volver al blog
        </Link>

        <div className="blog-post__article">
          {/* Header */}
          <header className="blog-post__header">
            {/* Imagen destacada */}
            {post.meta.image && (() => {
              const imgAttrs = buildImageAttrs(post.meta.image, {
                alt: post.meta.title,
                width: 1200,
                height: 675,
                className: 'blog-post__image',
              });
              return (
                <picture>
                  <source type="image/avif" srcSet={imgAttrs.avifSrcSet} sizes="(max-width: 767px) 100vw, 1200px" />
                  <source type="image/webp" srcSet={imgAttrs.srcSet} sizes="(max-width: 767px) 100vw, 1200px" />
                  <img
                    src={imgAttrs.src}
                    alt={imgAttrs.alt}
                    loading={imgAttrs.loading}
                    decoding={imgAttrs.decoding}
                    width={imgAttrs.width}
                    height={imgAttrs.height}
                    className={imgAttrs.className}
                  />
                </picture>
              );
            })()}
            
            {/* Título primero */}
            <h1 className="blog-post__title">
              {post.meta.title}
            </h1>

            {/* Meta info debajo */}
            <div className="blog-post__meta">
              <time dateTime={post.meta.date}>
                {formatDateDayMonthYear(post.meta.date)}
              </time>
              <span>•</span>
              <span>{post.meta.tags.join(', ')}</span>
            </div>
          </header>

          {/* Content */}
          <div className="blog-post__content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </article>
  );
}
