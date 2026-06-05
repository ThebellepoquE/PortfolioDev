#!/usr/bin/env node
/**
 * Genera variantes WebP de imágenes del portfolio: OG image y blog images.
 * Uso: pnpm run optimize:images
 *
 * Target A — OG image: public/og-image-default.jpg → .webp (1200×630) y -600.webp (600×315)
 * Target B — Blog images: public/images/blog/*.webp → *-600.webp (width 600)
 *
 * Idempotente: salta si el output ya existe.
 */

import { existsSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const blogImagesDir = join(publicDir, 'images', 'blog');

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Falta la dependencia "sharp". Instálala con: pnpm add -D sharp');
    process.exit(1);
  }

  /* ------------------------------------------------------------------ */
  /*  Target A: OG image                                                 */
  /* ------------------------------------------------------------------ */
  const ogSource = join(publicDir, 'og-image-default.jpg');
  if (!existsSync(ogSource)) {
    console.error('No se encontró public/og-image-default.jpg. Coloca la imagen fuente en public/.');
    process.exit(1);
  }

  const ogOutputs = [
    { name: 'og-image-default.webp', width: 1200, height: 630 },
    { name: 'og-image-default-600.webp', width: 600, height: 315 },
  ];

  console.log('=== Target A: OG image ===');
  for (const { name, width, height } of ogOutputs) {
    const outPath = join(publicDir, name);
    if (existsSync(outPath)) {
      console.log(`  SKIP ${name} — ya existe`);
      continue;
    }
    await sharp(ogSource)
      .resize(width, height, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(outPath);
    console.log(`  → ${name} (${width}×${height})`);
  }

  /* ------------------------------------------------------------------ */
  /*  Target B: Blog images                                              */
  /* ------------------------------------------------------------------ */
  console.log('\n=== Target B: Blog images ===');
  if (!existsSync(blogImagesDir)) {
    console.log('  No existe public/images/blog/. Omitido.');
  } else {
    const files = readdirSync(blogImagesDir).filter(
      (f) => f.endsWith('.webp') && !f.endsWith('-600.webp'),
    );

    if (files.length === 0) {
      console.log('  No se encontraron imágenes .webp en public/images/blog/.');
    }

    for (const file of files) {
      const baseName = file.replace(/\.webp$/, '');
      const outName = `${baseName}-600.webp`;
      const outPath = join(blogImagesDir, outName);

      if (!existsSync(outPath)) {
        await sharp(join(blogImagesDir, file))
          .resize(600, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(outPath);
        console.log(`  → ${outName} (width 600)`);
      } else {
        console.log(`  SKIP ${outName} — ya existe`);
      }

      const avifResized = join(blogImagesDir, `${baseName}-600.avif`);
      if (!existsSync(avifResized)) {
        await sharp(join(blogImagesDir, file))
          .resize(600, null, { withoutEnlargement: true })
          .avif({ quality: 50 })
          .toFile(avifResized);
        console.log(`  → ${basename(avifResized)}`);
      } else {
        console.log(`  SKIP ${basename(avifResized)} — ya existe`);
      }

      const avifFull = join(blogImagesDir, `${baseName}.avif`);
      if (!existsSync(avifFull)) {
        await sharp(join(blogImagesDir, file))
          .avif({ quality: 50 })
          .toFile(avifFull);
        console.log(`  → ${basename(avifFull)}`);
      } else {
        console.log(`  SKIP ${basename(avifFull)} — ya existe`);
      }
    }
  }

  console.log('\n✅ Listo.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
