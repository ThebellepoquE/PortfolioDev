import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

/**
 * Hook personalizado para gestionar el tema (dark/light mode)
 * - Persiste la preferencia en localStorage
 * - Detecta preferencia del sistema si no hay guardada
 * - Aplica la clase 'light' al documento para CSS
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Pre-inicialización para evitar parpadeos y cumplir con ESLint
    if (typeof window === 'undefined') return 'dark';
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) return savedTheme;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;

    // Aplicar o remover clase 'light' en el HTML
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }

    // Guardar en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
