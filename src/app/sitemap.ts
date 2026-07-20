import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts.server';
import { projectsData } from '@/lib/projects';
import { SITE_CONFIG } from '@/lib/config';

const base = SITE_CONFIG.baseUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projectsData.map((p) => ({
    url: `${base}/proyecto/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date || now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
