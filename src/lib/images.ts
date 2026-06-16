/**
 * Helper para generar atributos srcSet y sizes para imágenes responsive.
 * No verifica existencia de archivos — el navegador degrada gracefulmente.
 */

export interface ImageAttrs {
  src: string;
  srcSet: string;
  avifSrcSet: string;
  sizes: string;
  loading: 'lazy' | 'eager';
  decoding: 'async' | 'auto' | 'sync';
  width: number;
  height: number;
  alt: string;
  className?: string;
}

export function buildImageAttrs(
  imagePath: string,
  opts: { alt: string; width: number; height: number; className?: string },
): ImageAttrs {
  const dir = imagePath.substring(0, imagePath.lastIndexOf('/') + 1);
  const base = imagePath.substring(imagePath.lastIndexOf('/') + 1);
  const extIndex = base.lastIndexOf('.');
  const name = extIndex > 0 ? base.substring(0, extIndex) : base;
  const ext = extIndex > 0 ? base.substring(extIndex) : '';
  const variant = `${dir}${name}-600${ext}`;
  const avifVariant = `${dir}${name}-600.avif`;
  const avifFull = `${dir}${name}.avif`;

  return {
    src: imagePath,
    srcSet: `${variant} 600w, ${imagePath} 1200w`,
    avifSrcSet: `${avifVariant} 600w, ${avifFull} 1200w`,
    sizes: '(max-width: 767px) 100vw, 600px',
    loading: 'lazy',
    decoding: 'async',
    width: opts.width,
    height: opts.height,
    alt: opts.alt,
    className: opts.className,
  };
}
