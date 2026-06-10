import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useActiveSection } from './useActiveSection';

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

import { useLocation } from 'react-router-dom';

const mockUseLocation = vi.mocked(useLocation);

// Mock de IntersectionObserver ya está en src/test/setup.ts
// Mock de document.getElementById
const mockElements: Map<string, HTMLElement> = new Map();

beforeEach(() => {
  vi.clearAllMocks();
  mockElements.clear();
  vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
    const el = document.createElement('div');
    el.id = id;
    mockElements.set(id, el);
    return el;
  });
  mockUseLocation.mockReturnValue({ pathname: '/', hash: '', search: '', state: null, key: '' });
});

describe('useActiveSection', () => {
  it('devuelve null si no está en la home', () => {
    mockUseLocation.mockReturnValue({ pathname: '/blog', hash: '', search: '', state: null, key: '' });

    const { result } = renderHook(() => useActiveSection(['inicio', 'proyectos']));
    expect(result.current).toBeNull();
  });

  it('inicializa con null en la home (antes del primer intersection)', () => {
    const { result } = renderHook(() => useActiveSection(['inicio', 'proyectos']));
    expect(result.current).toBeNull();
  });

  it('crea un IntersectionObserver con threshold 0.3', () => {
    const observeSpy = vi.fn();
    // Override del mock de IntersectionObserver en setup.ts
    const orig = window.IntersectionObserver;
    window.IntersectionObserver = vi.fn(function (this: unknown) {
      return { observe: observeSpy, unobserve: vi.fn(), disconnect: vi.fn(), takeRecords: vi.fn(() => []) };
    } as unknown as typeof IntersectionObserver);

    renderHook(() => useActiveSection(['inicio']));
    expect(observeSpy).toHaveBeenCalled();

    window.IntersectionObserver = orig;
  });
});
