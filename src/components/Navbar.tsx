'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GithubIcon,
  HomeIcon,
  BriefcaseIcon,
  FileIcon,
  MailIcon,
} from './icons';
import { ThemeToggle } from './ThemeToggle';
import { LogoDots } from './LogoDots';
import { SITE_CONFIG } from '../lib/config';
import { useActiveSection } from '../hooks/useActiveSection';

/** Navbar con logo de 3 puntos y navegación */
export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const activeSection = useActiveSection(['inicio', 'proyectos', 'contacto']);

  return (
    <>
      {/* Navbar superior */}
      <nav className="navbar">
        <div className="navbar__content">
          {/* Logo - 3 puntos fluorescentes */}
          <Link
            href="/"
            aria-label="Inicio, página principal"
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
                href="/"
                className="navbar__link navbar__link--pink"
              >
                ← Home
              </Link>
            )}
                 <Link
                   href="/blog"
                   className={`navbar__link navbar__link--pink ${
                     pathname?.startsWith('/blog') ? 'is-active' : ''
                   }`}
                   aria-label="Ir al blog"
                   aria-current={pathname?.startsWith('/blog') ? 'page' : undefined}
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
              <GithubIcon width={20} height={20} />
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
                  className={`mobile-nav__item mobile-nav__item--pink${activeSection === 'inicio' ? ' is-active' : ''}`}
                  aria-label="Ir a sección inicio"
                >
                  <div className="mobile-nav__item-icon">
                    <HomeIcon width={24} height={24} />
                  </div>
                </a>

                {/* Icono Proyectos */}
                <a
                  href="#proyectos"
                  className={`mobile-nav__item mobile-nav__item--yellow${activeSection === 'proyectos' ? ' is-active' : ''}`}
                  aria-label="Ver proyectos"
                >
                  <div className="mobile-nav__item-icon">
                    <BriefcaseIcon width={24} height={24} />
                  </div>
                </a>

                {/* Icono Blog */}
                 <Link
                   href="/blog"
                   className={`mobile-nav__item mobile-nav__item--green ${
                     pathname?.startsWith('/blog') ? 'is-active' : ''
                   }`}
                   aria-label="Ir al blog"
                   aria-current={pathname?.startsWith('/blog') ? 'page' : undefined}
                 >
                  <div className="mobile-nav__item-icon">
                    <FileIcon width={24} height={24} />
                  </div>
                </Link>

                {/* Icono Contacto */}
                <a
                  href="#contacto"
                  className={`mobile-nav__item mobile-nav__item--pink${activeSection === 'contacto' ? ' is-active' : ''}`}
                  aria-label="Ir a contacto"
                >
                  <div className="mobile-nav__item-icon">
                    <MailIcon width={24} height={24} />
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
                  href="/"
                  className="mobile-nav__item mobile-nav__item--pink"
                  aria-label="Inicio, página principal"
                >
                  <div className="mobile-nav__item-icon">
                    <HomeIcon width={24} height={24} />
                  </div>
                  <span className="mobile-nav__item-label">Home</span>
                </Link>

                {/* Icono Blog - activo */}
                 <Link
                   href="/blog"
                   className={`mobile-nav__item mobile-nav__item--green ${
                     pathname?.startsWith('/blog') ? 'is-active' : ''
                   }`}
                   aria-label="Ir al blog"
                 >
                  <div className="mobile-nav__item-icon">
                    <FileIcon width={24} height={24} />
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

