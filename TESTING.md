## Testing en PortfolioDev

Esta guía resume los comandos de testing y checks antes de desplegar.

### Comandos básicos

- **Tests unitarios rápidos**:

  ```bash
  pnpm run test -- --run
  ```

- **Cobertura de tests**:

  ```bash
  pnpm run test:coverage
  ```

### Lint y calidad

- **ESLint (código TS/TSX)**:

  ```bash
  pnpm run lint
  ```

- **Stylelint (SCSS)**:

  ```bash
  pnpm run lint:styles
  ```

### Pipeline local antes de preproducción

Ejecuta siempre este comando antes de subir cambios importantes (equivale a tests + lint + build + auditoría de deps):

```bash
pnpm run check:preprod
```

Ese script encadena:

1. `pnpm run test -- --run`
2. `pnpm run lint`
3. `pnpm run build` (que a su vez genera el `sitemap.xml`)
4. `pnpm run audit:prod`

Para comprobar también estilos antes de subir, ejecuta antes: `pnpm run lint:styles`.

