import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockGetAllPosts = vi.fn(() => [
  { slug: 'test-post', title: 'Test Post', description: 'Desc', date: '2025-01-01', tags: ['react'] },
]);

vi.mock('../../lib/posts', () => ({
  getAllPosts: () => mockGetAllPosts(),
}));

import { BlogList } from './BlogList';

function renderBlogList() {
  return render(
    <MemoryRouter>
      <BlogList />
    </MemoryRouter>,
  );
}

describe('BlogList - Memoización de getAllPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('llama a getAllPosts exactamente una vez en el primer render', () => {
    renderBlogList();
    expect(mockGetAllPosts).toHaveBeenCalledTimes(1);
  });

  it('NO vuelve a llamar a getAllPosts en un re-render (useMemo)', () => {
    const { rerender } = render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>,
    );

    expect(mockGetAllPosts).toHaveBeenCalledTimes(1);

    rerender(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>,
    );

    expect(mockGetAllPosts).toHaveBeenCalledTimes(1);
  });

  it('renderiza los posts devueltos', () => {
    renderBlogList();
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('usa SectionTitle para el título de la sección', () => {
    renderBlogList();
    const heading = screen.getByRole('heading', { name: /blog/i });
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveClass('title-neon', 'text-gradient');
  });
});
