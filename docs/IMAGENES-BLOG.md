# Imágenes del blog

## Formato requerido

- **Carpeta:** `public/images/blog/`
- **Formato de archivo:** `.webp` (recomendado para buen tamaño y calidad)
- **Nombre:** minúsculas, sin espacios. Puedes usar guiones bajos, p. ej. `blindaje-workflow.webp` o `mi_post.webp`.
- **Ruta en el post:** la URL es desde la raíz del sitio, no desde `public/`:
  ```yaml
  image: /images/blog/nombre-del-archivo.webp
  ```

## Ejemplos en el repo

| Post (slug)   | Archivo actual          | Ruta en frontmatter              |
|---------------|-------------------------|----------------------------------|
| el-laberinto-de-empezar | laberinto.webp     | `/images/blog/laberinto.webp`     |
| lighton-de-cero-a-produccion | hello_world.webp | `/images/blog/hello_world.webp` |
| modularizacion-lighton | modularizacion.webp | `/images/blog/modularizacion.webp` |
| blindaje-portfolio-workflow | (pendiente)   | usar imagen propia cuando la tengas |
| blindaje-portfolio-seo-marca | (pendiente)  | usar imagen propia cuando la tengas |

## Una imagen por post

Cada post debe tener su **propia** imagen en el frontmatter. Si varios posts usan la misma ruta (p. ej. los dos de “blindaje” apuntando a `modularizacion.webp`), en la lista del blog y en la ficha del post se verá la misma imagen para todos.

**Solución:** crea (o reutiliza) un archivo en `public/images/blog/` para cada post y pon su ruta en `image:` en el frontmatter del markdown.

## Uso en la app

- **Listado (`/blog`):** la tarjeta de cada post muestra `post.image` si existe.
- **Post (`/blog/:slug`):** la cabecera y el SEO (og:image, twitter:image) usan `post.meta.image`; si no hay imagen, se usa la OG por defecto del sitio.
