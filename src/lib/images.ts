/**
 * Helper to build srcSet and sizes attributes for responsive images.
 * Does not check that files exist — the browser falls back gracefully.
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
  const variant600 = `${dir}${name}-600${ext}`;
  const variant900 = `${dir}${name}-900${ext}`;
  const avif600 = `${dir}${name}-600.avif`;
  const avif900 = `${dir}${name}-900.avif`;
  const avifFull = `${dir}${name}.avif`;

  return {
    src: imagePath,
    srcSet: `${variant600} 600w, ${variant900} 900w, ${imagePath} 1200w`,
    avifSrcSet: `${avif600} 600w, ${avif900} 900w, ${avifFull} 1200w`,
    // Single-column blog cards: list padding + card padding (~6rem mobile, ~8rem desktop)
    // and container max-width 56rem → ~832px image slot on desktop.
    sizes: '(max-width: 767px) calc(100vw - 6rem), 832px',
    loading: 'lazy',
    decoding: 'async',
    width: opts.width,
    height: opts.height,
    alt: opts.alt,
    className: opts.className,
  };
}
