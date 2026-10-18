import { describe, expect, it } from 'vitest';
import { buildContactEmail, escapeHtml, validateContactInput } from './contactEmail';

const validMessage = {
  name: 'Ana',
  email: 'ana@example.com',
  message: 'Hola, quiero colaborar.',
};

describe('escapeHtml', () => {
  it('escapa los caracteres que rompen HTML', () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;',
    );
  });
});

describe('validateContactInput', () => {
  it('acepta un mensaje válido y recorta espacios', () => {
    const result = validateContactInput({
      name: '  Ana  ',
      email: ' ana@example.com ',
      message: '  Hola  ',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        name: 'Ana',
        email: 'ana@example.com',
        message: 'Hola',
      },
    });
  });

  it('rechaza un cuerpo que no es un objeto', () => {
    expect(validateContactInput(null)).toEqual({
      ok: false,
      error: 'El cuerpo de la petición no es válido',
    });
  });

  it('rechaza campos vacíos o que no son texto', () => {
    expect(validateContactInput({ name: 1, email: 'ana@example.com', message: 'Hola' })).toEqual({
      ok: false,
      error: 'Faltan campos obligatorios',
    });
  });

  it('rechaza un email con formato inválido', () => {
    expect(validateContactInput({ ...validMessage, email: 'no-es-un-email' })).toEqual({
      ok: false,
      error: 'El email no tiene un formato válido',
    });
  });

  it('quita saltos de línea del nombre', () => {
    const result = validateContactInput({
      ...validMessage,
      name: 'Ana\nBcc: evil@example.com',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Ana Bcc: evil@example.com');
    }
  });
});

describe('buildContactEmail', () => {
  it('usa el buzón de Private Email y el replyTo del visitante', () => {
    const mail = buildContactEmail(
      {
        name: '<Ana>',
        email: 'ana@example.com',
        message: 'Hola <b>equipo</b>',
      },
      'ione@thebellepoque.dev',
      'Ione Rodríguez <ione@thebellepoque.dev>',
    );

    expect(mail.from).toBe('Ione Rodríguez <ione@thebellepoque.dev>');
    expect(mail.to).toBe('ione@thebellepoque.dev');
    expect(mail.replyTo).toBe('ana@example.com');
    expect(mail.subject).toBe('Nuevo mensaje de <Ana> - Portfolio');
    expect(mail.html).toContain('&lt;Ana&gt;');
    expect(mail.html).toContain('&lt;b&gt;equipo&lt;/b&gt;');
    expect(mail.html).not.toContain('<b>equipo</b>');
    expect(mail.text).toContain('Hola <b>equipo</b>');
  });
});
