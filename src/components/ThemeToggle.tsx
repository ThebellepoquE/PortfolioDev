import { useTheme } from '../hooks/useTheme';

/**
 * Botón toggle para cambiar entre modo oscuro y claro
 * Icono animado sol/luna con transiciones suaves
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF01F] active:scale-95 transition-transform duration-200"
      aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      {/* Sol - modo claro */}
      <svg
        className={`w-6 h-6 stroke-[#FFD700] fill-none transition-all duration-300 group-hover:rotate-45 ${
          theme === 'light'
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 -rotate-90 opacity-0 absolute'
        }`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      {/* Luna - modo oscuro */}
      <svg
        className={`w-6 h-6 stroke-[#00BFFF] fill-none transition-all duration-300 ${
          theme === 'dark'
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 rotate-90 opacity-0 absolute'
        }`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
