/**
 * Shared blog post metadata shape for client components and server loaders.
 * Content loading lives in `posts.server.ts` (fs); this module stays free of Vite glob / Node I/O.
 */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
}
