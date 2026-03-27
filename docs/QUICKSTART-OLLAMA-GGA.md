# Quickstart: Ollama + GGA (ultra corto)

Plantilla reutilizable para activar GGA en cualquier repo sin tocar el flujo normal del proyecto.

## 1) Arranca Ollama

```bash
systemctl --user start ollama.service
```

## 2) Verifica binarios y modelo

```bash
command -v ollama && command -v gga && command -v gga-setup
ollama list
```

## 3) Configura un repo nuevo (una vez)

```bash
cd /ruta/al/proyecto
gga-setup
```

## 4) Flujo diario

```bash
pnpm run gga:run      # o: gga run
git add .
git commit -m "mensaje"   # dispara GGA en pre-commit (si hook está activo)
```

## 5) Si falla

```bash
systemctl --user restart ollama.service
gga install
ollama pull qwen2.5-coder:7b
```

Default recomendado: `ollama:qwen2.5-coder:7b`

## Mini checklist por repo

- [ ] Confirmar gestor de paquetes (`pnpm`, `npm`, `yarn` o `bun`)
- [ ] Añadir script local (`"gga:run": "gga run"`) en `package.json`
- [ ] Ejecutar `gga-setup` en la raíz del repo
- [ ] Verificar que el hook de `pre-commit` está activo
- [ ] Probar un commit de prueba

## Variante de script por gestor de paquetes

```json
{
  "scripts": {
    "gga:run": "gga run"
  }
}
```

Uso:

- pnpm: `pnpm run gga:run`
- npm: `npm run gga:run`
- yarn: `yarn gga:run`
- bun: `bun run gga:run`

## Alias recomendado (una vez en tu máquina)

Añade esto a `~/.bashrc` para tener un comando único `start-gga`:

```bash
start-gga() {
  systemctl --user start ollama.service
  command -v ollama >/dev/null || { echo "Falta ollama"; return 1; }
  command -v gga >/dev/null || { echo "Falta gga"; return 1; }
  command -v gga-setup >/dev/null || { echo "Falta gga-setup"; return 1; }
  echo "✅ Ollama y GGA detectados"
  echo "Siguiente paso en el repo actual:"
  echo "  1) gga-setup   (solo primera vez por repo)"
  echo "  2) pnpm install"
  echo "  3) pnpm run gga:run"
}
```

Recarga la shell:

```bash
source ~/.bashrc
```

Y úsalo así:

```bash
cd /ruta/al/repo
start-gga
```
