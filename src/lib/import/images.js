import sharp from 'sharp';
import { MAX_IMAGE_BYTES, MAX_IMAGE_WIDTH } from '@/lib/config';

const MAX_QUALITY = 92;
const MIN_QUALITY = 45;
const MAX_ROUNDS = 6;
const SHRINK_FACTOR = 0.85;
const MIN_WIDTH = 320;
const MAX_INPUT_PIXELS = 100_000_000;
const BLUR_WIDTH = 16;

const open = (input) => sharp(input, { failOn: 'none', limitInputPixels: MAX_INPUT_PIXELS });

async function encode(input, width, quality) {
  return open(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });
}

async function makeBlur(data) {
  const tiny = await sharp(data).resize({ width: BLUR_WIDTH }).webp({ quality: 30 }).toBuffer();
  return `data:image/webp;base64,${tiny.toString('base64')}`;
}

async function finish(result, oversize) {
  return { data: result.data, info: result.info, blur: await makeBlur(result.data), oversize };
}

export async function optimizeImage(input) {
  const meta = await open(input).metadata();
  let width = Math.min(MAX_IMAGE_WIDTH, meta.width || MAX_IMAGE_WIDTH);

  for (let round = 0; round < MAX_ROUNDS; round += 1) {
    const top = await encode(input, width, MAX_QUALITY);
    if (top.data.length <= MAX_IMAGE_BYTES) return finish(top, false);

    let low = MIN_QUALITY;
    let high = MAX_QUALITY - 1;
    let best = null;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const attempt = await encode(input, width, mid);
      if (attempt.data.length <= MAX_IMAGE_BYTES) {
        best = attempt;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    if (best) return finish(best, false);

    width = Math.max(Math.round(width * SHRINK_FACTOR), MIN_WIDTH);
    if (width === MIN_WIDTH) break;
  }

  const last = await encode(input, MIN_WIDTH, MIN_QUALITY);
  return finish(last, last.data.length > MAX_IMAGE_BYTES);
}