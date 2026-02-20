import { Link } from 'react-router-dom';
import { getAllPosts } from '../../lib/posts';

/** Lista de posts del blog */
export function BlogList() {
  const posts = getAllPosts();

  return (
    <section className="blog-list">
      <div className="blog-list__container">
        {/* Header */}
        <h1 className="blog-list__title text-gradient">
          Blog
        </h1>

        <p className="blog-list__subtitle">
          Desarrollo, automatizaciones y aprendizajes en el camino tech
        </p>

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="blog-list__empty">
            <p className="blog-list__empty-text">Aún no hay posts publicados</p>
            <p className="blog-list__empty-subtext">¡Pronto compartiré contenido nuevo!</p>
          </div>
        ) : (
          <div className="blog-list__grid">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="blog-card"
              >
                <div className="blog-card__content">
                  {/* Imagen destacada */}
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="blog-card__image"
                    />
                  )}
                  
                  {/* Fecha y Tags en línea */}
                  <div className="blog-card__meta">
                    <time>
                      {new Date(post.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <span>•</span>
                    <div className="blog-card__tags">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Título */}
                  <h2 className="blog-card__title">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="blog-card__description">
                    {post.description}
                  </p>

                  {/* Read more */}
                  <span className="blog-card__link">
                    Seguir leyendo →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

