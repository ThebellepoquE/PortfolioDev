---
title: "Mudarse cuando la casa ya está en pie"
description: "Por qué migré el portfolio de Vite a Next.js justo cuando empezaba a funcionar bien, y qué aprendí de tomar una decisión técnica que nadie me pidió tomar."
date: 2026-06-08
tags:
  - Next.js
  - Portfolio
  - Decisiones técnicas
  - Migración
  - Building in Public
draft: false
image: /images/blog/mudanza.webp
---

En mayo os contaba que había estado blindando el portfolio: casos de estudio, SEO, sitemap, Open Graph, scripts de validación antes de publicar.

Lo contaba con la satisfacción de alguien que por fin ha ordenado su cuarto.

Y entonces, unas semanas después, decidí tirar una pared.

## Por qué cambié algo que ya funcionaba

El portfolio funcionaba. React 19, Vite 7, TypeScript. Tests verdes. Build limpio. Podía tocar cosas sin miedo.

Pero cuanto más trabajaba con Next.js en otros proyectos —LightON ya lo usaba, PurpleBasqueTours lo usaba desde el principio— más incómodo se volvía el portfolio. No por el código. Por el SEO.

Vite es estupendo para una SPA. Pero un portfolio necesita que cada página tenga su propio `<head>`, sus propios metadatos, su JSON-LD correcto sin depender del cliente para pintarlo. Necesita que Google lea bien qué existe. Necesita URLs estáticas y carga rápida desde el servidor, no desde el navegador.

Con Vite y `react-helmet-async` podía hacer mucho de eso. Pero Next.js App Router hace esa parte sin que tengas que pensar en ella dos veces.

Y llegué a esa conclusión sin que nadie me lo dijera.

Eso, para mí, fue la parte interesante.

## Tomar una decisión técnica sin que nadie la pida

En un proyecto propio, no hay nadie que te diga "esto hay que cambiarlo".

No hay un tech lead. No hay un ticket en el board. No hay una reunión donde alguien decide que toca migrar.

Estás tú, el código, y esa sensación de saber que algo podría estar mejor.

Lo más fácil habría sido no tocarlo. Funciona, déjalo. Ya aprenderás Next.js en el siguiente proyecto.

Pero yo no quería que mi portfolio fuera el proyecto donde no apliqué lo que ya sabía. Quería que también fuera honesto en eso: que refleja cómo trabajo ahora, no cómo trabajaba cuando lo empecé.

Así que migré.

## Cómo fue la mudanza

No fue tan dramático como esperaba.

La estructura de carpetas cambió —de `src/pages` a `src/app` con App Router—, la gestión de metadatos pasó de un componente a las funciones `metadata` y `generateMetadata` de Next.js, y el formulario de contacto se convirtió en una Route Handler en lugar de una serverless function separada.

Lo más costoso no fue el código. Fue la configuración de la CSP y los headers de seguridad, que tuve que adaptar a cómo los espera Vercel con Next.js. Hay cosas que en Vite funcionan de una manera y en Next.js piden ser replanteadas.

Pero lo que me llevé fue algo más valioso que la migración en sí: la sensación de entender por qué Next.js hace lo que hace, no solo cómo se usa.

Cuando llevas meses trabajando con una tecnología en proyectos reales, llega un momento en el que deja de ser "el framework que uso" y se convierte en "la forma en que pienso la estructura". Eso pasó con Next.js en junio.

## Por qué migré

La razón es simple: el SEO y el GEO.

Next.js me da control real sobre los metadatos, el renderizado en servidor y cómo los motores de búsqueda — y los modelos de IA — leen el contenido. Con Vite podía hacer muchas cosas, pero siempre con parches encima. Aquí todo fluye de forma natural.

Me gustaría hacer lo mismo con LightON, pero ahora mismo quizás no convenga. Tiene más capas, más dependencias, y una migración mal planificada puede romper lo que ya funciona. Cuando sea el momento, lo haré. De momento, el portfolio ya respira mejor.

## El portfolio sigue siendo la casa

En mayo decía que el portfolio es la casa desde la que salgo al mundo.

Mudarse no fue tirar esa casa. Fue cambiar las tuberías.

Por fuera tiene el mismo aspecto: el diseño neón, la foto circular, los proyectos, el blog, el formulario de contacto. Pero por dentro respira mejor. Las páginas cargan con el `<head>` ya listo en el servidor. El JSON-LD está donde tiene que estar. El sitemap se genera sin scripts externos.

Y yo sé exactamente cómo está montado, porque lo desmontado y volví a montarlo con más criterio.

Eso también es parte del trabajo.

## Lo que me llevo de junio

Que a veces la decisión técnica más importante no es la que te asignan, sino la que te haces a ti misma.

Que migrar algo que funciona no es capricho si hay una razón real detrás.

Y que el portfolio no es un documento estático. Es un proyecto vivo que tiene que evolucionar contigo.

Sigo aprendiendo. Sigo construyendo. Sigo mudándome cuando hace falta.

#NextJS #Portfolio #DecisionesTécnicas #BuildingInPublic #JuniorDev #AppRouter #Migración
