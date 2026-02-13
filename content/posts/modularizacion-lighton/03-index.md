---
title: "Evolución | De la entrega al despliegue profesional"
description: Cómo un código de estudiante se transformó en una infraestructura sólida, escalable y profesional entre noviembre y enero.
date: 2026-03-01
tags:
  - TypeScript
  - Docker
  - Python
  - Automatización
  - JuniorDev
draft: true
image: /images/blog/modularizacion.webp
---

¡Hola de nuevo! Ya han pasado unos meses desde que os conté cómo nació **LIGHT-ON**. Si en el primer post hablábamos de ese "salto al vacío" y la entrega del proyecto final, hoy quiero contaros cómo ese código de "estudiante" se ha ido transformando en una infraestructura sólida, escalable y, sobre todo, profesional.

Mantener un proyecto vivo desde noviembre del año pasado me ha enseñado que el desarrollo no termina cuando el cliente (en este caso, ¡mi hijo!) dice "me gusta". Ahí es donde empieza la verdadera ingeniería.

## 🛠️ Noviembre: Refactorizar para no morir

El proyecto nació con prisa, y eso se notaba. Lo primero que hice fue atacar el "desorden visual". Pasamos de CSS puro a **SCSS**, lo que me permitió unificar la marca con variables (ese azul y amarillo que ya son sello de la casa) y mixins para que el diseño fuera verdaderamente responsive. 

No fue solo estética, fue **mantenibilidad**. Fue mi primera lección de "limpiar la casa antes de invitar a más gente".

## 🐍 Diciembre: Más allá de la web (Hola, Automatización)

En diciembre me di cuenta de una necesidad real: la reputación online. Un negocio local vive de las reseñas de Google, pero ¿cómo pedir feedback sin ser pesado?

Aquí es donde entró mi pasión por las automatizaciones. Desarrollamos un **sistema de encuestas en Python** que:
1. Registra el servicio realizado.
2. Envía un correo automático al cliente preguntando qué tal fue.
3. Si la nota es alta (4-5 estrellas), le invita a dejar la reseña en Google. Si es baja, el feedback nos llega directo para mejorar.

Es fascinante ver cómo una herramienta externa integrada en el backend puede cambiar totalmente el flujo de un negocio.

## 🛡️ Enero: El mes del "Blindaje" Técnico

Este último mes ha sido una locura de aprendizaje intenso. Me puse una meta: llevar LIGHT-ON al siguiente nivel de calidad. ¿Cómo lo hicimos?

1.  **Migración total a TypeScript:** Me cansé de los errores en tiempo de ejecución. Ahora el código es mucho más robusto. Si falta un dato o un tipo no coincide, el compilador me avisa antes de que el usuario vea un error.
2.  **Dockerización:** Hemos encapsulado todo el ecosistema (Frontend, Backend, Base de Datos Postgres) en contenedores Docker. Ahora desplegar en producción o montar el entorno local es cuestión de segundos.
3.  **Obsesión por la Performance:** Gracias a optimizaciones de carga (lazy loading, compresión de imágenes, minificación de CSS), hemos rozado el **100 en Lighthouse**. Porque, admitámoslo, a nadie le gusta esperar.
4.  **Seguridad y Logs:** Implementamos un sistema de logging profesional con Winston. Si algo falla en el servidor, ahora sé exactamente qué, cuándo y por qué.

## 🎓 Lo que he aprendido

Si algo me llevo de estos meses es que **un proyecto nunca está terminado**. Cada commit es un aprendizaje. He aprendido a amar a TypeScript, a confiar en Docker y a entender que el backend no es solo guardar datos, es resolver problemas de negocio.

LIGHT-ON ya no es solo "mi proyecto de graduación". Es una herramienta de trabajo real que sigue brillando cada día más. 

Mi lema de **"Simple pero funcional"** sigue guiando mis pasos, pero ahora con unos cimientos mucho más sólidos.

¡Nos vemos en el próximo post! 🚀

#LightOn #FullStack #TypeScript #Docker #Python #Automatizacion #JuniorDev #BuildingInPublic #SimplePeroFuncional
