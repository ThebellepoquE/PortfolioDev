---
title: "Cuidar la casa desde la que salgo al mundo"
description: "Seis horas, una IA y yo blindando cada rincón de mi portfolio. Lo que pasó cuando decidí que mi casa digital se merecía el mismo cuidado que le pongo a los proyectos de otros."
date: 2026-06-05
tags:
  - Portfolio
  - SEO
  - SDD
  - Open Graph
  - JSON-LD
  - Performance
  - Marca personal
  - Building in Public
draft: false
image: /images/blog/blindaje-portfolio-seo-marca.webp
---

En el post anterior hablaba de [proyectos cercanos y problemas reales](/blog/blindaje-portfolio-workflow). De ese punto raro en el que dejas de hacer ejercicios sin contexto pero tampoco estás hablando de clientes como si llevaras media vida con agenda llena.

Ese punto intermedio tiene algo muy bonito: te obliga a ser honesta.

Pero también tiene algo incómodo: tus propios proyectos empiezan a pedirte el mismo nivel de cuidado que les das a los de otros. Y ahí es donde volví a olvidarme de mí.

## En casa de herrerx

LightON tiene TypeScript, Docker, PostgreSQL, automatización Python, tests E2E con Playwright y un Lighthouse rozando 100.

Discográfica tiene Next.js 16, Sanity CMS, optimización de imágenes y un pipeline de CI que revisa el bundle antes de deployar.

PurpleBasqueTours tiene i18n, booking con Cal.com, formularios con Zod y monitoreo con Sentry.

¿Y mi portfolio? Mi propia casa digital. Esa desde la que salgo al mundo a contar quién soy y qué hago. Esa que un recruiter abre en 15 segundos y decide si sigue leyendo o cierra la pestaña.

Esa... tenía los metadatos a medio poner. Las imágenes sin optimizar. El JSON-LD duplicado y roto. La fuente de Google cargando 300KB para pesos que nunca usaba. El sitemap sin decirle a Google qué imágenes tenía cada página. Y los datos de mis propios proyectos — los mismos que tanto cuido cuando son de otros — desactualizados o directamente en blanco.

En casa de herrerx, cuchillo de palo. Qué vergüenza!

No la vergüenza que paraliza. La vergüenza que empuja.

## Seis horas, una IA y yo

El miércoles me senté a las 11 de la mañana. Tenía café, tenía una checklist mental de cosas que quería arreglar y tenía — esto es importante — un método.

Porque aquí va una confesión: durante meses trabajé a golpe de intuición. Veo algo mal, lo arreglo. Veo otra cosa, la toco. Sin orden, sin prioridades, sin saber si lo que estaba haciendo era lo que más importaba o lo que menos.

Eso funciona cuando tu portfolio tiene tres páginas y dos proyectos. Pero el mío creció sin pedirme permiso, y aunque yo tengo la filosofía de aprender algo cada día — eso no se negocia —, lo que aprendí esta vez es que la intuición sola no alcanza. Que se necesita metodología.

Así que antes de tocar una sola línea de código, me senté a pensar. ¿Qué necesita realmente este portfolio? ¿Qué espera Google de una página en 2026? ¿Qué espera un recruiter que abre el enlace desde LinkedIn? ¿Qué espero yo cuando vuelvo dos semanas después y necesito tocar algo sin romperlo?

De ahí salió una lista de 13 cosas. No 13 ideas vagas. 13 requisitos con criterios de aceptación. Cosas como "cuando alguien comparte mi portfolio en Twitter, la tarjeta tiene que mostrar mi nombre, mi descripción y mi imagen sin que yo esté ahí para comprobarlo". O "cuando Google indexa mi blog, tiene que saber que cada post es un BlogPosting, no texto suelto".

Suena a ingeniería. Y lo es. Pero también es cuidado. Porque ponerse a pensar antes de picar código es la diferencia entre remendar agujeros y construir una casa.

El resto de la sesión fue un baile. Yo marcando el ritmo, la IA ejecutando. Yo diciendo "esto no me gusta, revísalo". La IA trayendo opciones. Yo tomando decisiones. La IA implementando. Yo verificando.

Así durante seis horas.

## Lo que no se ve también comunica

A las dos de la tarde ya tenía la primera fase lista. Los metadatos que me faltaban — `twitter:site`, `og:locale` — cosas que parecen una tontería pero que son la diferencia entre "esta persona sabe lo que hace" y "esto lo hizo un robot".

A las cuatro, los datos estructurados. Google no solo lee texto: lee estructura. Y si tú no le dices qué es cada cosa — esto es un artículo, esto es un proyecto, esta persona es la autora — lo adivina. Y cuando Google adivina, tu portfolio pierde.

Así que le puse JSON-LD a todo. Cada post del blog ahora es un `BlogPosting` con autor, fecha y URL canónica. Cada proyecto es un `CreativeWork`. La página del blog es una `CollectionPage`. Suena a burocracia digital, pero es lo que hace que cuando alguien busca "desarrolladora full-stack portfolio", Google entienda que esta página existe y qué contiene.

Luego vinieron las imágenes. En el post de LightON ya conté mi obsesión con Lighthouse. Pero una cosa es optimizar las imágenes de un cliente y otra muy distinta es optimizar las tuyas. Las mías estaban en JPEG pelado. Sin comprimir. Sin variantes para móvil. Sin formato moderno.

Generé versiones WebP. Generé versiones AVIF — que pesan la mitad que WebP y se ven igual. Metí `srcSet` y `sizes` para que el navegador elija la imagen correcta según la pantalla. Y lo envolví todo en un `<picture>` para que los navegadores que entienden AVIF lo usen y los que no, tengan WebP de respaldo.

Cada kilobyte que no se carga es un respiro para quien entra desde el móvil. Y la mayoría entra desde el móvil.

## La puerta antes del caos

A las seis de la tarde ya tenía el bundle analyzer corriendo. Es una herramienta que te muestra — con un gráfico de colores — qué pesa cada parte de tu sitio. Como una radiografía.

Descubrí que la fuente Inter que uso para todo el portfolio estaba cargando 21 pesos tipográficos distintos. 300KB. Para un sitio que solo usa 5.

Pasé de `wght@400..900` a `wght@400;500;600;700;900`. Cien kilobytes menos. El tipo de cambio que solo te da pararte a mirar.

Luego el sitemap. Ya tenía uno, pero era básico: lista de URLs, fin. Le añadí las imágenes. Ahora Google no solo sabe qué páginas existen, sino qué imágenes tiene cada una. Para un portfolio visual, eso importa.

Y finalmente — esto fue lo más satisfactorio — me senté a revisar los datos de mis propios proyectos en el código. Lo que dice mi portfolio sobre PurpleBasqueTours, sobre LightON, sobre Discográfica.

Era un desastre.

PurpleBasqueTours aparecía como "React + Vite + SCSS" cuando en realidad es Next.js 15 con Sanity CMS, booking con Cal.com, formularios con Zod, monitoreo con Sentry y contenido multilingüe en inglés y español. Lo tenía documentado como si fuera una SPA genérica cuando es el proyecto más complejo que he hecho.

Discográfica tenía las puntuaciones de complejidad, innovación e impacto a cero. En blanco. Como si no existiera. Y es un proyecto con Next.js 16, Lighthouse CI y Playwright.

Mi propio portfolio. Mis propios proyectos. Y yo era la que peor los estaba contando.

Eso dolió. Pero también me alivió encontrarlo. Porque ahora están bien. Ahora quien lea mi portfolio ve lo que realmente hice, no una versión reducida que escribí con prisa hace meses.

## Lo que me llevo

Me llevo que blindar no es ponerle candados a todo. Es revisar. Es sentarte seis horas con un método y decir "voy a cuidar esto como si fuera para alguien más".

Me llevo que la herramienta — la IA — es increíblemente potente cuando tú sabes lo que quieres. Pero no reemplaza el criterio. No reemplaza la pausa de decir "esto no me gusta, revísalo". No reemplaza la decisión de qué importa y qué no.

Me llevo que mi portfolio ya no es un escaparate. Es una casa. Con cimientos. Con puertas que cierran bien. Con una checklist de 103 cosas que sé que funcionan porque las verifiqué una por una.

Y me llevo que thebellepoquE no es solo un nombre que pongo en una esquina. Es una forma de hacer las cosas con mucha luZ. Incluso — sobre todo — cuando estoy arreglando lo que yo misma dejé a medias.

Sigo empezando. Sigo aprendiendo. Sigo encontrando cosas que escribí hace meses y pensando "madre mía, cómo no vi esto antes".

Pero ahora tengo un método. Y una casa que me representa de verdad.

#Portfolio #SEO #JSONLD #Performance #WebP #AVIF #SpecDrivenDevelopment #MarcaPersonal #BuildingInPublic
