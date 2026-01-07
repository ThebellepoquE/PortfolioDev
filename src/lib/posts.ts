export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
}

// Importar todos los posts en build time (eager = síncrono)
const postModules = import.meta.glob('/content/posts/*/index.md', { 
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parsePost(path: string, content: string): BlogPost | null {
  const slug = path.split('/')[3]; // /content/posts/[slug]/index.md
  
  // Parse YAML frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  
  const frontmatter = frontmatterMatch[1];
  const title = frontmatter.match(/title:\s*(.+)/)?.[1]?.trim() || slug;
  const description = frontmatter.match(/description:\s*(.+)/)?.[1]?.trim() || '';
  const date = frontmatter.match(/date:\s*(.+)/)?.[1]?.trim() || '';
  
  // Parse tags array
  const tagsMatch = frontmatter.match(/tags:\n((?:\s*-\s*.+\n?)*)/);
  const tags = tagsMatch 
    ? tagsMatch[1].split('\n').filter(line => line.trim()).map(line => line.replace(/^\s*-\s*/, '').trim())
    : [];
  
  // Get image if exists
  const imageMatch = frontmatter.match(/image:\s*(.+)/);
  const image = imageMatch ? imageMatch[1].trim() : undefined;
  
  // Check if draft
  const draftMatch = frontmatter.match(/draft:\s*(true|false)/);
  const isDraft = draftMatch?.[1] === 'true';
  
  // Skip drafts in production
  if (isDraft && import.meta.env.PROD) return null;
  
  return { slug, title, description, date, tags, image };
}

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  
  for (const [path, content] of Object.entries(postModules)) {
    const post = parsePost(path, content);
    if (post) posts.push(post);
  }
  
  // Ordenar por fecha ascendente (más antiguo primero)
  return posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPostBySlug(slug: string): { meta: BlogPost; content: string } | null {
  const path = `/content/posts/${slug}/index.md`;
  const rawContent = postModules[path];
  
  if (!rawContent) return null;
  
  const post = parsePost(path, rawContent);
  if (!post) return null;
  
  // Extract markdown content (after frontmatter)
  const frontmatterMatch = rawContent.match(/^---\n[\s\S]*?\n---\n?/);
  const markdownContent = frontmatterMatch 
    ? rawContent.slice(frontmatterMatch[0].length).trim()
    : rawContent;
  
  return { meta: post, content: markdownContent };
}
