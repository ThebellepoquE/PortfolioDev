#!/usr/bin/env node
/**
 * Genera los 4 tamaños de foto de perfil para el portfolio a partir de una imagen fuente.
 * Uso: pnpm run resize-profile
 * Requiere: tu imagen en public/profile-original.webp (o .png / .jpg)
 *
 * Salida en public/: profile-260.webp, profile-360.webp, profile-520.webp, profile.webp
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

const SOURCE = join(publicDir, 'profile-original.webp');
const SOURCE_ALT = [
  join(publicDir, 'profile-original.png'),
  join(publicDir, 'profile-original.jpg'),
];

const SIZES = [
  { name: 'profile-260.webp', size: 260 },
  { name: 'profile-360.webp', size: 360 },
  { name: 'profile-520.webp', size: 520 },
  { name: 'profile.webp', size: 800 },
];

function findSource() {
  if (existsSync(SOURCE)) return SOURCE;
  for (const p of SOURCE_ALT) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Falta la dependencia "sharp". Instálala con: pnpm add -D sharp');
    process.exit(1);
  }

  const sourcePath = findSource();
  if (!sourcePath) {
    console.error(
      'No se encontró imagen fuente. Coloca tu foto en uno de estos paths:\n  public/profile-original.webp\n  public/profile-original.png\n  public/profile-original.jpg'
    );
    process.exit(1);
  }

  const buffer = readFileSync(sourcePath);
  console.log('Imagen fuente:', sourcePath);

  for (const { name, size } of SIZES) {
    const outPath = join(publicDir, name);
    await sharp(buffer)
      .resize(size, size, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(outPath);
    console.log('  →', name, `(${size}×${size})`);
  }

  console.log('Listo. Los 4 archivos están en public/.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
