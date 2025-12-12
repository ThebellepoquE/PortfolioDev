/** Hero section con foto, nombre y bio */
export function Hero() {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 sm:px-8 md:px-12 lg:px-16"
      style={{
        scrollMarginTop: '0px',
        paddingTop: '80px',
        paddingBottom: '80px',
        background: '#000000',
        minHeight: 'min(900px, 100vh)',
      }}
    >
      <div className="flex flex-col xl:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 xl:gap-24 w-full max-w-5xl">
        {/* Columna izquierda - Foto */}
        <div className="flex items-center justify-center lg:flex-shrink-0">
          <div className="relative">
            {/* Blur effect behind photo */}
            <div
              className="absolute inset-0 rounded-full blur-2xl sm:blur-3xl opacity-70"
              style={{
                background: 'linear-gradient(135deg, #00FF00 0%, #FF1493 100%)',
                transform: 'scale(1.3)',
              }}
            />
            <div
              className="relative p-1 rounded-full hover:scale-105 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #00FF00 0%, #00FF00 30%, #FF1493 70%, #FF1493 100%)',
                boxShadow: '0 0 40px rgba(255,20,147,0.9), 0 0 80px rgba(255,20,147,0.6)',
              }}
            >
              <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] lg:w-[260px] lg:h-[260px] rounded-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
                <img
                  src="/profile-200.webp"
                  srcSet="/profile-200.webp 200w, /profile.webp 433w"
                  sizes="(max-width: 639px) 180px, (max-width: 1023px) 220px, 260px"
                  alt="Ione - @thebellepoque"
                  width={260}
                  height={260}
                  className="w-full h-full object-contain"
                  style={{ objectPosition: 'center calc(50% + 5px)' }}
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Contenido */}
        <div className="flex flex-col items-center text-center gap-4 sm:gap-5 md:gap-6 w-full max-w-[320px] sm:max-w-[420px] md:max-w-lg xl:pl-12">
          {/* Nombre con efecto neón */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black title-neon">
            Ione
          </h1>

          {/* Handle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-[#FFF01F] font-semibold tracking-wider">
            @thebellepoque
          </p>

          {/* Descripción */}
          <p className="text-base sm:text-lg lg:text-xl text-[#F5F5F5]/90 font-medium">
            Full-stack Developer | Apasionada por las Automatizaciones
          </p>

          {/* Bio */}
          <p className="text-sm sm:text-base text-[#F5F5F5]/80 leading-relaxed text-justify">
            Llevo un año creando experiencias web, aprendiendo cada día algo nuevo.
            Formada en Bottega University (DevCamp) con Jordan Hudgens, gracias a Fundación VASS.
            Mi próximo objetivo: Dominar n8n para automatizar procesos y llevar lighton.es al siguiente nivel.
            Cada proyecto es una oportunidad para crecer 🚀
          </p>

          {/* Tags de stack */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center pt-2 sm:pt-3">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#FF1493] text-black font-medium text-xs sm:text-sm">Python</span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#FFF01F] text-black font-medium text-xs sm:text-sm">JavaScript</span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#00FF00] text-black font-medium text-xs sm:text-sm">React</span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#FF1493]/20 text-[#FF1493] font-medium text-xs sm:text-sm">MySQL</span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-[#FFF01F] font-medium text-xs sm:text-sm">Vite</span>
          </div>

          {/* GitHub button */}
          <a
            href="https://github.com/ThebellepoquE"
            target="_blank"
            rel="noopener noreferrer"
            className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF01F]"
          >
            <svg
              className="w-7 h-7 stroke-[#00FF00] group-hover:stroke-[#FF1493] fill-none transition-colors duration-300"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span className="sr-only">Perfil de GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
