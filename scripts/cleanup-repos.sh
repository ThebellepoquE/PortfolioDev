#!/usr/bin/env bash

# =============================================================================
# Script de limpieza unificada para múltiples repos
# Uso:
#   pnpm run cleanup:repos
#   bash scripts/cleanup-repos.sh --dry-run
#
# Config opcional:
#   CLEANUP_REPOS="/ruta/repo1:/ruta/repo2" bash scripts/cleanup-repos.sh
# =============================================================================

set -uo pipefail

DRY_RUN=0

for arg in "$@"; do
  case "$arg" in
    --dry-run|-n)
      DRY_RUN=1
      ;;
    --help|-h)
      sed -n '1,18p' "$0"
      exit 0
      ;;
    *)
      echo "Argumento no reconocido: $arg"
      echo "Uso: bash scripts/cleanup-repos.sh [--dry-run]"
      exit 2
      ;;
  esac
done

# Rutas por defecto de los repos. Se pueden sobrescribir con CLEANUP_REPOS.
DEFAULT_REPOS=(
  "$HOME/Escritorio/proyectos/discografica"
  "$HOME/Escritorio/proyectos/lighton"
  "$HOME/Escritorio/proyectos/purple-basque"
  "$HOME/Escritorio/proyectos/PortfolioDev"
)

if [ -n "${CLEANUP_REPOS:-}" ]; then
  IFS=':' read -r -a REPOS <<< "$CLEANUP_REPOS"
else
  REPOS=("${DEFAULT_REPOS[@]}")
fi

run_cmd() {
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "      dry-run: $*"
  else
    "$@"
  fi
}

echo "🧹 INICIANDO LIMPIEZA DE REPOS"
echo "=================================================="
if [ "$DRY_RUN" -eq 1 ]; then
  echo "Modo simulación: no se borrará ni modificará nada."
fi

failures=0

for repo in "${REPOS[@]}"; do
  repo="${repo/#\~/$HOME}"
  echo -e "\n📦 Procesando: $(basename "$repo")"
  
  if [ ! -d "$repo" ]; then
    echo "   ❌ No existe: $repo"
    failures=$((failures + 1))
    continue
  fi
  
  # Subshell: evita que cd contamine el directorio del script
  (
    cd "$repo" || exit 1
    
    # 1. Limpieza de caché local (no toca pnpm cache global)
    echo "   🗑️  Limpiando caché local..."
    run_cmd rm -rf node_modules/.cache .vite dist
    [ -d ".turbo" ] && run_cmd rm -rf .turbo
    
    # 2. depcheck: dependencias no usadas
    if command -v pnpm &> /dev/null && [ -f "package.json" ]; then
      echo "   🔍 Analizando dependencias no usadas..."
      output="/tmp/depcheck-$(basename "$repo").json"
      if [ "$DRY_RUN" -eq 1 ]; then
        echo "      dry-run: pnpm exec depcheck --json > $output"
      elif pnpm exec depcheck --json > "$output" 2>/dev/null; then
        if command -v jq &> /dev/null; then
          deps=$(jq -r '.dependencies[]? // empty' "$output" 2>/dev/null | head -5)
          if [ -n "$deps" ]; then
            echo "      Posibles no usadas: $deps"
          else
            echo "      ✓ Sin dependencias obvias no usadas"
          fi
        else
          echo "      ✓ Análisis guardado en $output (instala jq para resumen)"
        fi
      else
        echo "      ⚠️  depcheck no disponible o falló; se continúa"
      fi
    elif [ -f "package.json" ]; then
      echo "   ⚠️  pnpm no está disponible en PATH; se saltan checks de dependencias"
    fi
    
    # 3. Árbol de dependencias directas
    echo "   📊 Dependencias directas:"
    if command -v pnpm &> /dev/null && [ -f "package.json" ]; then
      pnpm ls --depth=0 2>/dev/null | head -30 || true
    else
      echo "      Saltado"
    fi
    
    # 4. Paquetes desactualizados
    echo "   ⬆️  Paquetes desactualizados:"
    if [ "$DRY_RUN" -eq 1 ]; then
      echo "      dry-run: pnpm outdated"
    elif command -v pnpm &> /dev/null && [ -f "package.json" ]; then
      if command -v timeout &> /dev/null; then
        timeout 45s pnpm outdated 2>/dev/null || true
      else
        pnpm outdated 2>/dev/null || true
      fi
    else
      echo "      Saltado"
    fi
  )
  repo_exit=$?
  if [ "$repo_exit" -ne 0 ]; then
    failures=$((failures + 1))
    echo "   ❌ Falló: $(basename "$repo")"
    continue
  fi
  
  echo "   ✅ Completado: $(basename "$repo")"
done

echo -e "\n=================================================="
if [ "$failures" -eq 0 ]; then
  echo "✅ LIMPIEZA COMPLETADA"
else
  echo "⚠️  LIMPIEZA COMPLETADA CON $failures AVISO(S)/ERROR(ES)"
fi
echo "📁 Revisa /tmp/depcheck-*.json para análisis detallado"
echo ""
echo "Siguiente paso: pnpm run check:preprod en cada repo"

exit "$failures"
