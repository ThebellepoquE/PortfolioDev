import { buildContactEmail, validateContactInput, type MailSender } from '../../../lib/contactEmail';
import { createPrivateEmailSender, readPrivateEmailSettings } from '../../../lib/privateEmail';

interface ContactRequestOptions {
  env?: Record<string, string | undefined>;
  sender?: MailSender;
}

/** Recibe el formulario y lo envía por SMTP de Namecheap Private Email. */
export async function handleContactRequest(
  request: Request,
  options: ContactRequestOptions = {},
): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'El cuerpo de la petición no es válido' }, { status: 400 });
  }

  const validation = validateContactInput(body);
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const config = readPrivateEmailSettings(options.env ?? process.env);
  if (!config.ok) {
    const detail = config.error ?? `faltan ${config.missing.join(', ')}`;
    console.error(`Contact API: configuración SMTP incompleta (${detail})`);
    return Response.json({ error: 'El envío de correo no está configurado' }, { status: 503 });
  }

  const sender = options.sender ?? createPrivateEmailSender(config.settings);
  const mail = buildContactEmail(validation.value, config.settings.to, config.settings.from);
  const result = await sender.send(mail);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({ success: true, id: result.id });
}

export function POST(request: Request): Promise<Response> {
  return handleContactRequest(request);
}
