import { describe, expect, it } from 'vitest';
import type { BlogPost } from './posts';
import { getAllPosts, getPostBySlug } from './posts.server';

describe('posts type module', () => {
  it('define la forma BlogPost sin depender de import.meta.glob', () => {
    const post: BlogPost = {
      slug: 'ejemplo',
      title: 'Título',
      description: 'Descripción',
      date: '2026-01-01',
      tags: ['next'],
      image: '/images/blog/ejemplo.webp',
    };

    expect(post.slug).toBe('ejemplo');
    expect(post.tags).toEqual(['next']);
  });
});

describe('posts.server', () => {
  it('getAllPosts devuelve metadatos con forma BlogPost', async () => {
    const posts = await getAllPosts();
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.slug.length).toBeGreaterThan(0);
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(Array.isArray(post.tags)).toBe(true);
    }
  });

  it('getPostBySlug reutiliza el mismo tipo de meta', async () => {
    const posts = await getAllPosts();
    const first = posts[0];
    const loaded = await getPostBySlug(first.slug);

    expect(loaded).not.toBeNull();
    expect(loaded?.meta.slug).toBe(first.slug);
    expect(loaded?.meta.title).toBe(first.title);
    expect(typeof loaded?.content).toBe('string');
  });
});
