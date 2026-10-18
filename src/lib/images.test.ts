import { describe, it, expect } from 'vitest';
import { buildImageAttrs } from './images';

const baseOpts = { alt: '', width: 1200, height: 675 };

describe('buildImageAttrs', () => {
  it('returns srcSet with 600w, 900w, and original 1200w variants', () => {
    const result = buildImageAttrs('/images/blog/post.webp', baseOpts);

    expect(result.srcSet).toBe(
      '/images/blog/post-600.webp 600w, /images/blog/post-900.webp 900w, /images/blog/post.webp 1200w',
    );
    expect(result.avifSrcSet).toBe(
      '/images/blog/post-600.avif 600w, /images/blog/post-900.avif 900w, /images/blog/post.avif 1200w',
    );
  });

  it('returns sizes matching the single-column blog card layout', () => {
    const result = buildImageAttrs('/images/project.png', baseOpts);

    expect(result.sizes).toBe('(max-width: 767px) calc(100vw - 6rem), 832px');
  });

  it('handles PNG source files correctly', () => {
    const result = buildImageAttrs('/images/screenshot.png', baseOpts);

    expect(result.srcSet).toBe(
      '/images/screenshot-600.png 600w, /images/screenshot-900.png 900w, /images/screenshot.png 1200w',
    );
  });

  it('handles files with no extension gracefully', () => {
    const result = buildImageAttrs('/images/naked-file', baseOpts);

    expect(result.srcSet).toBe(
      '/images/naked-file-600 600w, /images/naked-file-900 900w, /images/naked-file 1200w',
    );
  });

  it('handles files in root without directory', () => {
    const result = buildImageAttrs('hero.jpg', baseOpts);

    expect(result.srcSet).toBe('hero-600.jpg 600w, hero-900.jpg 900w, hero.jpg 1200w');
  });

  it('handles multiple dots in filename', () => {
    const result = buildImageAttrs('/images/photo.min.webp', baseOpts);

    expect(result.srcSet).toBe(
      '/images/photo.min-600.webp 600w, /images/photo.min-900.webp 900w, /images/photo.min.webp 1200w',
    );
  });
});
