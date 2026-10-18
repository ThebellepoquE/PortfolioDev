#!/usr/bin/env node
/**
 * Generates WebP/AVIF variants for portfolio images: OG image and blog images.
 * Usage (manual only — not wired into CI or `next build`):
 *   pnpm run optimize:images
 *
 * Run after adding or replacing a source image under public/images/blog/ or
 * public/og-image-default.jpg. Generated *-600 / *-900 / *.avif files are
 * committed so a fresh clone does not need this script to build or serve.
 *
 * Target A — OG image: public/og-image-default.jpg → .webp (1200×630) and -600.webp (600×315)
 * Target B — Blog images: public/images/blog/*.webp → *-600 and *-900 (webp + avif), plus full .avif
 *
 * Idempotent: if an output path already exists, it is left untouched (no rewrite, no mtime bump).
 * Missing outputs are created so a partial tree converges to the full set.
 */

import { existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const blogImagesDir = join(publicDir, 'images', 'blog');

/** Source masters only — skip width variants like -600.webp / -900.webp. */
function isBlogSourceWebp(filename) {
  return filename.endsWith('.webp') && !/-\d+\.webp$/.test(filename);
}

async function ensureWebpVariant(sharp, sourcePath, outPath, width, label) {
  if (existsSync(outPath)) {
    console.log(`  SKIP ${label} — already exists`);
    return;
  }
  await sharp(sourcePath)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(outPath);
  console.log(`  → ${label} (width ${width})`);
}

async function ensureAvifVariant(sharp, sourcePath, outPath, width, label) {
  if (existsSync(outPath)) {
    console.log(`  SKIP ${label} — already exists`);
    return;
  }
  let pipeline = sharp(sourcePath);
  if (width !== null) {
    pipeline = pipeline.resize(width, null, { withoutEnlargement: true });
  }
  await pipeline.avif({ quality: 50 }).toFile(outPath);
  console.log(`  → ${label}`);
}

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Missing dependency "sharp". Install with: pnpm add -D sharp');
    process.exit(1);
  }

  /* ------------------------------------------------------------------ */
  /*  Target A: OG image                                                 */
  /* ------------------------------------------------------------------ */
  const ogSource = join(publicDir, 'og-image-default.jpg');
  if (!existsSync(ogSource)) {
    console.error('Missing public/og-image-default.jpg. Place the source image in public/.');
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
      console.log(`  SKIP ${name} — already exists`);
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
    console.log('  public/images/blog/ does not exist. Skipped.');
  } else {
    const files = readdirSync(blogImagesDir).filter(isBlogSourceWebp);

    if (files.length === 0) {
      console.log('  No source .webp images found in public/images/blog/.');
    }

    for (const file of files) {
      const baseName = file.replace(/\.webp$/, '');
      const sourcePath = join(blogImagesDir, file);

      await ensureWebpVariant(
        sharp,
        sourcePath,
        join(blogImagesDir, `${baseName}-600.webp`),
        600,
        `${baseName}-600.webp`,
      );
      await ensureWebpVariant(
        sharp,
        sourcePath,
        join(blogImagesDir, `${baseName}-900.webp`),
        900,
        `${baseName}-900.webp`,
      );

      await ensureAvifVariant(
        sharp,
        sourcePath,
        join(blogImagesDir, `${baseName}-600.avif`),
        600,
        `${baseName}-600.avif`,
      );
      await ensureAvifVariant(
        sharp,
        sourcePath,
        join(blogImagesDir, `${baseName}-900.avif`),
        900,
        `${baseName}-900.avif`,
      );
      await ensureAvifVariant(
        sharp,
        sourcePath,
        join(blogImagesDir, `${baseName}.avif`),
        null,
        `${baseName}.avif`,
      );
    }
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
