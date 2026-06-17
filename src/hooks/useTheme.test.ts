import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// Reset localStorage, matchMedia y clases del documento entre tests
beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark', 'light');
  vi.restoreAllMocks();
});

describe('useTheme', () => {
  it('devuelve dark por defecto si no hay preferencia guardada', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('respeta preferencia del sistema light', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('restaura tema desde localStorage', () => {
    localStorage.setItem('theme', 'light');
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('toggleTheme alterna entre dark y light', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('ignora valores inválidos de localStorage', () => {
    localStorage.setItem('theme', 'invalid');
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark'); // fallback a dark
  });

  it('respeta la clase light ya presente en el documento', () => {
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'dark');
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');

    document.documentElement.classList.remove('light');
  });
});
