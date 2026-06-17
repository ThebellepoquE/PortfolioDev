import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

/** Type guard para validar strings de localStorage. */
function isTheme(value: string | null): value is Theme {
  return value === 'dark' || value === 'light';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const root = document.documentElement;
  if (root.classList.contains('light')) return 'light';
  if (root.classList.contains('dark')) return 'dark';

  const savedTheme = localStorage.getItem('theme');
  if (isTheme(savedTheme)) return savedTheme;

  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';

  return 'dark';
}

/**
 * Hook personalizado para gestionar el tema (dark/light mode)
 * - Persiste la preferencia en localStorage
 * - Detecta preferencia del sistema si no hay guardada
 * - Aplica la clase 'light' al documento para CSS
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
