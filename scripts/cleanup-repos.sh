#!/bin/bash

# =============================================================================
# Script de limpieza unificada para múltiples repos
# Uso: pnpm run cleanup:repos  o  bash scripts/cleanup-repos.sh
# =============================================================================

# Rutas de los repos (ajusta según tu máquina)
REPOS=(
  "$HOME/Escritorio/proyectos/DISCOGRAFICA"
  "$HOME/Escritorio/proyectos/light"
  "$HOME/Escritorio/proyectos/PortfolioDev"
)

echo "🧹 INICIANDO LIMPIEZA PROFUNDA DE TODOS LOS REPOS"
echo "=================================================="

for repo in "${REPOS[@]}"; do
  echo -e "\n📦 Procesando: $(basename "$repo")"
  
  if [ ! -d "$repo" ]; then
    echo "   ❌ No existe: $repo"
    continue
  fi
  
  # Subshell: evita que cd contamine el directorio del script
  (
    cd "$repo" || exit 1
    
    # 1. Limpieza de caché local (no toca pnpm cache global)
    echo "   🗑️  Limpiando caché local..."
    rm -rf node_modules/.cache .vite dist 2>/dev/null
    [ -d ".turbo" ] && rm -rf .turbo 2>/dev/null
    
    # 2. depcheck: dependencias no usadas
    if command -v pnpm &> /dev/null && [ -f "package.json" ]; then
      echo "   🔍 Analizando dependencias no usadas..."
      output="/tmp/depcheck-$(basename "$repo").json"
      if pnpm exec depcheck --json > "$output" 2>/dev/null; then
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
      fi
    fi
    
    # 3. Árbol de dependencias directas
    echo "   📊 Dependencias directas:"
    pnpm ls --depth=0 2>/dev/null | head -30
    
    # 4. Paquetes desactualizados
    echo "   ⬆️  Paquetes desactualizados:"
    pnpm outdated 2>/dev/null || true
  )
  
  echo "   ✅ Completado: $(basename "$repo")"
done

echo -e "\n=================================================="
echo "✅ LIMPIEZA COMPLETADA"
echo "📁 Revisa /tmp/depcheck-*.json para análisis detallado"
echo ""
echo "Siguiente paso: pnpm run check:preprod en cada repo"
