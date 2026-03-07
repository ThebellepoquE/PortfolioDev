# Configurar email para alertas del cron de limpieza

> **Nota:** Este proyecto usa **pnpm** como gestor de paquetes. Los scripts de Node (dev, build, test, etc.) se ejecutan con `pnpm run …`.

Cuando la limpieza semanal falla, el script intenta enviar un email a `thebellepoque@gmail.com`. Para que funcione, necesitas configurar un cliente de correo.

## Opción recomendada: msmtp con Gmail

### 1. Instalar msmtp

```bash
sudo apt install msmtp msmtp-mta
```

### 2. Crear contraseña de aplicación en Gmail

1. Ve a [Google Account → Seguridad](https://myaccount.google.com/security)
2. Activa la verificación en 2 pasos (si no la tienes)
3. Ve a "Contraseñas de aplicaciones"
4. Genera una para "Correo" / "Otro (nombre personalizado)" → "cron-cleanup"
5. Copia la contraseña de 16 caracteres

### 3. Configurar msmtp

Crea el archivo en tu **carpeta personal** (tu home), no dentro del proyecto:

| Tu usuario | Ruta completa del archivo |
|------------|---------------------------|
| thebellepoque | `/home/thebellepoque/.msmtprc` |

El archivo se llama `.msmtprc` (con el punto delante, es un archivo oculto).

```bash
nano ~/.msmtprc
```

Ese comando crea el archivo automáticamente si no existe. `~` es tu carpeta personal.

Pega este contenido y **sustituye** `abcd efgh ijkl mnop` por la contraseña de 16 caracteres que copiaste de Google (la de "cron-cleanup"):

```ini
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        ~/.msmtp.log

account        gmail
host           smtp.gmail.com
port           587
from           thebellepoque@gmail.com
user           thebellepoque@gmail.com
password       abcd efgh ijkl mnop

account default : gmail
```

**Ejemplo:** si Google te dio `abcd efgh ijkl mnop`, la línea quedaría:
```
password      abcd efgh ijkl mnop 
```

Guarda (Ctrl+O, Enter) y cierra (Ctrl+X).

**Importante:** protege el archivo (contiene la contraseña):

```bash
chmod 600 ~/.msmtprc
```

> **Obligatorio:** msmtp **no enviará correos** si el archivo no está protegido. Rechaza usar configuraciones que otros usuarios puedan leer. Sin `chmod 600` los emails no llegarán.

### 4. Probar el envío

```bash
echo "Test desde cron cleanup" | msmtp thebellepoque@gmail.com
```

Si recibes el email, está listo.

**Si no llega:** comprueba que el archivo esté protegido con `ls -la ~/.msmtprc` (debe mostrar `-rw-------`). Si no, ejecuta `chmod 600 ~/.msmtprc` de nuevo.

---

## Alternativa: MAILTO de cron

Si ya tienes correo configurado en el sistema (postfix, sendmail, etc.):

```bash
crontab -e
```

Añade al inicio:

```
MAILTO=thebellepoque@gmail.com
```

Cron enviará por email cualquier salida de los jobs. Con nuestro script, solo hay salida cuando falla (y además enviamos por nuestra función `send_alert`). La opción MAILTO es redundante si msmtp funciona, pero puede servir como respaldo.
