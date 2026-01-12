// Vercel Serverless Function - Envío de emails con Resend

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.CONTACT_EMAIL || 'tu-email@ejemplo.com';

export default async function handler(request, response) {
  // Solo permitir POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar API key configurada
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY no configurada');
    return response.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { name, email, message } = request.body;

    // Validación básica
    if (!name || !email || !message) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({ error: 'Invalid email format' });
    }

    // Sanitizar inputs
    const sanitizedName = name.slice(0, 100).trim();
    const sanitizedEmail = email.slice(0, 254).trim();
    const sanitizedMessage = message.slice(0, 5000).trim();

    // Enviar email con Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [TO_EMAIL],
        reply_to: sanitizedEmail,
        subject: `💌 Nuevo mensaje de ${sanitizedName} - Portfolio`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          
          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF1493 0%, #FFF01F 50%, #00FF00 100%); padding: 3px; border-radius: 12px 12px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #1a1a2e; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; color: #FF1493; font-size: 28px; font-weight: bold;">
                      ✨ Nuevo Mensaje
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #888; font-size: 14px;">
                      Alguien quiere contactar contigo desde tu portfolio
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- BODY -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 0 3px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #16213e;">
                <tr>
                  <td style="padding: 30px;">
                    
                    <!-- Nombre -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: #1a1a2e; padding: 20px; border-radius: 8px; border-left: 4px solid #FF1493;">
                          <p style="margin: 0 0 8px 0; color: #FF1493; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Nombre
                          </p>
                          <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 500;">
                            ${sanitizedName}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Email -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: #1a1a2e; padding: 20px; border-radius: 8px; border-left: 4px solid #FFF01F;">
                          <p style="margin: 0 0 8px 0; color: #FFF01F; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Email
                          </p>
                          <a href="mailto:${sanitizedEmail}" style="color: #ffffff; font-size: 18px; font-weight: 500; text-decoration: none;">
                            ${sanitizedEmail}
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Mensaje -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #1a1a2e; padding: 20px; border-radius: 8px; border-left: 4px solid #00FF00;">
                          <p style="margin: 0 0 12px 0; color: #00FF00; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Mensaje
                          </p>
                          <p style="margin: 0; color: #ffffff; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
${sanitizedMessage}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF1493 0%, #FFF01F 50%, #00FF00 100%); padding: 3px; border-radius: 0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #1a1a2e; padding: 25px; text-align: center; border-radius: 0 0 10px 10px;">
                    <p style="margin: 0 0 10px 0; color: #888; font-size: 13px;">
                      Enviado desde tu portfolio
                    </p>
                    <p style="margin: 0; color: #616060; font-size: 11px;">
                      Puedes responder directamente a este email para contactar con ${sanitizedName}
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
</html>
        `,
        text: `
✨ Nuevo mensaje desde tu Portfolio ✨
======================================

Nombre: ${sanitizedName}
Email: ${sanitizedEmail}

Mensaje:
${sanitizedMessage}

-------------------------------------
Enviado desde tu portfolio
        `.trim(),
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Resend API error:', errorData);
      return response.status(500).json({ error: 'Failed to send email' });
    }

    const data = await resendResponse.json();
    return response.status(200).json({ success: true, id: data.id });

  } catch (error) {
    console.error('Contact API error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
