#!/usr/bin/env bash

# =============================================================================
# Wrapper para ejecutar cleanup-repos.sh desde CRON
# Garantiza entorno correcto (nvm, PATH) para los 3 repos:
#   - discografica, lighton, purple-basque, PortfolioDev
#
# En caso de error: envía email a ALERT_EMAIL (requiere msmtp configurado)
#
# Configurar crontab:
#   crontab -e
#   0 9 * * 1 /home/thebellepoque/Escritorio/proyectos/PortfolioDev/scripts/cleanup-repos-cron.sh
#
# O con log a archivo (el email solo se envía en fallos):
#   0 9 * * 1 /home/thebellepoque/Escritorio/proyectos/PortfolioDev/scripts/cleanup-repos-cron.sh >> ~/cleanup-$(date +\%Y-\%m-\%d).log 2>&1
# =============================================================================

set -uo pipefail

ALERT_EMAIL="thebellepoque@gmail.com"

# Directorio del script (portfolio)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLEANUP_SCRIPT="$SCRIPT_DIR/cleanup-repos.sh"
LOG_TEMP="/tmp/cleanup-repos-$$.log"

# Entorno mínimo para cron (suele ser muy limitado)
export HOME="${HOME:-$(eval echo ~$(id -un))}"

# Rotación de logs: borrar cleanup-*.log con más de 30 días (solo en $HOME, no recursivo)
find "$HOME" -maxdepth 1 -name "cleanup-*.log" -mtime +30 -delete 2>/dev/null

# Cargar nvm si existe (necesario para node/pnpm en cron)
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
fi

# Fallback: añadir rutas comunes de node/pnpm
if ! command -v pnpm &> /dev/null; then
  for path in "$HOME/.nvm/versions/node/"*/bin \
              "$HOME/.local/share/pnpm" \
              /usr/local/bin \
              /opt/node/bin; do
    if [ -d "$path" ] && { [ -x "$path/pnpm" ] || [ -x "$path/npm" ]; }; then
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

if [ ! -f "$CLEANUP_SCRIPT" ]; then
  msg="[$(date '+%Y-%m-%d %H:%M')] ERROR: No se encuentra $CLEANUP_SCRIPT"
  echo "$msg"
  send_alert "❌ Cleanup repos: script no encontrado" "$msg"
  exit 1
fi

# Ejecutar y capturar para email. En éxito no imprime nada, para evitar emails de cron por MAILTO.
cleanup_args=()
if [ "${CLEANUP_DRY_RUN:-0}" = "1" ]; then
  cleanup_args+=(--dry-run)
fi

bash "$CLEANUP_SCRIPT" "${cleanup_args[@]}" > "$LOG_TEMP" 2>&1
exit_code=$?

# Si hay error, enviar email
if [ $exit_code -ne 0 ]; then
  cat "$LOG_TEMP"
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
