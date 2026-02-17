import { useState } from 'react';
import type { FormEvent } from 'react';
import './Contact.scss';

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
    <section id="contacto" className="contact">
      <div className="contact__container">
        {/* Título */}
        <h2 className="contact__title title-neon">
          ¿Montamos un Dream Team?
        </h2>

        <p className="contact__description">
          ¿Tienes un proyecto en mente o quieres colaborar? <br />
          Escríbeme, estoy abierta a nuevas oportunidades y retos.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="contact__form">
          <div className="contact__fields">
            {/* Nombre */}
            <div className="contact__group">
              <label htmlFor="contact-name" className="contact__label contact__label--name">Nombre</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                autoComplete="name"
                className="contact__input contact__input--name"
              />
            </div>

            {/* Email */}
            <div className="contact__group">
              <label htmlFor="contact-email" className="contact__label contact__label--email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
                className="contact__input contact__input--email"
              />
            </div>

            {/* Mensaje */}
            <div className="contact__group">
              <label htmlFor="contact-message" className="contact__label contact__label--message">Mensaje</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Cuéntame sobre tu proyecto o idea..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="contact__textarea contact__textarea--message"
              />
            </div>

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="contact__submit"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="spinner" viewBox="0 0 24 24" fill="none">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar Mensaje'
              )}
            </button>

            {/* Mensaje de éxito */}
            {showSuccess && (
              <div className="contact__status contact__status--success">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>¡Mensaje enviado! Te responderé pronto 💖</span>
              </div>
            )}

            {/* Mensaje de error */}
            {showError && (
              <div className="contact__status contact__status--error">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Error al enviar. Revisa la consola o contacta por GitHub.</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
