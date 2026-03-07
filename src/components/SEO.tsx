import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '../lib/config';

/** Imagen por defecto para OG/Twitter (1200×630). public/og-image-default.jpg */
const OG_IMAGE_DEFAULT = `${SITE_CONFIG.baseUrl}/og-image-default.jpg`;

export interface SEOProps {
  /** Título de la página (se añade sufijo del sitio) */
  title: string;
  /** Meta description */
  description: string;
  /** URL absoluta o path (se convierte a absoluta con baseUrl) */
  image?: string;
  /** URL relativa o absoluta de la página (para canonical y og:url) */
  url?: string;
  /** "website" | "article" */
  type?: 'website' | 'article';
  /** Para article: fecha ISO */
  publishedTime?: string;
  /** Para article: tags */
  tags?: string[];
  /** Si false, no añade sufijo "| Ione | Full-stack Developer" al title */
  noSuffix?: boolean;
}

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  const base = SITE_CONFIG.baseUrl.replace(/\/$/, '');
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

/** Inyecta title, meta description, Open Graph y Twitter Cards en <head> */
export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  tags,
  noSuffix = false,
}: SEOProps) {
  const fullTitle = noSuffix ? title : `${title} | ${SITE_CONFIG.name} | ${SITE_CONFIG.title}`;
  const canonicalUrl = url ? absoluteUrl(url) : SITE_CONFIG.baseUrl;
  const imageUrl = image ? absoluteUrl(image) : OG_IMAGE_DEFAULT;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="thebellepoque.dev" />
      <meta property="og:type" content={type} />
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && tags?.length && (
        tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
