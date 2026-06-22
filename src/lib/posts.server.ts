import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
}

const postsDirectory = join(process.cwd(), 'content/posts');

/**
 * Read all published blog posts from content/posts/.
 * Each post lives in content/posts/<slug>/<nn>-index.md.
 * Returns posts sorted by date ascending (oldest first).
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = await readdir(postsDirectory, { withFileTypes: true });
  const dirs = slugs.filter((d) => d.isDirectory()).map((d) => d.name);

  const posts: BlogPost[] = [];

  for (const slug of dirs) {
    const dirPath = join(postsDirectory, slug);
    const files = await readdir(dirPath);
    const indexFile = files.find((f) => f.endsWith('-index.md'));
    if (!indexFile) continue;

    const raw = await readFile(join(dirPath, indexFile), 'utf-8');
    const { data } = matter(raw);

    // Skip drafts in production
    if (data.draft === true && process.env.NODE_ENV === 'production') continue;

    posts.push({
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date ? new Date(data.date).toISOString() : '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      image: data.image ?? undefined,
    });
  }

  // Sort by date ascending (oldest first) — matches current behaviour
  return posts.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

/**
 * Read a single post by slug. Returns null when the slug is unknown.
 */
export async function getPostBySlug(
  slug: string,
): Promise<{ meta: BlogPost; content: string } | null> {
  const dirPath = join(postsDirectory, slug);

  try {
    const files = await readdir(dirPath);
    const indexFile = files.find((f) => f.endsWith('-index.md'));
    if (!indexFile) return null;

    const raw = await readFile(join(dirPath, indexFile), 'utf-8');
    const { data, content } = matter(raw);

    // Skip drafts in production
    if (data.draft === true && process.env.NODE_ENV === 'production') return null;

    const meta: BlogPost = {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date ? new Date(data.date).toISOString() : '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      image: data.image ?? undefined,
    };

    return { meta, content: content.trim() };
  } catch {
    return null;
  }
}
