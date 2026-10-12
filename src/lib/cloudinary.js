import { v2 as cloudinary } from 'cloudinary';

const UPLOAD_TIMEOUT_MS = 60000;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 800;
const LIST_PAGE_SIZE = 500;
const DELETE_BATCH_SIZE = 100;
const ROOT_PREFIX = 'sarkitshala/';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)');
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryable(error) {
  const code = Number(error?.http_code);
  if (!code) return true;
  return code === 429 || code >= 500;
}

function uploadOnce(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: 'image',
        format: 'webp',
        overwrite: true,
        invalidate: true,
        unique_filename: false,
        use_filename: false,
        timeout: UPLOAD_TIMEOUT_MS,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.on('error', reject);
    stream.end(buffer);
  });
}

export async function uploadBuffer(buffer, publicId) {
  ensureConfigured();
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await uploadOnce(buffer, publicId);
    } catch (error) {
      lastError = error;
      if (attempt === MAX_ATTEMPTS || !isRetryable(error)) break;
      await sleep(RETRY_BASE_DELAY_MS * attempt);
    }
  }
  throw new Error(lastError?.message || 'Cloudinary upload failed');
}

export async function pruneFolder(prefix, keepIds = []) {
  if (!prefix.startsWith(ROOT_PREFIX) || !prefix.endsWith('/')) return 0;
  try {
    ensureConfigured();
    const keep = new Set(keepIds);
    const stale = [];
    let cursor;
    do {
      const page = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        prefix,
        max_results: LIST_PAGE_SIZE,
        next_cursor: cursor,
      });
      page.resources.forEach((item) => {
        if (!keep.has(item.public_id)) stale.push(item.public_id);
      });
      cursor = page.next_cursor;
    } while (cursor);

    for (let i = 0; i < stale.length; i += DELETE_BATCH_SIZE) {
      await cloudinary.api.delete_resources(stale.slice(i, i + DELETE_BATCH_SIZE), {
        type: 'upload',
        resource_type: 'image',
        invalidate: true,
      });
    }
    return stale.length;
  } catch (error) {
    console.error(`cloudinary prune failed for ${prefix}:`, error?.message || error);
    return 0;
  }
}

export function deleteFolderAssets(prefix) {
  return pruneFolder(prefix, []);
}