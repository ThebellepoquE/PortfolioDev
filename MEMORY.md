# 🧠 Memoria Técnica - PortfolioDev

Este archivo sirve como registro de las decisiones técnicas y el estado del proyecto para facilitar la continuidad entre sesiones.

## 📅 Última Sesión: 20 de febrero de 2026

### ✅ Logros de Performance & SEO
- **Fuentes Asíncronas**: Implementado `preconnect` para Google Fonts y carga `print` -> `all`.
- **LCP Optimization**: Imagen de perfil con `fetchpriority="high"` y `preload`.
- **JSON-LD**: Automatizados esquemas `BlogPosting` (dinámico) y `Person` (estático).
- **Sitemap**: Limpieza de rutas draft para evitar errores de indexación.

### 🛡️ Seguridad & Hardening
- **CSP (Content Security Policy)**: Implementada política estricta en `vercel.json` con hashes SHA-256 para scripts inline.
- **Robots.txt**: Bloqueo preventivo de bots de IA (GPTBot, Claude-Web, etc.).

### 🎨 UI/UX (Consistencia Visual)
- **Mobile Dock**: Colores fijados por el usuario:
  - 🩷 **Rosa**: Home / Contacto (Sobre).
  - 💛 **Amarillo**: Proyectos (Maletín).
  - 💚 **Verde**: Blog (Hoja).
- **Light Mode**: Fondo `#f8f8f8`, tarjetas `#fff`, manteniendo glows fluorescentes.

### ⚙️ Infraestructura & Git
- **Repo Actual**: `ThebellepoquE/PortfolioDev` (Repositorio de 2026).
- **Repo Legacy**: `PortfoliO` (Trabajo de bootcamp, se mantiene como historial).
- **Vercel**: Recomendado cambiar el origen del proyecto actual a `PortfolioDev` para no perder el dominio `thebellepoque.dev`.

---

## 🚀 Próximos Pasos (Pendientes)
- [ ] Verificar despliegue en Vercel tras cambiar el repo de origen.
- [ ] Lanzar el post de "Modularización" (actualmente en `draft: true`).
- [ ] Monitorizar Lighthouse en producción para validar el ahorro de 670ms en LCP.

---
*Documento mantenido por GitHub Copilot (Gemini 3 Flash)*
