import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BlogList } from './BlogList';
import { checkA11y } from '../../test/a11y-utils';
import type { BlogPost } from '../../lib/posts';

const mockPosts: BlogPost[] = [
  { slug: 'test-post', title: 'Test Post', description: 'Desc', date: '2025-01-01', tags: ['react'] },
];

function renderBlogList(posts: BlogPost[] = mockPosts) {
  return render(
    <MemoryRouter>
      <BlogList posts={posts} />
    </MemoryRouter>,
  );
}

describe('BlogList - Renderizado con prop', () => {
  it('renderiza los posts recibidos por prop', () => {
    renderBlogList();
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('renderiza estado vacío cuando posts es array vacío', () => {
    renderBlogList([]);
    expect(screen.getByText(/aún no hay posts publicados/i)).toBeInTheDocument();
  });

  it('usa SectionTitle para el título de la sección', () => {
    renderBlogList();
    const heading = screen.getByRole('heading', { name: /blog/i });
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveClass('title-neon', 'text-gradient');
  });
});

describe('BlogList a11y', () => {
  it('should have no accessibility violations', async () => {
    const { container } = renderBlogList();
    const results = await checkA11y(container);
    expect(results).toHaveNoViolations();
  });

  it.skip('color contrast requires manual browser verification', async () => {
    // TODO: axe color-contrast rule doesn't work in jsdom, test manually in browser
  });
});
