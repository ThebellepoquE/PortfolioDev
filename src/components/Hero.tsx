import { Github, Linkedin } from 'lucide-react';
import { SITE_CONFIG } from '../lib/config';

/** Hero section con foto, nombre y bio */
export function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__container">
        {/* Columna izquierda - Foto */}
        <div className="hero__image-wrapper">
          <div className="hero__image-container">
            <div className="hero__image-frame">
              <img
                src="/profile-200.webp"
                srcSet="/profile-200.webp 200w, /profile.webp 1000w"
                sizes="(max-width: 639px) 180px, (max-width: 1023px) 220px, 260px"
                alt="Ione - @thebellepoque"
                width={260}
                height={260}
                className="hero__image"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        {/* Columna derecha - Contenido */}
        <div className="hero__content">
          {/* Nombre con efecto neón */}
          <h1 className="hero__title title-neon text-gradient">
            Ione
          </h1>

          {/* Handle */}
          <p className="hero__handle">
            @thebellepoque
          </p>

          {/* Descripción */}
          <p className="hero__subtitle">
            Full-stack Developer | Apasionada por las Automatizaciones
          </p>

          {/* Bio */}
          <p className="hero__bio">
            Llevo un año creando experiencias web, aprendiendo cada día algo nuevo.
            Formada en Bottega University (DevCamp) con Jordan Hudgens, gracias a Fundación VASS.
            Mi próximo objetivo: Automatizar procesos y llevar lighton.es al siguiente nivel.
            Cada proyecto es una oportunidad para crecer.
          </p>

          {/* Tags de stack */}
          <div className="hero__tags">
            <span className="hero__tag hero__tag--pink">Python</span>
            <span className="hero__tag hero__tag--yellow">JavaScript</span>
            <span className="hero__tag hero__tag--green">React</span>
            <span className="hero__tag hero__tag--pink">MySQL</span>
            <span className="hero__tag hero__tag--yellow">Vite</span>
          </div>

          {/* Social links */}
          <div className="hero__social">
            {/* GitHub button */}
            <a
              href={SITE_CONFIG.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link hero__social-link--github"
            >
              <Github size={24} strokeWidth={2} />
              <span className="sr-only">Perfil de GitHub</span>
            </a>

            {/* LinkedIn button */}
            <a
              href={SITE_CONFIG.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-link hero__social-link--linkedin"
            >
              <Linkedin size={24} strokeWidth={2} />
              <span className="sr-only">Perfil de LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

