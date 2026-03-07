---
title: "Blindaje técnico I: Portfolio como máquina de oportunidades"
description: "Cómo estructuramos el workflow profesional del portfolio: pnpm, fases, commits y 47 tests que no perdonan."
date: 2026-04-08
tags:
  - Portfolio
  - pnpm
  - Workflow
  - Testing
  - Vitest
  - Definition of Done
draft: true
image: /images/blog/modularizacion.webp
---

En [El laberinto de empezar](/blog/el-laberinto-de-empezar) hablábamos de ese momento en el que todas las puertas están abiertas y no sabes por cuál pasar. En [Evolución](/blog/modularizacion-lighton) conté cómo LightON pasó de entrega de estudiante a infraestructura profesional. Hoy toca hablar del **otro proyecto que cuido con el mismo cariño**: este portfolio.

No es solo una tarjeta de visita en HTML. Es la puerta de entrada a conversaciones, ofertas y proyectos. Por eso, estos días lo hemos blindado. No con más features llamativas, sino con **fundamentos que no se ven**: workflow, velocidad y una definición de hecho que no negocia.

## Por qué importa el workflow (y no solo el diseño)

Un portfolio puede ser precioso en local y un desastre en producción. O puede ser rápido en tu máquina y lento en la de un reclutador con tres pestañas abiertas. Lo que hemos hecho en las últimas semanas no se ve a simple vista: **pnpm**, **fases con rollback**, **47 tests** y un script de preproducción que no deja pasar ni un fallo.

La idea es simple: que cada cambio sea reversible, medible y coherente con el resto del stack. Que si algo se rompe, lo sepa antes de desplegar.

## De npm a pnpm: más rápido y más predecible

La migración de **npm** a **pnpm** no fue capricho. Buscaba:

- **Velocidad**: instalaciones y builds más rápidos.
- **Consistencia**: un solo lockfile (`pnpm-lock.yaml`) y la versión fijada en `package.json` con `packageManager: "pnpm@10.28.0"` para que Corepack garantice que todo el mundo usa la misma.

Así evitamos el clásico "en mi máquina funciona". Si el CI o un compañero usan la misma versión de pnpm, el árbol de dependencias es el mismo. Menos sorpresas, más tiempo para lo que importa. Gracias Midudev!! Siempre cazo algo interesante de todo lo que nos cuentas.

## Fases, commits y plan de rollback

No hemos tirado features a lo loco. Seguimos un **plan por fases** (documentado en el repo):

1. **Fase 1**: Modelo de proyectos (tipos, datos).
2. **Fase 2**: UI de métricas y enlaces (MetricBadge, "Ver caso de estudio").
3. **Fase 3**: SEO dinámico (react-helmet-async).
4. **Fase 4**: Sitemap automatizado en el build.

Cada fase tiene **criterios de validación** y un **plan de rollback**. Si algo falla, sabemos qué commit revertir o qué script quitar del `build`. Eso es profesional: no solo "subir código", sino tener un camino de vuelta.

## Los 47 tests y la definición de hecho

No negocio con TypeScript en rojo ni con tests rotos. La **Definition of Done** del proyecto (en `.cursorrules`) exige:

- `pnpm run test -- --run` en verde.
- `pnpm run lint` y `pnpm run lint:styles` limpios.
- `pnpm run build` correcto.
- `pnpm run audit:prod` sin vulnerabilidades en dependencias de producción.

Todo eso se ejecuta con **`pnpm run check:preprod`** antes de cada despliegue. Si algo falla, no se sube. Punto. Los **47 tests** (Vitest + Testing Library) cubren componentes críticos: Contact, BlogList, ErrorBoundary, SectionTitle. No son decoración: son la red de seguridad.

## Qué nos llevamos de esta parte del blindaje

Un portfolio no es solo lo que se ve. Es **cómo se construye y se mantiene**. Pasar a pnpm, ordenar el trabajo en fases y no desplegar sin tests ni lint nos deja con una base sólida para la segunda parte del blindaje: **SEO, sitemap y la imagen que te representa**. Eso, en el siguiente post.

Hasta entonces: menos humo, más fundamentos.

#Portfolio #pnpm #Workflow #Testing #Vitest #DefinitionOfDone #BuildingInPublic #JuniorDev
