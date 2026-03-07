import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../../lib/posts';
import { formatDateDayMonthYear } from '../../lib/formatDate';
import { SEO } from '../SEO';

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

  // Generar datos estructurados (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.meta.title,
    "description": post.meta.description,
    "image": post.meta.image ? `https://thebellepoque.dev${post.meta.image}` : "https://thebellepoque.dev/profile.webp",
    "datePublished": post.meta.date,
    "author": {
      "@type": "Person",
      "name": "Ione Rodríguez",
      "url": "https://thebellepoque.dev"
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
      />
      {/* Inyectar Datos Estructurados */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            {post.meta.image && (
              <img 
                src={post.meta.image} 
                alt={post.meta.title}
                className="blog-post__image"
              />
            )}
            
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
