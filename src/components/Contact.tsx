import { useState, useEffect } from 'react';
import { CheckIcon, AlertIcon, LoaderIcon } from './icons';
import type { FormEvent, ReactNode } from 'react';
import { SectionTitle } from './SectionTitle';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'textarea';
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  rows?: number;
}

function FormField({ 
  id, label, type = 'text', name, placeholder, value, onChange, required, autoComplete, rows 
}: FormFieldProps) {
  const baseClass = "contact__group";
  const labelClass = `contact__label contact__label--${name}`;
  const inputClass = `contact__input contact__input--${name}`;
  const textareaClass = `contact__textarea contact__textarea--${name}`;

  return (
    <div className={baseClass}>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={rows}
          className={textareaClass}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          className={inputClass}
        />
      )}
    </div>
  );
}

interface StatusMessageProps {
  type: 'success' | 'error';
  children: ReactNode;
}

function StatusMessage({ type, children }: StatusMessageProps) {
  const Icon = type === 'success' ? CheckIcon : AlertIcon;
  return (
    <div className={`contact__status contact__status--${type}`}>
      <Icon width={24} height={24} />
      <span>{children}</span>
    </div>
  );
}

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

  // Limpieza de timeouts para evitar fugas de memoria
  useEffect(() => {
    let successTimer: number;
    let errorTimer: number;

    if (showSuccess) {
      successTimer = window.setTimeout(() => setShowSuccess(false), 3000);
    }
    if (showError) {
      errorTimer = window.setTimeout(() => setShowError(false), 5000);
    }

    return () => {
      clearTimeout(successTimer);
      clearTimeout(errorTimer);
    };
  }, [showSuccess, showError]);

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
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    }

    setIsSubmitting(false);
  };

  return (
    <section id="contacto" className="contact">
      <div className="contact__container">
        {/* Título */}
        <SectionTitle className="contact__title">
          ¿Montamos un Dream Team?
        </SectionTitle>

        <p className="contact__description">
          ¿Tienes un proyecto en mente o quieres colaborar? <br />
          Escríbeme, estoy abierta a nuevas oportunidades y retos.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="contact__form">
          <div className="contact__fields">
            {/* Nombre */}
            <FormField
              id="contact-name"
              label="Nombre"
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
              autoComplete="name"
            />

            {/* Email */}
            <FormField
              id="contact-email"
              label="Email"
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
              autoComplete="email"
            />

            {/* Mensaje */}
            <FormField
              id="contact-message"
              label="Mensaje"
              type="textarea"
              name="message"
              placeholder="Cuéntame sobre tu proyecto o idea..."
              value={formData.message}
              onChange={(value) => setFormData({ ...formData, message: value })}
              required
              rows={5}
            />

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="contact__submit"
            >
              {isSubmitting ? (
                <span className="contact__submit-content">
                  <LoaderIcon className="spinner" width={20} height={20} />
                  Enviando...
                </span>
              ) : (
                'Enviar Mensaje'
              )}
            </button>

            {/* Mensaje de éxito */}
            {showSuccess && (
              <StatusMessage type="success">
                ¡Mensaje enviado! Te responderé pronto 💖
              </StatusMessage>
            )}

            {/* Mensaje de error */}
            {showError && (
              <StatusMessage type="error">
                Error al enviar. Revisa la consola o contacta por GitHub.
              </StatusMessage>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
