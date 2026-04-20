/**
 * One-off / CI: writes WebP next to the PNG for smaller transfer (PSI “image delivery”).
 * Run: node scripts/optimize-logo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pngPath = join(root, 'src', 'assets', 'Logo_transparent_250px.png');
const webpPath = join(root, 'src', 'assets', 'Logo_transparent_250px.webp');

const buf = readFileSync(pngPath);
const webp = await sharp(buf).webp({ quality: 86, effort: 6, alphaQuality: 100 }).toBuffer();
writeFileSync(webpPath, webp);
console.log(`optimize-logo: wrote ${webpPath} (${webp.length} bytes, was png ${buf.length})`);
