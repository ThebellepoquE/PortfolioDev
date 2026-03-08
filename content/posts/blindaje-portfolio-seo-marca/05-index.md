---
title: "Blindaje técnico II | SEO, sitemap e imagen de marca"
description: "Segunda parte del blindaje: métricas en proyectos, SEO con react-helmet-async, sitemap automático y la OG image del círculo rosa."
date: 2026-05-08
tags:
  - SEO
  - React Helmet
  - Sitemap
  - Open Graph
  - Marca personal
  - Portfolio
draft: true
# Sustituir por /images/blog/blindaje-lighthouse.webp cuando el archivo exista en public/images/blog/
image: /images/blog/modularizacion.webp
---

En la [primera parte](/blog/blindaje-portfolio-workflow) del blindaje hablábamos de workflow, pnpm y de los 47 tests que no perdonan. Hoy toca lo que **sí ve** (o puede ver) alguien que no abre tu código: buscadores, redes sociales y la persona que hace clic en tu enlace.

Un portfolio bonito que no se indexa bien o que al compartirlo muestra una miniatura genérica está dejando oportunidades en la mesa. Por eso hemos blindado también **SEO, sitemap y la imagen que te representa**.

## Métricas de impacto: que los proyectos hablen por sí solos

Antes, una tarjeta de proyecto era título, descripción y "Visitar". Ahora cada proyecto puede llevar **métricas concretas** (por ejemplo: "47+ tests", "Migración 100% TS", "Reducción de tiempo en tareas repetitivas") y un enlace a **"Ver caso de estudio"** que lleva a una página de detalle.

No es relleno: es **evidencia**. Un reclutador o cliente ve de un vistazo qué impacto tuvo el trabajo. Los datos están en el mismo modelo de datos (`projectsData`) y se muestran con un componente accesible (`MetricBadge`), con tooltip y buen contraste. Detalle que suma.

## SEO dinámico: cada ruta con su título y su meta

En una SPA, si no cuidas el `<head>`, todas las páginas comparten el mismo título y la misma descripción. **react-helmet-async** nos permite inyectar por ruta:

- **title** y **description**
- **canonical**
- **Open Graph** (og:title, og:description, og:image, og:url)
- **Twitter Cards**

Así, la home, el blog, cada post y cada página de proyecto tienen su propia identidad para buscadores y para cuando alguien comparte el enlace. El componente `SEO.tsx` centraliza la lógica y las rutas lo usan con los datos que ya tienen (por ejemplo, el post o el proyecto). Sin duplicar código, sin olvidar una ruta.

## Sitemap automatizado: que Google sepa qué existe

Un sitemap estático se desactualiza en cuanto publicas un post o añades un proyecto. Por eso he metido en el **build** un script (`generate-sitemap.ts`) que:

- Lee los proyectos y los posts (excluyendo drafts).
- Genera `public/sitemap.xml` con todas las URLs, prioridades y fechas de última modificación.
- Se ejecuta antes de `vite build`, así que cada despliegue lleva el sitemap al día.

Google (y otros) tienen así una lista fiable de qué páginas indexar. No hay que acordarse de tocar el sitemap a mano: el proceso de build se encarga.

## La OG image: el círculo rosa que me representa


Cuando compartes un enlace en LinkedIn, Twitter o WhatsApp, la **miniatura** que sale es la imagen Open Graph. Si no defines una, las redes eligen cualquier cosa o nada. He definido una **imagen por defecto** (`og-image-default.jpg`): fondo negro, círculo rosa, "thebellepoque.dev", "FULL STACK DEVELOPER" y el stack (Python, TypeScript, React, etc.) en la parte inferior.

Es **marca personal en un vistazo**. Quien comparte tu portfolio ve eso, no un favicon o un bloque vacío. Las páginas que no tienen imagen propia (home, listado de blog, etc.) usan esta por defecto; los posts pueden seguir usando su propia imagen si la tienen en el frontmatter.

## De "portfolio bonito" a "máquina de captar oportunidades"

El blindaje técnico no es solo para dormir tranquilo. Es para que:

- **Buscadores** indexen bien cada ruta.
- **Quien comparte** tu enlace muestre una miniatura que te identifica.
- **Quien entra** vea proyectos con métricas y casos de estudio, no solo descripciones genéricas.

Todo eso se apoya en el workflow de la parte I: fases, tests y un `check:preprod` que no deja subir algo roto. Juntas, las dos partes son el paso de "tengo un portfolio" a "tengo un portfolio que trabaja por mí".

Si te interesa el detalle técnico (react-helmet-async, script del sitemap, formato 1200×630 para OG), está todo en el repo y en la documentación del proyecto. Y si quieres seguir la serie, en los posts anteriores ([El laberinto de empezar](/blog/el-laberinto-de-empezar), [Un año, un gran cambio](/blog/lighton-de-cero-a-produccion), [Evolución](/blog/modularizacion-lighton)) tienes el resto del viaje.

#SEO #OpenGraph #Sitemap #MarcaPersonal #Portfolio #React #BuildingInPublic
