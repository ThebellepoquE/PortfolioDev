import { Link } from 'react-router-dom';
import { getAllPosts } from '../../lib/posts';

/** Lista de posts del blog */
export function BlogList() {
  const posts = getAllPosts();

  return (
    <section className="min-h-screen flex justify-center px-6 sm:px-8 md:px-12 lg:px-16 transition-colors duration-300" style={{ paddingTop: '120px', paddingBottom: '80px', backgroundColor: 'var(--bg-dark)' }}>
      <div className="w-full max-w-4xl">{/* Header */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-4 transition-colors duration-300" style={{ color: 'var(--text)' }}>
          Blog
        </h1>

        <p className="text-sm sm:text-base text-center mb-12 max-w-xl mx-auto transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}>
          Desarrollo, automatizaciones y aprendizajes en el camino tech
        </p>

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg mb-4 transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}>Aún no hay posts publicados</p>
            <p className="text-sm transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}>¡Pronto compartiré contenido nuevo!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block p-6 sm:p-8 border hover:border-[#00FF00]/50 rounded-lg transition-all duration-300 group"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="flex flex-col gap-4">
                  {/* Imagen destacada */}
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                  
                  {/* Fecha y Tags en línea */}
                  <div className="flex items-center gap-3 text-xs transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}>
                    <time>
                      {new Date(post.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <span>•</span>
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Título */}
                  <h2 className="text-xl sm:text-2xl font-bold group-hover:text-[#00FF00] transition-colors" style={{ color: 'var(--text)' }}>
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm sm:text-base leading-relaxed transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}>
                    {post.description}
                  </p>

                  {/* Read more */}
                  <span className="text-sm text-[#FFF01F] group-hover:text-[#00FF00] transition-colors font-medium">
                    Leer artículo →
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
