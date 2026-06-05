import { describe, it, expect } from 'vitest';
import { buildImageAttrs } from './images';

const baseOpts = { alt: '', width: 1200, height: 675 };

describe('buildImageAttrs', () => {
  it('returns srcSet with -600.webp variant and original', () => {
    const result = buildImageAttrs('/images/blog/post.webp', baseOpts);

    expect(result.srcSet).toBe('/images/blog/post-600.webp 600w, /images/blog/post.webp 1200w');
  });

  it('returns appropriate sizes for card (width < 1000 uses max-width query)', () => {
    const result = buildImageAttrs('/images/project.png', baseOpts);

    expect(result.sizes).toBe('(max-width: 767px) 100vw, 600px');
  });

  it('handles PNG source files correctly (srcSet points to -600.webp variant)', () => {
    const result = buildImageAttrs('/images/screenshot.png', baseOpts);

    expect(result.srcSet).toBe('/images/screenshot-600.png 600w, /images/screenshot.png 1200w');
  });

  it('handles files with no extension gracefully', () => {
    const result = buildImageAttrs('/images/naked-file', baseOpts);

    expect(result.srcSet).toBe('/images/naked-file-600 600w, /images/naked-file 1200w');
  });

  it('handles files in root without directory', () => {
    const result = buildImageAttrs('hero.jpg', baseOpts);

    expect(result.srcSet).toBe('hero-600.jpg 600w, hero.jpg 1200w');
  });

  it('handles multiple dots in filename', () => {
    const result = buildImageAttrs('/images/photo.min.webp', baseOpts);

    expect(result.srcSet).toBe('/images/photo.min-600.webp 600w, /images/photo.min.webp 1200w');
  });
});
