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
            {/* Glow rosa - div separado para compatibilidad */}
            <div
              className="absolute top-1/2 left-1/2 w-[180px] h-[180px] md:w-[220px] md:h-[220px] lg:w-[260px] lg:h-[260px] rounded-full opacity-40 pointer-events-none"
              style={{
                transform: 'translate(-50%, -50%)',
                background: '#FF1493',
                filter: 'blur(30px)',
                WebkitFilter: 'blur(30px)',
              }}
            />
            <div
              className="relative p-[2px] rounded-full hover:scale-105 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #00FF00 0%, #00FF00 30%, #FF1493 70%, #FF1493 100%)',
              }}
            >
              <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] lg:w-[260px] lg:h-[260px] rounded-full overflow-hidden bg-black flex items-center justify-center ring-4 ring-inset ring-black">
                <img
                  src="/profile-200.webp"
                  srcSet="/profile-200.webp 200w, /profile.webp 433w"
                  sizes="(max-width: 639px) 180px, (max-width: 1023px) 220px, 260px"
                  alt="Ione - @thebellepoque"
                  width={260}
                  height={260}
                  className="w-full h-full object-contain rounded-full"
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black title-neon">
            Ione
          </h1>

          {/* Handle */}
          <p className="text-base sm:text-lg lg:text-xl text-[#FFF01F] font-semibold tracking-wider">
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
            Mi próximo objetivo: Automatizar procesos y llevar lighton.es al siguiente nivel.
            Cada proyecto es una oportunidad para crecer 🚀
          </p>

          {/* Tags de stack */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center pt-2 sm:pt-3">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-[#FF1493] font-medium text-xs sm:text-sm">Python</span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-[#FFF01F] font-medium text-xs sm:text-sm">JavaScript</span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-[#00FF00] font-medium text-xs sm:text-sm">React</span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-[#FF1493] font-medium text-xs sm:text-sm">MySQL</span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-[#FFF01F] font-medium text-xs sm:text-sm">Vite</span>
          </div>

          {/* Social links */}
          <div className="flex gap-4 items-center">
            {/* GitHub button */}
            <a
              href="https://github.com/ThebellepoquE"
              target="_blank"
              rel="noopener noreferrer"
              className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF01F]"
            >
              <svg
                className="w-7 h-7 stroke-[#00FF00] group-hover:stroke-[#FFF01F] fill-none transition-colors duration-300"
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

            {/* LinkedIn button */}
            <a
              href="https://www.linkedin.com/in/thebellepoque/"
              target="_blank"
              rel="noopener noreferrer"
              className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF01F]"
            >
              <svg
                className="w-7 h-7 fill-[#FF1493] group-hover:fill-[#FFF01F] transition-colors duration-300"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="sr-only">Perfil de LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
