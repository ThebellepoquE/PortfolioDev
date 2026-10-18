/**
 * Validación y cuerpo del formulario de contacto.
 * El envío SMTP vive en privateEmail.ts (Namecheap Private Email).
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;
const MESSAGE_MAX_LENGTH = 5000;

const THEME = {
  pink: '#FF1493',
  yellow: '#FFF01F',
  green: '#00FF00',
  bgDark: '#0a0a0a',
  bgCard: '#1a1a1a',
  bgEmailBody: '#16213e',
  text: '#F5F5F5',
  textMuted: '#aaaaaa',
  textFooter: '#888888',
} as const;

export interface SanitizedContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface OutboundContactMail {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}

export interface MailSender {
  send: (mail: OutboundContactMail) => Promise<MailSendResult>;
}

export type ContactValidationResult =
  | { ok: true; value: SanitizedContactMessage }
  | { ok: false; error: string };

export type MailSendResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Escapa texto de usuario antes de interpolarlo en el HTML del correo. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function collapseHeaderText(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim();
}

/**
 * Normaliza el cuerpo JSON del formulario.
 * Rechaza tipos incorrectos, emails inválidos y campos vacíos tras recortar.
 */
export function validateContactInput(body: unknown): ContactValidationResult {
  if (!isRecord(body)) {
    return { ok: false, error: 'El cuerpo de la petición no es válido' };
  }

  const { name, email, message } = body;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return { ok: false, error: 'Faltan campos obligatorios' };
  }

  const sanitizedName = collapseHeaderText(name).slice(0, NAME_MAX_LENGTH);
  const sanitizedEmail = collapseHeaderText(email);
  const sanitizedMessage = message.replaceAll('\0', '').trim().slice(0, MESSAGE_MAX_LENGTH);

  if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
    return { ok: false, error: 'Faltan campos obligatorios' };
  }

  if (sanitizedEmail.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(sanitizedEmail)) {
    return { ok: false, error: 'El email no tiene un formato válido' };
  }

  return {
    ok: true,
    value: {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
    },
  };
}

function renderContactHtml(input: SanitizedContactMessage): string {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const message = escapeHtml(input.message);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${THEME.bgDark};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${THEME.bgDark}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td style="background: linear-gradient(135deg, ${THEME.pink} 0%, ${THEME.yellow} 50%, ${THEME.green} 100%); padding: 3px; border-radius: 12px 12px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: ${THEME.bgCard}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; color: ${THEME.pink}; font-size: 28px; font-weight: bold;">
                      Nuevo Mensaje
                    </h1>
                    <p style="margin: 10px 0 0 0; color: ${THEME.textMuted}; font-size: 14px;">
                      Contacto desde tu portfolio
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: ${THEME.bgCard}; padding: 0 3px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${THEME.bgEmailBody};">
                <tr>
                  <td style="padding: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: ${THEME.bgCard}; padding: 20px; border-radius: 8px; border-left: 4px solid ${THEME.pink};">
                          <p style="margin: 0 0 8px 0; color: ${THEME.pink}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Nombre
                          </p>
                          <p style="margin: 0; color: ${THEME.text}; font-size: 18px; font-weight: 500;">
                            ${name}
                          </p>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: ${THEME.bgCard}; padding: 20px; border-radius: 8px; border-left: 4px solid ${THEME.yellow};">
                          <p style="margin: 0 0 8px 0; color: ${THEME.yellow}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Email
                          </p>
                          <a href="mailto:${email}" style="color: ${THEME.text}; font-size: 18px; font-weight: 500; text-decoration: none;">
                            ${email}
                          </a>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: ${THEME.bgCard}; padding: 20px; border-radius: 8px; border-left: 4px solid ${THEME.green};">
                          <p style="margin: 0 0 12px 0; color: ${THEME.green}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Mensaje
                          </p>
                          <p style="margin: 0; color: ${THEME.text}; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, ${THEME.pink} 0%, ${THEME.yellow} 50%, ${THEME.green} 100%); padding: 3px; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: ${THEME.bgCard}; padding: 25px; text-align: center; border-radius: 0 0 10px 10px;">
                    <p style="margin: 0 0 10px 0; color: ${THEME.textMuted}; font-size: 13px;">
                      Enviado desde tu portfolio
                    </p>
                    <p style="margin: 0; color: ${THEME.textFooter}; font-size: 11px;">
                      Responde directamente a este email para contactar con ${name}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Arma el mensaje SMTP. replyTo es el visitante, para responder desde Private Email. */
export function buildContactEmail(
  input: SanitizedContactMessage,
  toEmail: string,
  fromAddress: string,
): OutboundContactMail {
  return {
    from: fromAddress,
    to: toEmail,
    replyTo: input.email,
    subject: `Nuevo mensaje de ${input.name} - Portfolio`,
    html: renderContactHtml(input),
    text: [
      'Nuevo mensaje desde tu Portfolio',
      '======================================',
      '',
      `Nombre: ${input.name}`,
      `Email: ${input.email}`,
      '',
      'Mensaje:',
      input.message,
      '',
      '-------------------------------------',
      'Enviado desde tu portfolio',
    ].join('\n'),
  };
}
