'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPostBodyProps {
  content: string;
}

/**
 * Client component that renders markdown content via react-markdown.
 * Must be a Client Component because react-markdown uses browser APIs.
 */
export function BlogPostBody({ content }: BlogPostBodyProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
