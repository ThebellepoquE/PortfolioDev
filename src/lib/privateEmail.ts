import nodemailer from 'nodemailer';
import type { MailSender, OutboundContactMail } from './contactEmail';

/**
 * SMTP de Namecheap Private Email.
 * Buzón del portfolio: ione@thebellepoque.dev
 * Documentación Namecheap (27 ago 2026): servidor mail.privateemail.com
 * (no cambiarlo). smtp.privateemail.com también vale como salida.
 * 465 = SSL implícito (secure). 587 = STARTTLS (secure false, requireTLS).
 * IMAP, no usado por el formulario: mail.privateemail.com:993.
 * La contraseña va en SMTP_PASSWORD (master o contraseña de aplicación) y no se registra.
 */

export const PRIVATE_EMAIL_SMTP_HOST = 'mail.privateemail.com';
export const PRIVATE_EMAIL_SMTP_PORT = 465;
export const PRIVATE_EMAIL_IMAP_HOST = 'mail.privateemail.com';
const DISPLAY_NAME = 'Ione Rodríguez';

export interface PrivateEmailSettings {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  user: string;
  password: string;
  from: string;
  to: string;
}

export type PrivateEmailConfigResult =
  | { ok: true; settings: PrivateEmailSettings }
  | { ok: false; missing: string[]; error?: string };

function redactSecret(message: string, secret: string): string {
  if (!secret) return message;
  return message.split(secret).join('[redacted]');
}

/**
 * Lee SMTP_USER y SMTP_PASSWORD. El host y el puerto tienen defecto de Private Email.
 * CONTACT_EMAIL y SMTP_FROM son opcionales: si faltan, el buzón autenticado recibe y envía.
 */
export function readPrivateEmailSettings(
  env: Record<string, string | undefined>,
): PrivateEmailConfigResult {
  const user = env.SMTP_USER?.trim() ?? '';
  const password = env.SMTP_PASSWORD?.trim() ?? '';
  const missing = [
    user ? null : 'SMTP_USER',
    password ? null : 'SMTP_PASSWORD',
  ].filter((name): name is string => name !== null);

  if (missing.length > 0) {
    return { ok: false, missing };
  }

  const host = env.SMTP_HOST?.trim() || PRIVATE_EMAIL_SMTP_HOST;
  const portText = env.SMTP_PORT?.trim() || String(PRIVATE_EMAIL_SMTP_PORT);
  const port = Number(portText);

  if (!Number.isInteger(port) || (port !== 465 && port !== 587)) {
    return {
      ok: false,
      missing: [],
      error: 'SMTP_PORT debe ser 465 (SSL) o 587 (STARTTLS)',
    };
  }

  return {
    ok: true,
    settings: {
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      user,
      password,
      from: env.SMTP_FROM?.trim() || `${DISPLAY_NAME} <${user}>`,
      to: env.CONTACT_EMAIL?.trim() || user,
    },
  };
}

/** Abre el transporte SMTP. No conecta hasta el primer send. */
export function createPrivateEmailSender(settings: PrivateEmailSettings): MailSender {
  const transporter = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    requireTLS: settings.requireTLS,
    auth: {
      user: settings.user,
      pass: settings.password,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  return {
    async send(mail: OutboundContactMail) {
      try {
        const info = await transporter.sendMail({
          from: mail.from,
          to: mail.to,
          replyTo: mail.replyTo,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });

        return { ok: true as const, id: info.messageId };
      } catch (error) {
        const raw = error instanceof Error ? error.message : 'Error SMTP';
        console.error('Contact API: SMTP rechazó el envío', redactSecret(raw, settings.password));
        return { ok: false as const, error: 'No se pudo enviar el correo' };
      }
    },
  };
}
