import { useState } from 'react';
import type { FormEvent } from 'react';

/** Sección de contacto con formulario (Resend API) */
export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setShowError(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    } catch {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }

    setIsSubmitting(false);
  };

  return (
    <section
      id="contacto"
      className="min-h-screen flex items-start justify-center px-6 sm:px-8 md:px-12 lg:px-16 transition-colors duration-300"
      style={{
        scrollMarginTop: '80px',
        paddingTop: '80px',
        paddingBottom: '100px',
        background: 'var(--bg-dark)',
      }}
    >
      <div className="flex flex-col items-center w-full max-w-[320px] sm:max-w-md md:max-w-lg lg:max-w-xl gap-6 sm:gap-8">
        {/* Título */}
        <h2 
          className="text-2xl sm:text-3xl lg:text-4xl font-black title-neon text-center"
        >
          ¿Montamos un Dream Team?
        </h2>

        <p 
          className="text-center text-sm sm:text-base max-w-lg px-2 sm:px-0 transition-colors duration-300"
          style={{ color: 'var(--text-secondary)' }}
        >
          ¿Tienes un proyecto en mente o quieres colaborar? <br />
          Escríbeme, estoy abierta a nuevas oportunidades y retos.
        </p>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="w-full p-4 sm:p-6 md:p-8 lg:p-10 transition-colors duration-300"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
            {/* Nombre */}
            <div className="flex flex-col gap-3">
              <label htmlFor="contact-name" className="text-[#FF1493] font-semibold text-sm">Nombre</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                autoComplete="name"
                className="w-full px-4 py-3 border border-[#FF1493]/30 focus:border-[#FF1493] focus:ring-2 focus:ring-[#FF1493]/20 outline-none transition-all"
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text)' }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-3">
              <label htmlFor="contact-email" className="text-[#FFF01F] font-semibold text-sm">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-[#FFF01F]/30 focus:border-[#FFF01F] focus:ring-2 focus:ring-[#FFF01F]/20 outline-none transition-all"
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text)' }}
              />
            </div>

            {/* Mensaje */}
            <div className="flex flex-col gap-3">
              <label htmlFor="contact-message" className="text-[#00FF00] font-semibold text-sm">Mensaje</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Cuéntame sobre tu proyecto o idea..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 border border-[#00FF00]/30 focus:border-[#00FF00] focus:ring-2 focus:ring-[#00FF00]/20 outline-none transition-all resize-none"
                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text)' }}
              />
            </div>

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 sm:py-6 md:py-8 mt-2 sm:mt-4 font-bold text-sm sm:text-base text-black bg-[#00FF00] rounded-full hover:shadow-[0_8px_30px_rgba(255,20,147,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF01F]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar Mensaje'
              )}
            </button>

            {/* Mensaje de éxito */}
            {showSuccess && (
              <div className="p-4 bg-[#00FF00]/20 border border-[#00FF00] flex items-center gap-3">
                <svg className="w-6 h-6 text-[#00FF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#00FF00] font-semibold">¡Mensaje enviado! Te responderé pronto 💖</span>
              </div>
            )}

            {/* Mensaje de error */}
            {showError && (
              <div className="p-4 bg-red-500/20 border border-red-500 flex items-center gap-3">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-red-500 font-semibold">Error al enviar. Revisa la consola o contacta por GitHub.</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
