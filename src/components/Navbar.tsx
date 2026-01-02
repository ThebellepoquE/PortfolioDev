import { Link, useLocation } from 'react-router-dom';

/** Navbar con logo de 3 puntos y navegación */
export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-[#000000] flex justify-center">
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

        {/* Links de navegación - ocultos en móvil */}
        <div className="hidden md:flex gap-4 lg:gap-8 items-center">
          {isHome ? (
            <>
              <a
                href="#inicio"
                className="text-[#F5F5F5] font-medium hover:text-[#FF1493] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF1493]"
              >
                Inicio
              </a>
              <a
                href="#proyectos"
                className="text-[#F5F5F5] font-medium hover:text-[#FFF01F] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF01F]"
              >
                Proyectos
              </a>
              <a
                href="#contacto"
                className="text-[#F5F5F5] font-medium hover:text-[#00FF00] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF00]"
              >
                Contacto
              </a>
            </>
          ) : (
            <Link
              to="/"
              className="text-[#F5F5F5] font-medium hover:text-[#FF1493] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF1493]"
            >
              ← Home
            </Link>
          )}
          <Link
            to="/blog"
            className={`font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF01F] ${
              location.pathname.startsWith('/blog') 
                ? 'text-[#FFF01F]' 
                : 'text-[#F5F5F5] hover:text-[#FFF01F]'
            }`}
          >
            Blog
          </Link>
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
  );
}
