import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../../lib/posts';

/** Renderiza un post individual */
export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;

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

  return (
    <article className="blog-post">
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
              <time>
                {new Date(post.meta.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
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
