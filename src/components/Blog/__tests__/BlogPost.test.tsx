import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BlogPost } from '../BlogPost';

const mockGetPostBySlug = vi.fn();
const mockFormatDate = vi.fn((value: string) => value);

vi.mock('../../../lib/posts', () => ({
  getPostBySlug: (slug: string) => mockGetPostBySlug(slug),
}));

vi.mock('../../../lib/formatDate', () => ({
  formatDateDayMonthYear: (value: string) => mockFormatDate(value),
}));

/** Renderiza BlogPost con la ruta /blog/:slug para que useParams tenga slug */
function renderBlogPost(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/blog/${slug}`]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('BlogPost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFormatDate.mockImplementation((value: string) => value);
  });

  describe('Post no encontrado', () => {
    it('muestra mensaje y enlace cuando slug no devuelve post', () => {
      mockGetPostBySlug.mockReturnValue(null);
      renderBlogPost('no-existe');

      expect(screen.getByText('Post no encontrado')).toBeInTheDocument();
      const backLink = screen.getByRole('link', { name: /volver al blog/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/blog');
    });

    it('llama a getPostBySlug con el slug de la URL', () => {
      mockGetPostBySlug.mockReturnValue(null);
      renderBlogPost('mi-post');

      expect(mockGetPostBySlug).toHaveBeenCalledWith('mi-post');
    });
  });

  describe('Post encontrado', () => {
    const mockPost = {
      meta: {
        slug: 'test-post',
        title: 'Título del post',
        description: 'Descripción corta',
        date: '2025-01-15',
        tags: ['react', 'testing'],
        image: '/images/post.webp',
      },
      content: '## Subtítulo\n\nPárrafo con **negrita** y [enlace](https://example.com).',
    };

    beforeEach(() => {
      mockGetPostBySlug.mockReturnValue(mockPost);
      mockFormatDate.mockReturnValue('15 de enero de 2025');
    });

    it('muestra título, fecha formateada y tags', () => {
      renderBlogPost('test-post');

      expect(screen.getByRole('heading', { level: 1, name: 'Título del post' })).toBeInTheDocument();
      expect(screen.getByText('15 de enero de 2025')).toBeInTheDocument();
      expect(screen.getByText('react, testing')).toBeInTheDocument();
    });

    it('incluye enlace "Volver al blog"', () => {
      renderBlogPost('test-post');

      const backLink = screen.getByRole('link', { name: /volver al blog/i });
      expect(backLink).toHaveAttribute('href', '/blog');
    });

    it('muestra imagen destacada cuando post.meta.image existe', () => {
      renderBlogPost('test-post');

      const img = screen.getByRole('img', { name: 'Título del post' });
      expect(img).toHaveAttribute('src', '/images/post.webp');
    });

    it('renderiza el contenido markdown (encabezados y párrafos)', () => {
      renderBlogPost('test-post');

      expect(screen.getByRole('heading', { level: 2, name: 'Subtítulo' })).toBeInTheDocument();
      expect(screen.getByText(/Párrafo con/)).toBeInTheDocument();
    });

    it('llama a formatDateDayMonthYear con la fecha del post', () => {
      renderBlogPost('test-post');

      expect(mockFormatDate).toHaveBeenCalledWith('2025-01-15');
    });
  });
});
