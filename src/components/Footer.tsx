import { GithubIcon } from './icons';
import { LogoDots } from './LogoDots';
import { SITE_CONFIG } from '../lib/config';

/** Footer minimalista con logo y copyright */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        {/* GitHub - izquierda */}
        <a
          href={SITE_CONFIG.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="footer__github"
          aria-label="GitHub"
        >
          <GithubIcon width={20} height={20} />
          <span className="sr-only">Perfil de GitHub</span>
        </a>

        {/* Centro - texto */}
        <p className="footer__text">
          Hecho con mucha Luz - {new Date().getFullYear()}
        </p>

        {/* 3 puntos - derecha */}
        <LogoDots className="footer__dots" dotClassName="footer__dot" />
      </div>
    </footer>
  );
}

