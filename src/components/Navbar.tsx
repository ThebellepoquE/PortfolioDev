import { Link, useLocation } from 'react-router-dom';
import { Github, Home, Briefcase, FileText, Mail } from 'lucide-react';
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
              className={`navbar__link navbar__link--pink ${
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
                    <Home size={24} strokeWidth={2} />
                  </div>
                </a>

                {/* Icono Proyectos */}
                <a
                  href="#proyectos"
                  className="mobile-nav__item mobile-nav__item--yellow"
                >
                  <div className="mobile-nav__item-icon">
                    <Briefcase size={24} strokeWidth={2} />
                  </div>
                </a>

                {/* Icono Blog */}
                <Link
                  to="/blog"
                  className="mobile-nav__item mobile-nav__item--pink"
                >
                  <div className="mobile-nav__item-icon">
                    <FileText size={24} strokeWidth={2} />
                  </div>
                </Link>

                {/* Icono Contacto */}
                <a
                  href="#contacto"
                  className="mobile-nav__item mobile-nav__item--blue"
                >
                  <div className="mobile-nav__item-icon">
                    <Mail size={24} strokeWidth={2} />
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
                    <Home size={24} strokeWidth={2} />
                  </div>
                  <span className="mobile-nav__item-label">Home</span>
                </Link>

                {/* Icono Blog - activo */}
                <Link
                  to="/blog"
                  className={`mobile-nav__item mobile-nav__item--pink ${
                    location.pathname.startsWith('/blog') ? 'is-active' : ''
                  }`}
                >
                  <div className="mobile-nav__item-icon">
                    <FileText size={24} strokeWidth={2} />
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

