#!/bin/bash

# =============================================================================
# Wrapper para ejecutar cleanup-repos.sh desde CRON
# Garantiza entorno correcto (nvm, PATH) para los 3 repos:
#   - DISCOGRAFICA, light-on-clean, portfolio
#
# En caso de error: envía email a ALERT_EMAIL (requiere msmtp configurado)
#
# Configurar crontab:
#   crontab -e
#   MAILTO=thebellepoque@gmail.com
#   0 9 * * 1 /home/thebellepoque/Escritorio/portfolio/scripts/cleanup-repos-cron.sh
#
# O con log a archivo (el email solo se envía en fallos):
#   0 9 * * 1 /home/thebellepoque/Escritorio/portfolio/scripts/cleanup-repos-cron.sh >> ~/cleanup-$(date +\%Y-\%m-\%d).log 2>&1
# =============================================================================

ALERT_EMAIL="thebellepoque@gmail.com"

# Directorio del script (portfolio)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLEANUP_SCRIPT="$SCRIPT_DIR/cleanup-repos.sh"
LOG_TEMP="/tmp/cleanup-repos-$$.log"

# Entorno mínimo para cron (suele ser muy limitado)
export HOME="${HOME:-$(eval echo ~$(id -un))}"

# Rotación de logs: borrar cleanup-*.log con más de 30 días (solo en $HOME, no recursivo)
find "$HOME" -maxdepth 1 -name "cleanup-*.log" -mtime +30 -delete 2>/dev/null

# Cargar nvm si existe (necesario para npm/node en cron)
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
fi

# Fallback: añadir rutas comunes de node/npm
if ! command -v npm &> /dev/null; then
  for path in "$HOME/.nvm/versions/node/"*/bin \
              /usr/local/bin \
              /opt/node/bin; do
    if [ -d "$path" ] && [ -x "$path/npm" ]; then
      export PATH="$path:$PATH"
      break
    fi
  done
fi

# Ejecutar limpieza y capturar salida
send_alert() {
  local subject="$1"
  local body="$2"
  # Intentar mail, sendmail o msmtp
  if command -v mail &> /dev/null; then
    echo "$body" | mail -s "$subject" "$ALERT_EMAIL" 2>/dev/null
  elif command -v sendmail &> /dev/null; then
    echo -e "Subject: $subject\n\n$body" | sendmail "$ALERT_EMAIL" 2>/dev/null
  elif command -v msmtp &> /dev/null; then
    echo -e "Subject: $subject\n\n$body" | msmtp "$ALERT_EMAIL" 2>/dev/null
  fi
}

if [ ! -x "$CLEANUP_SCRIPT" ]; then
  msg="[$(date '+%Y-%m-%d %H:%M')] ERROR: No se encuentra $CLEANUP_SCRIPT"
  echo "$msg"
  send_alert "❌ Cleanup repos: script no encontrado" "$msg"
  exit 1
fi

# Ejecutar, capturar para email y dejar que stdout vaya al log (si crontab redirige)
"$CLEANUP_SCRIPT" 2>&1 | tee "$LOG_TEMP"
exit_code=${PIPESTATUS[0]}

# Si hay error, enviar email
if [ $exit_code -ne 0 ]; then
  subject="❌ Cleanup repos FALLÓ (exit $exit_code) - $(date '+%Y-%m-%d %H:%M')"
  body="La limpieza semanal de repos falló.

Exit code: $exit_code
Fecha: $(date)

--- Salida del script ---
$(cat "$LOG_TEMP" 2>/dev/null)
"
  send_alert "$subject" "$body"
fi

# Limpiar temp y salir con el código original
rm -f "$LOG_TEMP"
exit $exit_code
