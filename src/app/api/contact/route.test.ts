import { describe, expect, it, vi } from 'vitest';
import type { MailSender } from '../../../lib/contactEmail';
import { handleContactRequest } from './route';

const mailbox = 'ione@thebellepoque.dev';
const configuredEnv = {
  SMTP_USER: mailbox,
  SMTP_PASSWORD: 'fixture-app-password',
};

function contactRequest(body: unknown, raw = false): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: raw ? String(body) : JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  it('responde 400 si el JSON es inválido', async () => {
    const response = await handleContactRequest(contactRequest('{', true), { env: configuredEnv });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'El cuerpo de la petición no es válido',
    });
  });

  it('responde 400 si faltan campos', async () => {
    const response = await handleContactRequest(contactRequest({ name: 'Ana' }), { env: configuredEnv });

    expect(response.status).toBe(400);
  });

  it('responde 503 si faltan usuario o contraseña SMTP', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const sender: MailSender = { send: vi.fn() };

    const response = await handleContactRequest(contactRequest({
      name: 'Ana',
      email: 'ana@example.com',
      message: 'Hola',
    }), { env: {}, sender });

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: 'El envío de correo no está configurado',
    });
    expect(sender.send).not.toHaveBeenCalled();
  });

  it('envía al buzón de Private Email y responde 200', async () => {
    const sender: MailSender = {
      send: vi.fn().mockResolvedValue({ ok: true, id: '<id@privateemail>' }),
    };

    const response = await handleContactRequest(contactRequest({
      name: 'Ana',
      email: 'ana@example.com',
      message: 'Hola',
    }), { env: configuredEnv, sender });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      id: '<id@privateemail>',
    });
    expect(sender.send).toHaveBeenCalledWith(expect.objectContaining({
      from: `Ione Rodríguez <${mailbox}>`,
      to: mailbox,
      replyTo: 'ana@example.com',
    }));
  });

  it('responde 502 si el transporte SMTP falla', async () => {
    const sender: MailSender = {
      send: vi.fn().mockResolvedValue({ ok: false, error: 'No se pudo enviar el correo' }),
    };

    const response = await handleContactRequest(contactRequest({
      name: 'Ana',
      email: 'ana@example.com',
      message: 'Hola',
    }), { env: configuredEnv, sender });

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: 'No se pudo enviar el correo',
    });
  });
});
