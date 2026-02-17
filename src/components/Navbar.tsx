import { Link, useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LogoDots } from './LogoDots';
import { SITE_CONFIG } from '../lib/config';

/** Navbar con logo de 3 puntos y navegación */
export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {/* Navbar superior */}
      <nav className="navbar">
        <div className="navbar__content">
          {/* Logo - 3 puntos fluorescentes */}
          <Link
            to="/"
            aria-label="Ir al inicio"
            className="navbar__logo"
          >
            <LogoDots className="navbar__logo-flex" dotClassName="navbar__logo-dot" />
          </Link>

          {/* Spacer */}
          <div className="navbar__spacer" />

          {/* Links de navegación - visible solo en desktop */}
          <div className="navbar__links">
            {isHome ? (
              <>
                <a
                  href="#inicio"
                  className="navbar__link navbar__link--pink"
                >
                  Inicio
                </a>
                <a
                  href="#proyectos"
                  className="navbar__link navbar__link--yellow"
                >
                  Proyectos
                </a>
                <a
                  href="#contacto"
                  className="navbar__link navbar__link--green"
                >
                  Contacto
                </a>
              </>
            ) : (
              <Link
                to="/"
                className="navbar__link navbar__link--pink"
              >
                ← Home
              </Link>
            )}
            <Link
              to="/blog"
              className={`navbar__link navbar__link--yellow ${
                location.pathname.startsWith('/blog') ? 'is-active' : ''
              }`}
            >
              Blog
            </Link>
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* GitHub icon */}
            <a
              href={SITE_CONFIG.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__github"
              aria-label="GitHub"
            >
              <Github size={20} strokeWidth={2} />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Dock - Visible solo en móvil */}
      <nav className="mobile-nav">
        <div className="mobile-nav__container">
          <div className="mobile-nav__items">
            {isHome ? (
              <>
                {/* Icono Home */}
                <a
                  href="#inicio"
                  className="mobile-nav__item mobile-nav__item--pink"
                >
                  <div className="mobile-nav__item-icon">
                    <svg
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
                </a>

                {/* Icono Proyectos */}
                <a
                  href="#proyectos"
                  className="mobile-nav__item mobile-nav__item--yellow"
                >
                  <div className="mobile-nav__item-icon">
                    <svg
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </a>

                {/* Icono Blog */}
                <Link
                  to="/blog"
                  className="mobile-nav__item mobile-nav__item--green"
                >
                  <div className="mobile-nav__item-icon">
                    <svg
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
                </Link>

                {/* Icono Contacto */}
                <a
                  href="#contacto"
                  className="mobile-nav__item mobile-nav__item--pink"
                >
                  <div className="mobile-nav__item-icon">
                    <svg
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
                </a>

                {/* Theme Toggle */}
                <div className="mobile-nav__toggle-group">
                  <ThemeToggle />
                </div>
              </>
            ) : (
              <>
                {/* Botón Home cuando estamos en otra página */}
                <Link
                  to="/"
                  className="mobile-nav__item mobile-nav__item--pink"
                >
                  <div className="mobile-nav__item-icon">
                    <svg
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
                  <span className="mobile-nav__item-label">Home</span>
                </Link>

                {/* Icono Blog - activo */}
                <Link
                  to="/blog"
                  className={`mobile-nav__item mobile-nav__item--yellow ${
                    location.pathname.startsWith('/blog') ? 'is-active' : ''
                  }`}
                >
                  <div className="mobile-nav__item-icon">
                    <svg
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
                  <span className="mobile-nav__item-label">Blog</span>
                </Link>

                {/* Theme Toggle */}
                <div className="mobile-nav__toggle-group">
                  <ThemeToggle />
                  <span className="mobile-nav__toggle-group-label">Tema</span>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

