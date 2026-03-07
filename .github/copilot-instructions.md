# Instrucciones para Agentes de IA

Este archivo contiene las directrices de comportamiento para cualquier agente de IA que trabaje en este repositorio.

## 🧠 Memoria Persistente (OBLIGATORIO)

Al iniciar **cualquier conversación**, antes de responder, debes:
1. Llamar a `read_graph` del servidor MCP de memoria.
2. Resumir brevemente las decisiones técnicas relevantes que encuentres.
3. Usarlas como contexto para toda la sesión.

Al finalizar una sesión cuando el usuario lo pida, guarda las decisiones técnicas importantes con `create_entities` y `create_relations`.

## 🎓 Persona: El Profesor de Programación
Actúa siempre como un profesor o mentor experto. Tu objetivo no es solo completar la tarea, sino asegurarte de que el desarrollador comprenda el proceso y las decisiones tomadas.

## 🛠 Normas Operativas

### 1. Explicación Previa Obligatoria
Antes de realizar cualquier cambio en el código, crear archivos o ejecutar comandos en la terminal, debes:
- Describir detalladamente qué vas a hacer.
- Explicar por qué es el enfoque elegido.

### 2. Análisis de Pros y Contras
Para cada decisión técnica significativa (elección de una librería, patrón de diseño, estructura de datos, etc.):
- Presentar los **Pros** (ventajas).
- Presentar los **Contras** (desventajas o compromisos).

### 3. Fomentar las Mejores Prácticas
- Prioriza siempre la legibilidad y el mantenimiento del código.
- Sugiere mejoras si ves código que puede ser optimizado o que no sigue los principios SOLID o Clean Code.

### 4. Verificación
- Tras cada acción, indica cómo puedo verificar que el cambio funciona correctamente (ej. qué comando ejecutar, qué buscar en el navegador).

### 5. Control de Calidad (Pre-Producción)
Antes de sugerir cualquier despliegue o considerar una tarea como finalizada:
- **Ejecución de Tests**: Debes verificar si los cambios afectan a la estabilidad. Ejecuta `pnpm run test -- --run` para asegurar que nada se ha roto.
- **Linting**: Asegúrate de que no hay errores de estilo o posibles bugs detectados por ESLint con `pnpm run lint` (y `pnpm run lint:styles` para SCSS).
- **Cero Tolerancia a Errores**: Nunca subas código con errores de TypeScript o tests fallidos. Si algo falla, el primer paso es arreglarlo antes de continuar. El proyecto usa **pnpm** (no npm); versión fijada en `packageManager` del package.json.

---

*Nota: Estas instrucciones tienen prioridad sobre cualquier comportamiento por defecto del agente.*
# 🧠 PROMPTS PARA DESARROLLO - PortfolioDev

## 🎯 CONTEXTO ESPECÍFICO (THEBELLEPOQUE)
- **Stack**: React + Typescript
- **Estilo**: Código limpio, minimalista, colores fluorescentes
- **Filosofía**: "Menos es más", documentación clara

---

## 🔍 CODE REVIEW 

```prompt
Revisa este código  buscando:
- Memory leaks en estados y efectos
- Problemas de re-renders innecesarios
- Violaciones de principios SOLID en componentes
- Inconsistencias con la paleta de colores 
  --pink: #FF1493;
  --yellow: #FFF01F;
  --green: #00FF00;
  --bg-dark: #0a0a0a;
  --bg-card: #1a1a1a;
  --text: #F5F5F5;

- Casos borde en manejo de estados
- Performance en componentes complejos

1. Code Review (React + TypeScript)

Revisa este componente de React/TypeScript buscando:
- Problemas con hooks (dependencias faltantes en useEffect)
- Tipos TypeScript incorrectos o anys innecesarios
- Violaciones de principios SOLID en componentes
- Inconsistencias con la paleta SCSS (variables en _variables.scss, BEM en components)
- Props drilling innecesario
- Estado innecesariamente complejo
- Componentes demasiado grandes

4. Optimización de Performance (React específico)

Optimiza este componente React:
- Implementa React.memo donde corresponda
- Usa useMemo/useCallback para prevenir re-renders innecesarios
- Lazy load de componentes pesados
- Optimiza imágenes con next/image si usás Next.js
- Mide el bundle size y sugiere optimizaciones
- Explica la mejora con React DevTools Profiler

5. Testing (React Testing Library + Vitest)

Escribe tests para este componente React:
- Unit tests con Vitest + React Testing Library
- Tests para estados del formulario (vacío, válido, inválido, submitting)
- Tests de interacción (click, typing, submit)
- Mock de la API del contact form
- Coverage: 100% en lógica de validación, 80% en UI
- Tests de responsive design con diferentes viewports

6. Form Handling & Validation

Implementa un contact form con:
- TypeScript interfaces para form state
- Validación con Zod o Yup
- Manejo de estado con React Hook Form
- Estados visuales (loading, success, error) con Tailwind
- Protección contra bots (honeypot o recaptcha)
- Integración con servicio de email (Resend vía serverless)
- Animaciones con Framer Motion o Tailwind CSS

7. TypeScript Best Practices

Mejorá los tipos en este proyecto:
- Reemplaza any por tipos específicos
- Crea tipos reutilizables en types/
- Implementa discriminated unions para estados
- Tipos para props de componentes
- Generic components donde aplique
- Type guards para runtime checking
- Configuración estricta de tsconfig.json

8. Tailwind CSS Optimization

Optimiza las clases Tailwind en este componente:
- Extraa componentes repetitivos a clases comunes
- Implementa design tokens consistentes
- Verifica responsive breakpoints
- Mejora accesibilidad (focus states, aria labels)
- Ordena las clases siguiendo el plugin prettier-plugin-tailwindcss
- Elimina clases duplicadas o innecesarias
- Usa arbitrary values cuando corresponda

9. Deployment & CI/CD

Configura deploy automático para este portfolio:
- GitHub Actions para build y test
- Deploy en Vercel/Netlify
- Variables de entorno para API keys
- Preview deployments en PRs
- Lighthouse CI para performance checks
- Bundle size monitoring
- Redirección de errores 404

10. Contact Form Backend Options

Evalua estas opciones para el backend del contact form:

Opción 1: Serverless Function (Recomendada)

- Resend

11. Git / Commits para Portfolio

Generá mensajes de commit siguiendo:
feat: add contact form with validation
fix: resolve mobile navigation bug
refactor: extract Button component
style: improve dark mode colors
docs: update README with deployment steps
test: add contact form submission tests
chore: update dependencies


Prompt Específico para Contact Form:

Crea un contact form para portfolio con:

1. Componente React/TypeScript con las siguientes props:
   - onSubmit callback
   - isLoading state
   - defaultValues opcional

2. Campos:
   - Nombre (required, min 2 chars)
   - Email (required, valid email)
   - Mensaje (required, min 10 chars)
   - Honeypot field para spam

3. Features:
   - Validación en tiempo real con Zod
   - Manejo de estado con React Hook Form
   - Animaciones de estado con Framer Motion
   - Responsive design con Tailwind
   - Accesibilidad completa (ARIA labels, keyboard nav)
   - Dark/light mode compatible

4. Integración:
   - API route para Next.js o serverless function
   - Rate limiting básico
   - Toast notifications para feedback
   - Reintento automático en fallos de red

   Para Prompt de Debugging:

   Este componente React tiene un bug: [describir problema]

Analiza:
1. Qué está causando el re-render innecesario
2. Problemas con el estado asíncrono
3. Issues con StrictMode o efectos dobles
4. Problemas de tipos TypeScript
5. Cómo solucionarlo con hooks correctos
6. Cómo prevenir con eslint-plugin-react-hooks