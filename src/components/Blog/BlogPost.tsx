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
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-4">
        <p className="text-[#FF1493] text-xl">Post no encontrado</p>
        <Link to="/blog" className="text-[#00FF00] hover:text-[#FFF01F]">
          ← Volver al blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen flex justify-center px-6 sm:px-8 md:px-12 lg:px-16" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="w-full max-w-3xl">{/* Back link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#00FF00] transition-colors mb-12"
        >
          <span>←</span> Volver al blog
        </Link>

        {/* Header */}
        <header className="mb-16">
          {/* Imagen destacada */}
          {post.meta.image && (
            <img 
              src={post.meta.image} 
              alt={post.meta.title}
              className="w-full h-64 sm:h-80 object-cover rounded-lg mb-8"
            />
          )}
          
          {/* Título primero */}
          <h1 className="text-1xl sm:text-3xl lg:text-4xl font-black text-[#FF1493] leading-tight mb-6">
            {post.meta.title}
          </h1>

          {/* Meta info debajo */}
          <div className="flex items-center gap-3 text-sm text-[#666]">
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
        <div className="prose prose-invert prose-pink max-w-none markdown-content text-sm sm:text-base text-[#F5F5F5]/90 leading-relaxed">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
