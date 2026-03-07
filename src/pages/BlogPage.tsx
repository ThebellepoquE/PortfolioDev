import { SEO } from '../components/SEO';
import { BlogList } from '../components/Blog/BlogList';

/** Página listado del blog */
export function BlogPage() {
  return (
    <>
      <SEO
        title="Blog"
        description="El Laberinto del Código: pensamientos sobre desarrollo, automatización y el ecosistema de JavaScript."
        url="/blog"
      />
      <BlogList />
    </>
  );
}
