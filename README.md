# thebellepoque · React Portfolio

Portfolio personal migrado desde Reflex a una stack **React + Vite + TypeScript** con estética fluorescente.

## ✨ Características

- Secciones `Navbar`, `Hero`, `Projects`, `Contact` y `Footer` con diseño responsive para breakpoints `sm/md/lg/xl`.
- Paleta fluorescente (pink/yellow/green) con titles `title-neon` y glow consistente.
- Formulario de contacto con integración **EmailJS** y manejo de estados (`loading`, `success`).
- 36 tests con Vitest + React Testing Library (85%+ coverage en `Contact.tsx`).
- Optimización de imagen principal usando **Sharp** y `srcSet` responsive (ahorro ~26 KiB en móvil).
- Accesibilidad básica: outlines `focus-visible`, labels descriptivos, `sr-only` en iconos.

## 🛠️ Tech Stack

- React 19 + React DOM 19
- Vite 7 (dev server, build)
- TypeScript 5.9
- Tailwind CSS 4 (config via `@tailwindcss/vite`)
- Vitest + React Testing Library + Jest DOM
- Sharp (optimización de assets)

## 🚀 Puesta en marcha

```bash
npm install       # instala dependencias
npm run dev       # levanta Vite en http://localhost:5173 (ajusta puerto si está ocupado)

npm run build     # build de producción (tsc + vite build)
npm run preview   # sirve el build generado
npm run lint      # eslint

npm test -- --run # ejecuta Vitest en modo run (recomendado para CI)
npm run test:coverage # cobertura con v8
```

> Requiere Node.js ≥ 18.

## 📂 Estructura relevante

```
src/
  components/
    Navbar.tsx
    Hero.tsx
    Projects.tsx
    Contact.tsx
    Footer.tsx
  index.css
  App.tsx

public/
  profile.webp          # imagen original (433×561)
  profile-200.webp      # versión optimizada generada con Sharp
```

## ✉️ Configuración EmailJS

El formulario (`src/components/Contact.tsx`) consume variables de entorno (`import.meta.env`, con valores de fallback para desarrollo).

1. Copia el archivo de ejemplo y rellena tus claves:

  ```bash
  cp .env.example .env.local
  ```

2. Edita `.env.local`:

  ```env
  VITE_EMAILJS_SERVICE_ID=...
  VITE_EMAILJS_TEMPLATE_ID=...
  VITE_EMAILJS_USER_ID=...
  ```

3. En producción (Vercel) añade las mismas variables en **Project Settings → Environment Variables** para entornos `Production` y `Preview`.

## 🖼️ Optimización de imágenes

Se añadió **Sharp** como dev dependency para generar versiones ligeras.

Comando usado para la foto principal:

```bash
node -e "const sharp=require('sharp'); sharp('public/profile.webp')
  .resize({ width: 200, height: 200, fit: 'cover' })
  .toFile('public/profile-200.webp');"
```
El componente `Hero` consume un `srcSet`:
```tsx
<img
  src="/profile-200.webp"
  srcSet="/profile-200.webp 200w, /profile.webp 433w"
  sizes="(max-width: 639px) 180px, (max-width: 1023px) 220px, 260px"
  ...
/>
```
Ajusta las dimensiones si cambias el diseño o sustituyes la imagen.

## 🧪 Testing

- `src/components/Contact.test.tsx` cubre renderizado, estados del formulario, validaciones, accesibilidad y responsive.
- Ejecuta `npm test -- --run` antes de desplegar; `npm run test:coverage` para reportes de cobertura (usa `@vitest/coverage-v8`).

## 🌐 Despliegue sugerido

1. Configurar repositorio Git (recomendado nuevo repo en vez del histórico Reflex).
2. Añadir workflow de CI (ej. GitHub Actions) que ejecute `npm ci` + `npm test -- --run` + `npm run build`.
3. Deploy en Netlify/Vercel (en Vercel selecciona framework Vite, build `npm run build`, output `dist`, y define `VITE_EMAILJS_*`).
4. Monitoriza Lighthouse (especialmente LCP del Hero y tamaños de bundle) sobre el deploy final.

---

Si necesitas volver a generar tests, ajustar colores o preparar scripts extra, abre un issue o continuamos aquí. 💡
