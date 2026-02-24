# thebellepoque · React Portfolio

Portfolio personal en **React + Vite + TypeScript** con sistema de estilos SCSS modular, formulario de contacto con **Resend** y controles de calidad preproducción.

## Estado actual (actualizado)

- Tema oscuro/claro consolidado en SCSS (`:root` + `:root.light`).
- Estilos modularizados por componentes y por capas (`base`, `utilities`, `themes`, `components/*`).
- Lint de estilos activo con Stylelint + SCSS (`npm run lint:styles`).
- Flujo de contacto vía serverless en `/api/contact` usando Resend.
- Build, lint de estilos y test scripts preparados para checks de preproducción.

## Stack

- React 19 + React DOM 19
- Vite 7
- TypeScript 5.9
- Sass/SCSS (arquitectura modular)
- Stylelint (SCSS), ESLint
- Vitest + Testing Library

## Scripts principales

```bash
npm run dev
npm run build
npm run preview

npm run lint
npm run lint:styles

npm run test -- --run
npm run test:coverage

npm run audit:prod
npm run check:preprod
```

`check:preprod` ejecuta: tests, eslint, build y auditoría de dependencias de producción.

## Estructura relevante

```text
src/
  App.tsx
  main.tsx
  styles/
    _variables.scss
    main.scss
    base/
      _global.scss
      _typography.scss
    utilities/
      _common.scss
    themes/
      _light.scss
    components/
      Navbar.scss
      Hero.scss
      Contact.scss
      ...
      navbar/
        _desktop.scss
        _mobile.scss
      hero/
        _layout.scss
        _content.scss
      contact/
        _layout.scss
        _form.scss
api/
  contact.js
```

## Contacto (Resend)

El formulario (`src/components/Contact.tsx`) envía a `/api/contact`.

Variables necesarias:

```env
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_EMAIL=tu-email@ejemplo.com
```

Referencia local: `.env.example`.

## Desarrollo Local y Troubleshooting

### 🔌 Puertos y Servidor
- **Puerto por defecto**: `5173` (Vite).
- **Vercel CLI**: Se recomienda evitar `vercel dev` para desarrollo de UI debido a conflictos de caché y colisión de puertos (suele usar el `3000`). Usa `npm run dev` para una experiencia más rápida y aislada.

### Problemas con el Favicon (Caché)
Si ves el favicon de un proyecto antiguo o un icono genérico en `localhost`:
1. El navegador cachea los favicons por puerto. Al cambiar del `3000` al `5173` hemos aislado este proyecto.
2. Si persiste, prueba en una **pestaña de incógnito**.
3. Limpia la caché específica del sitio en: `F12 > Application > Storage > Clear site data`.

### API y Backend
Las funciones en `/api/` (como el contacto) son **Serverless Functions** de Vercel. 
- En `npm run dev` (Vite), estas rutas no están activas localmente. 
- Para probar el flujo de email completo, se requiere el entorno de Vercel o un despliegue de Preview.

## Calidad

- Lint estilos estricto con `declaration-no-important: true`.
- Convención BEM permitida en selectores SCSS.
- Validar antes de merge: `npm run lint:styles && npm run lint && npm run test -- --run && npm run build`.

## Dependencias

- Registrar en PR/commit toda alta o baja de dependencias (incluyendo motivo técnico).
- Verificación sugerida antes de eliminar: `npx depcheck --json` + validación de scripts/config.
- Tras limpieza, ejecutar `npm run check:preprod`.

## Seguridad

- Headers de seguridad en `vercel.json` (incluye CSP y HSTS).
- Middleware defensivo en `middleware.js`.
- `public/security.txt` para reporte de vulnerabilidades.

## Deploy sugerido

1. Configurar variables (`RESEND_API_KEY`, `CONTACT_EMAIL`) en Vercel.
2. Ejecutar `npm run check:preprod` antes de desplegar.
3. Deploy con output `dist`.

