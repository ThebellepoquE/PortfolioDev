import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

/** Navbar con logo de 3 puntos y navegación */
export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {/* Navbar superior */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] flex justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="w-full flex items-center px-4 py-4 sm:px-6 sm:py-5 md:px-8 lg:px-12 xl:px-[50px]" style={{ maxWidth: '1400px' }}>
          {/* Logo - 3 puntos fluorescentes */}
          <Link
            to="/"
            aria-label="Ir al inicio"
            className="flex gap-1.5 sm:gap-2 hover:scale-110 transition-transform duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF1493]"
          >
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF1493] glow-pink" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFF01F] glow-yellow" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#00FF00] glow-green" />
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Links de navegación - visible solo en desktop */}
          <div className="hidden md:flex gap-4 lg:gap-8 items-center">
            {isHome ? (
              <>
                <a
                  href="#inicio"
                  className="font-medium hover:text-[#FF1493] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF1493]"
                  style={{ color: 'var(--text)' }}
                >
                  Inicio
                </a>
                <a
                  href="#proyectos"
                  className="font-medium hover:text-[#FFF01F] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF01F]"
                  style={{ color: 'var(--text)' }}
                >
                  Proyectos
                </a>
                <a
                  href="#contacto"
                  className="font-medium hover:text-[#00FF00] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF00]"
                  style={{ color: 'var(--text)' }}
                >
                  Contacto
                </a>
              </>
            ) : (
              <Link
                to="/"
                className="font-medium hover:text-[#FF1493] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF1493]"
                style={{ color: 'var(--text)' }}
              >
                ← Home
              </Link>
            )}
            <Link
              to="/blog"
              className={`font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF01F] ${
                location.pathname.startsWith('/blog') 
                  ? 'text-[#FFF01F]' 
                  : 'hover:text-[#FFF01F]'
              }`}
              style={{ color: location.pathname.startsWith('/blog') ? '#FFF01F' : 'var(--text)' }}
            >
              Blog
            </Link>
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* GitHub icon */}
            <a
              href="https://github.com/ThebellepoquE"
              target="_blank"
              rel="noopener noreferrer"
              className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF01F]"
              aria-label="GitHub"
            >
              <svg
                className="w-6 h-6 stroke-[#FF1493] group-hover:stroke-[#00FF00] fill-none transition-colors duration-300"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Dock - Visible solo en móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] pb-safe">
        <div className="mx-4 mb-4 px-6 py-3 rounded-2xl backdrop-blur-xl shadow-2xl border transition-all duration-300" style={{ 
          backgroundColor: 'rgba(var(--bg-card-rgb), 0.8)',
          borderColor: 'var(--border)'
        }}>
          <div className="flex justify-around items-center gap-2">
            {isHome ? (
              <>
                {/* Icono Home */}
                <a
                  href="#inicio"
                  className="group flex flex-col items-center gap-1 p-2 active:scale-95 transition-all duration-200"
                >
                  <div className="relative">
                    <svg
                      className="w-7 h-7 stroke-[#FF1493] group-active:stroke-[#FF1493] group-active:scale-110 transition-all duration-300"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <span className="text-xs group-active:text-[#FF1493] transition-colors duration-200" style={{ color: 'var(--text)' }}>Inicio</span>
                </a>

                {/* Icono Proyectos */}
                <a
                  href="#proyectos"
                  className="group flex flex-col items-center gap-1 p-2 active:scale-95 transition-all duration-200"
                >
                  <div className="relative">
                    <svg
                      className="w-7 h-7 stroke-[#FFF01F] group-active:stroke-[#FFF01F] group-active:scale-110 transition-all duration-300"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span className="text-xs group-active:text-[#FFF01F] transition-colors duration-200" style={{ color: 'var(--text)' }}>Proyectos</span>
                </a>

                {/* Icono Blog */}
                <Link
                  to="/blog"
                  className="group flex flex-col items-center gap-1 p-2 active:scale-95 transition-all duration-200"
                >
                  <div className="relative">
                    <svg
                      className="w-7 h-7 stroke-[#00FF00] group-active:stroke-[#00FF00] group-active:scale-110 transition-all duration-300"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <span className="text-xs group-active:text-[#00FF00] transition-colors duration-200" style={{ color: 'var(--text)' }}>Blog</span>
                </Link>

                {/* Icono Contacto */}
                <a
                  href="#contacto"
                  className="group flex flex-col items-center gap-1 p-2 active:scale-95 transition-all duration-200"
                >
                  <div className="relative">
                    <svg
                      className="w-7 h-7 stroke-[#FF1493] group-active:stroke-[#FF1493] group-active:scale-110 transition-all duration-300"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="text-xs group-active:text-[#FF1493] transition-colors duration-200" style={{ color: 'var(--text)' }}>Contacto</span>
                </a>

                {/* Theme Toggle */}
                <div className="flex flex-col items-center gap-1 p-2">
                  <ThemeToggle />
                  <span className="text-xs text-[#F5F5F5]">Tema</span>
                </div>
              </>
            ) : (
              <>
                {/* Botón Home cuando estamos en otra página */}
                <Link
                  to="/"
                  className="group flex flex-col items-center gap-1 p-2 active:scale-95 transition-all duration-200"
                >
                  <div className="relative">
                    <svg
                      className="w-7 h-7 stroke-[#FF1493] group-active:stroke-[#FF1493] group-active:scale-110 transition-all duration-300"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <span className="text-xs group-active:text-[#FF1493] transition-colors duration-200" style={{ color: 'var(--text)' }}>Home</span>
                </Link>

                {/* Icono Blog - activo */}
                <Link
                  to="/blog"
                  className="group flex flex-col items-center gap-1 p-2 active:scale-95 transition-all duration-200"
                >
                  <div className="relative">
                    <svg
                      className={`w-7 h-7 group-active:scale-110 transition-all duration-300 ${
                        location.pathname.startsWith('/blog') 
                          ? 'stroke-[#FFF01F]' 
                          : 'stroke-[#00FF00] group-active:stroke-[#00FF00]'
                      }`}
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <span className={`text-xs transition-colors duration-200 ${
                    location.pathname.startsWith('/blog')
                      ? 'text-[#FFF01F]'
                      : 'group-active:text-[#00FF00]'
                  }`} style={{ color: location.pathname.startsWith('/blog') ? '#FFF01F' : 'var(--text)' }}>Blog</span>
                </Link>

                {/* Theme Toggle */}
                <div className="flex flex-col items-center gap-1 p-2">
                  <ThemeToggle />
                  <span className="text-xs" style={{ color: 'var(--text)' }}>Tema</span>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
