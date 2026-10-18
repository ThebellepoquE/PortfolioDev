import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PRIVATE_EMAIL_IMAP_HOST,
  PRIVATE_EMAIL_SMTP_HOST,
  createPrivateEmailSender,
  readPrivateEmailSettings,
} from './privateEmail';

const sendMail = vi.hoisted(() => vi.fn());
const createTransport = vi.hoisted(() => vi.fn(() => ({ sendMail })));

vi.mock('nodemailer', () => ({
  default: {
    createTransport,
  },
}));

const mailbox = 'ione@thebellepoque.dev';
const fixturePassword = 'fixture-app-password';

describe('readPrivateEmailSettings', () => {
  it('usa el SMTP estándar de Private Email cuando no hay host ni puerto', () => {
    const result = readPrivateEmailSettings({
      SMTP_USER: mailbox,
      SMTP_PASSWORD: fixturePassword,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.settings).toMatchObject({
      host: PRIVATE_EMAIL_SMTP_HOST,
      port: 465,
      secure: true,
      requireTLS: false,
      user: mailbox,
      from: `Ione Rodríguez <${mailbox}>`,
      to: mailbox,
    });
    expect(PRIVATE_EMAIL_IMAP_HOST).toBe('mail.privateemail.com');
  });

  it('abre STARTTLS en el puerto 587', () => {
    const result = readPrivateEmailSettings({
      SMTP_USER: mailbox,
      SMTP_PASSWORD: fixturePassword,
      SMTP_PORT: '587',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.settings.port).toBe(587);
    expect(result.settings.secure).toBe(false);
    expect(result.settings.requireTLS).toBe(true);
  });

  it('indica qué variables faltan, sin inventar una contraseña', () => {
    const result = readPrivateEmailSettings({});

    expect(result).toEqual({
      ok: false,
      missing: ['SMTP_USER', 'SMTP_PASSWORD'],
    });
  });

  it('rechaza un puerto que Private Email no usa', () => {
    const result = readPrivateEmailSettings({
      SMTP_USER: mailbox,
      SMTP_PASSWORD: fixturePassword,
      SMTP_PORT: '25',
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe('SMTP_PORT debe ser 465 (SSL) o 587 (STARTTLS)');
  });
});

describe('createPrivateEmailSender', () => {
  beforeEach(() => {
    sendMail.mockReset();
    createTransport.mockClear();
  });

  it('configura mail.privateemail.com:465 con SSL implícito y el usuario completo', async () => {
    sendMail.mockResolvedValue({ messageId: '<id@privateemail>' });
    const settings = readPrivateEmailSettings({
      SMTP_USER: `  ${mailbox}  `,
      SMTP_PASSWORD: fixturePassword,
    });
    if (!settings.ok) throw new Error('config');

    const sender = createPrivateEmailSender(settings.settings);
    const result = await sender.send({
      from: settings.settings.from,
      to: settings.settings.to,
      replyTo: 'ana@example.com',
      subject: 'Hola',
      html: '<p>Hola</p>',
      text: 'Hola',
    });

    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: 'mail.privateemail.com',
      port: 465,
      secure: true,
      requireTLS: false,
      auth: {
        user: mailbox,
        pass: fixturePassword,
      },
    }));
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: `Ione Rodríguez <${mailbox}>`,
      to: mailbox,
      replyTo: 'ana@example.com',
    }));
    expect(result).toEqual({ ok: true, id: '<id@privateemail>' });
  });

  it('no devuelve la contraseña si SMTP falla', async () => {
    sendMail.mockRejectedValue(new Error(`535 ${fixturePassword} rejected`));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const settings = readPrivateEmailSettings({
      SMTP_USER: mailbox,
      SMTP_PASSWORD: fixturePassword,
    });
    if (!settings.ok) throw new Error('config');

    const result = await createPrivateEmailSender(settings.settings).send({
      from: settings.settings.from,
      to: mailbox,
      replyTo: 'ana@example.com',
      subject: 'Hola',
      html: '<p>Hola</p>',
      text: 'Hola',
    });

    expect(result).toEqual({ ok: false, error: 'No se pudo enviar el correo' });
    const logged = vi.mocked(console.error).mock.calls.flat().join(' ');
    expect(logged).not.toContain(fixturePassword);
    expect(logged).toContain('[redacted]');
  });
});
