import crypto from 'crypto';
import mammoth from 'mammoth';
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import { slugify, isValidSlug } from '@/lib/slug';
import { CATEGORIES } from '@/lib/config';
import { optimizeImage } from '@/lib/import/images';
import { uploadBuffer } from '@/lib/cloudinary';

const MAX_TITLE_LENGTH = 200;
const MAX_SLUG_LENGTH = 100;
const MAX_TITLE_FALLBACK_LENGTH = 120;
const MAX_IMAGES = 60;
const MAX_WARNINGS = 50;
const IMAGE_CONCURRENCY = 3;
const IMPORT_DEADLINE_MS = 80000;
const MAX_CONTENT_BYTES = 12 * 1024 * 1024;

const STYLE_MAP = [
  "p[style-name='Title'] => h1:fresh",
  "p[style-name='title'] => h1:fresh",
  "p[style-name='Code'] => pre.code:separator('\\n')",
  "p[style-name='code'] => pre.code:separator('\\n')",
  "p[style-name='Source Code'] => pre.code:separator('\\n')",
  "p[style-name='Callout'] => blockquote.callout:fresh",
  "p[style-name='callout'] => blockquote.callout:fresh",
  "p[style-name='Caption'] => p.caption:fresh",
  "p[style-name='caption'] => p.caption:fresh",
];

const META_KEYS = new Set(['slug', 'description', 'tags', 'metatitle']);

const INLINE_OPTIONS = {
  allowedTags: ['strong', 'b', 'em', 'i', 'u', 's', 'a', 'code', 'br', 'sub', 'sup', 'span'],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: (tagName, attribs) =>
      attribs.href
        ? { tagName: 'a', attribs: { href: attribs.href, rel: 'noopener noreferrer', target: '_blank' } }
        : { tagName: 'span', attribs: {} },
  },
};

const LIST_OPTIONS = {
  ...INLINE_OPTIONS,
  allowedTags: [...INLINE_OPTIONS.allowedTags, 'ul', 'ol', 'li'],
};

const inline = (html) => sanitizeHtml(html || '', INLINE_OPTIONS).trim();
const withLists = (html) => sanitizeHtml(html || '', LIST_OPTIONS).trim();
const textFromHtml = (html) => cheerio.load(`<div>${html || ''}</div>`)('div').text().replace(/\s+/g, ' ').trim();

function normalizeLanguage(value, fallback) {
  const v = String(value || '').toLowerCase().trim();
  if (!v) return fallback;
  if (['c++', 'cpp', 'arduino', 'ino'].includes(v)) return 'cpp';
  if (v === 'c') return 'c';
  if (['py', 'python', 'python3'].includes(v)) return 'python';
  if (['sh', 'bash', 'shell', 'terminal'].includes(v)) return 'bash';
  return v;
}

function cleanCode(text) {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\u2026/g, '...')
    .replace(/\r\n?/g, '\n')
    .replace(/\s+$/, '');
}

async function pool(items, limit, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(runners);
}

export async function importDocx(buffer, { category, difficulty, slug: slugInput }) {
  const startedAt = Date.now();
  const warnings = [];
  const rawImages = [];

  const result = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: STYLE_MAP,
      ignoreEmptyParagraphs: false,
      convertImage: mammoth.images.imgElement(async (image) => {
        const data = await image.read();
        const idx = rawImages.length;
        rawImages.push({ data, alt: image.altText || '' });
        return { src: `__IMG_${idx}__`, alt: image.altText || '' };
      }),
    }
  );

  const mammothNotes = [...new Set(result.messages.filter((m) => m.type === 'warning').map((m) => m.message))];
  mammothNotes.slice(0, 5).forEach((note) => warnings.push(`Word parser: ${note}`));

  const $ = cheerio.load(`<div id="root">${result.value}</div>`);
  const nodes = $('#root').children().toArray();
  const textOf = (el) => $(el).text().replace(/\s+/g, ' ').trim();

  const meta = {};
  let title = '';
  const blocks = [];
  const usedIds = new Set();
  let faqBlock = null;
  let faqItem = null;
  let faqInserted = false;
  let metaTableTaken = false;

  const uniqueId = (text) => {
    const base = slugify(text) || 'section';
    let id = base;
    let n = 2;
    while (usedIds.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    usedIds.add(id);
    return id;
  };

  const flushFaqItem = () => {
    if (faqBlock && faqItem) {
      faqBlock.data.items.push({ q: faqItem.q, a: faqItem.a.join('') });
    }
    faqItem = null;
  };

  const endFaq = () => {
    flushFaqItem();
    faqBlock = null;
    faqInserted = false;
  };

  for (const el of nodes) {
    const tag = el.tagName;

    if (tag === 'table' && !metaTableTaken) {
      const rows = $(el).find('tr').toArray();
      const parsed = {};
      let matches = 0;
      rows.forEach((row) => {
        const cells = $(row).children('td,th').toArray();
        if (cells.length === 2) {
          const key = textOf(cells[0]).toLowerCase().replace(/[^a-z]/g, '');
          if (META_KEYS.has(key)) {
            parsed[key] = textOf(cells[1]);
            matches += 1;
          }
        }
      });
      if (matches > 0) {
        Object.assign(meta, parsed);
        metaTableTaken = true;
        continue;
      }
    }

    if (tag === 'h1') {
      const text = textOf(el);
      if (!text) continue;
      if (!title) {
        title = text;
        continue;
      }
      endFaq();
      blocks.push({ type: 'heading', data: { level: 2, text, id: uniqueId(text) } });
      continue;
    }

    if (tag === 'h2') {
      endFaq();
      const text = textOf(el);
      if (!text) continue;
      blocks.push({ type: 'heading', data: { level: 2, text, id: uniqueId(text) } });
      if (/\bfaq\b|frequently asked/i.test(text)) {
        faqBlock = { type: 'faq', data: { items: [] } };
      }
      continue;
    }

    if (tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
      const text = textOf(el);
      if (!text) continue;
      if (faqBlock && tag === 'h3') {
        flushFaqItem();
        if (!faqInserted) {
          blocks.push(faqBlock);
          faqInserted = true;
        }
        faqItem = { q: inline($(el).html()), a: [] };
        continue;
      }
      blocks.push({ type: 'heading', data: { level: tag === 'h3' ? 3 : 4, text, id: uniqueId(text) } });
      continue;
    }

    if (tag === 'p' && $(el).hasClass('caption')) {
      const caption = textOf(el);
      const prev = blocks[blocks.length - 1];
      if (prev && prev.type === 'image' && caption) {
        prev.data.caption = caption;
        if (!prev.data.alt) prev.data.alt = caption;
      } else if (caption) {
        blocks.push({ type: 'paragraph', data: { html: inline($(el).html()) } });
      }
      continue;
    }

    if (tag === 'p') {
      const imageRefs = $(el)
        .find('img')
        .toArray()
        .map((img) => {
          const match = /^__IMG_(\d+)__$/.exec($(img).attr('src') || '');
          return match ? { ref: Number(match[1]), alt: ($(img).attr('alt') || '').trim() } : null;
        })
        .filter(Boolean);
      $(el).find('img').remove();

      const html = inline($(el).html());
      const hasText = textFromHtml(html).length > 0;

      if (faqBlock && faqItem && hasText) {
        faqItem.a.push(`<p>${html}</p>`);
        continue;
      }

      if (hasText) blocks.push({ type: 'paragraph', data: { html } });
      imageRefs.forEach((img) => {
        blocks.push({ type: 'image', data: { ref: img.ref, alt: img.alt, caption: '' } });
      });
      continue;
    }

    if (tag === 'pre') {
      $(el).find('br').replaceWith('\n');
      const original = $(el).text();
      let code = cleanCode(original);
      if (/[\u201c\u201d\u2018\u2019]/.test(original)) {
        warnings.push('Smart quotes found in a code block were converted to plain quotes');
      }
      let language = CATEGORIES[category]?.language || 'cpp';
      const lines = code.split('\n');
      const directive = /^\s*(?:\/\/|#)?\s*lang(?:uage)?\s*[:=]\s*([a-z+#0-9]+)\s*$/i.exec(lines[0] || '');
      if (directive) {
        language = normalizeLanguage(directive[1], language);
        code = lines.slice(1).join('\n').replace(/^\n+/, '');
      }
      if (code.trim()) blocks.push({ type: 'code', data: { code, language } });
      continue;
    }

    if (tag === 'ul' || tag === 'ol') {
      const items = $(el)
        .children('li')
        .toArray()
        .map((li) => withLists($(li).html()))
        .filter(Boolean);
      if (items.length === 0) continue;
      if (faqBlock && faqItem) {
        faqItem.a.push(`<${tag}>${items.map((i) => `<li>${i}</li>`).join('')}</${tag}>`);
        continue;
      }
      blocks.push({ type: 'list', data: { ordered: tag === 'ol', items } });
      continue;
    }

    if (tag === 'table') {
      const rows = $(el)
        .find('tr')
        .toArray()
        .map((row) =>
          $(row)
            .children('td,th')
            .toArray()
            .map((cell) => inline(($(cell).html() || '').replace(/<\/p>\s*<p>/g, '<br>')))
        )
        .filter((r) => r.length > 0);
      if (rows.length === 0) continue;
      blocks.push({ type: 'table', data: { headers: rows[0], rows: rows.slice(1) } });
      continue;
    }

    if (tag === 'blockquote') {
      const html = inline($(el).html());
      if (textFromHtml(html)) blocks.push({ type: 'callout', data: { html } });
      continue;
    }
  }

  endFaq();

  if (!title) {
    const firstHeadingIndex = blocks.findIndex((b) => b.type === 'heading');
    const limit = firstHeadingIndex === -1 ? blocks.length : firstHeadingIndex;
    const candidateIndex = blocks.findIndex((b, i) => i < limit && b.type === 'paragraph');
    if (candidateIndex !== -1) {
      const candidate = textFromHtml(blocks[candidateIndex].data.html);
      if (candidate && candidate.length <= MAX_TITLE_FALLBACK_LENGTH) {
        title = candidate;
        blocks.splice(candidateIndex, 1);
        warnings.push('No Heading 1 found. The first short line was used as the title. Apply the Heading 1 style to your title in Word');
      }
    }
  }

  if (!title && blocks[0]?.type === 'heading') {
    const first = blocks.shift();
    usedIds.delete(first.data.id);
    title = first.data.text;
    warnings.push('No Heading 1 found. The first heading was used as the title. Apply the Heading 1 style to your title in Word');
  }

  if (!title) {
    const preview = nodes
      .slice(0, 3)
      .map((n) => `<${n.tagName}> "${textOf(n).slice(0, 40)}"`)
      .join(', ');
    throw new Error(
      `No title found. Apply the Heading 1 or Title style to the first line. The document starts with: ${preview || 'nothing'}`
    );
  }

  if (title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Title is longer than ${MAX_TITLE_LENGTH} characters. Shorten it`);
  }

  const slugSource = slugInput || meta.slug || title;
  const slug = (slugify(slugSource) || '').slice(0, MAX_SLUG_LENGTH).replace(/-+$/, '');
  if (!slug || !isValidSlug(slug)) {
    throw new Error(`Invalid slug: "${slugSource}". Use lowercase letters, numbers and hyphens, or enter a slug manually`);
  }

  const usedRefs = [...new Set(blocks.filter((b) => b.type === 'image').map((b) => b.data.ref))];
  if (usedRefs.length > MAX_IMAGES) {
    throw new Error(`A post can have at most ${MAX_IMAGES} images (found ${usedRefs.length})`);
  }

  const contentBytes = Buffer.byteLength(JSON.stringify(blocks));
  if (contentBytes > MAX_CONTENT_BYTES) {
    throw new Error(
      `The text content is ${(contentBytes / 1048576).toFixed(1)} MB, which is too large to store in one post. Split the document into two posts`
    );
  }

  const unusedCount = rawImages.length - usedRefs.length;
  if (unusedCount > 0) {
    warnings.push(`${unusedCount} image(s) inside a list, table or FAQ answer were skipped. Put each image in its own paragraph`);
  }

  const uploaded = new Map();
  const pending = new Map();
  const publicIds = new Set();
  const stats = { found: rawImages.length, used: usedRefs.length, uploaded: 0, reused: 0, failed: 0, skipped: 0 };

  await pool(usedRefs, IMAGE_CONCURRENCY, async (idx) => {
    if (Date.now() - startedAt > IMPORT_DEADLINE_MS) {
      stats.skipped += 1;
      return;
    }
    try {
      const optimized = await optimizeImage(rawImages[idx].data);
      const hash = crypto.createHash('sha1').update(optimized.data).digest('hex').slice(0, 16);

      let upload = pending.get(hash);
      const isNew = !upload;
      if (isNew) {
        upload = uploadBuffer(optimized.data, `sarkitshala/${category}/${slug}/${hash}`).then((res) => ({
          publicId: res.public_id,
          url: res.secure_url,
          width: optimized.info.width,
          height: optimized.info.height,
          bytes: optimized.data.length,
          blurDataURL: optimized.blur,
        }));
        pending.set(hash, upload);
      }

      const info = await upload;
      uploaded.set(idx, info);
      publicIds.add(info.publicId);

      if (isNew) {
        stats.uploaded += 1;
        if (optimized.oversize) {
          warnings.push(`Image ${idx + 1} is still larger than 500 KB (${Math.round(optimized.data.length / 1024)} KB)`);
        }
      } else {
        stats.reused += 1;
      }
    } catch (error) {
      stats.failed += 1;
      warnings.push(`Image ${idx + 1} could not be processed or uploaded (${error.message}). Use PNG, JPG or WEBP`);
    }
  });

  if (stats.skipped > 0) {
    warnings.push(
      `${stats.skipped} image(s) were skipped because the import ran out of time. Split the document into two posts, or import it again`
    );
  }

  if (usedRefs.length > 0) {
    const parts = [`${stats.uploaded} uploaded to Cloudinary`];
    if (stats.reused > 0) parts.push(`${stats.reused} duplicate(s) reused`);
    if (stats.failed > 0) parts.push(`${stats.failed} failed`);
    if (stats.skipped > 0) parts.push(`${stats.skipped} skipped (time limit)`);
    warnings.push(`Info: ${usedRefs.length} image(s) used, ${parts.join(', ')}`);
  }

  let figure = 0;
  const finalBlocks = [];
  for (const block of blocks) {
    if (block.type !== 'image') {
      finalBlocks.push(block);
      continue;
    }
    const info = uploaded.get(block.data.ref);
    if (!info) continue;
    figure += 1;
    let alt = block.data.alt || '';
    if (!alt) {
      warnings.push(`Figure ${figure}: alt text is missing (add Alt Text to the image in Word, or a Caption below it)`);
      alt = `${title} - figure ${figure}`;
    }
    finalBlocks.push({
      type: 'image',
      data: {
        url: info.url,
        width: info.width,
        height: info.height,
        bytes: info.bytes,
        blurDataURL: info.blurDataURL,
        alt,
        caption: block.data.caption || '',
      },
    });
  }

  const headings = finalBlocks.filter((b) => b.type === 'heading');
  const toc = headings
    .filter((h) => h.data.level <= 3)
    .map((h) => ({ id: h.data.id, text: h.data.text, level: h.data.level }));

  const words = finalBlocks
    .map((b) => {
      if (b.type === 'paragraph' || b.type === 'callout') return textFromHtml(b.data.html);
      if (b.type === 'heading') return b.data.text;
      if (b.type === 'list') return b.data.items.map(textFromHtml).join(' ');
      if (b.type === 'faq') return b.data.items.map((i) => `${textFromHtml(i.q)} ${textFromHtml(i.a)}`).join(' ');
      return '';
    })
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  let description = (meta.description || '').trim();
  if (!description) {
    const firstParagraph = finalBlocks.find((b) => b.type === 'paragraph');
    description = firstParagraph ? textFromHtml(firstParagraph.data.html).slice(0, 155) : '';
    warnings.push('No meta description in the document table. It was generated from the first paragraph');
  }
  if (description.length > 160) {
    description = `${description.slice(0, 157).trim()}...`;
    warnings.push('Meta description was longer than 160 characters and was shortened');
  }

  const metaTitle = (meta.metatitle || '').trim();
  if ((metaTitle || title).length > 65) warnings.push('Title is longer than 65 characters and may be cut off in Google results');
  if (words < 300) warnings.push(`Content is short (${words} words). 300+ words works better for SEO`);
  if (!finalBlocks.some((b) => b.type === 'code')) warnings.push('No code block found in this post');
  if (!finalBlocks.some((b) => b.type === 'image')) warnings.push('No images in this post');
  if (headings.filter((h) => h.data.level === 2).length < 2) warnings.push('Use at least two Heading 2 sections');

  const tags = (meta.tags || '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);

  const firstImage = finalBlocks.find((b) => b.type === 'image');
  const coverImage = firstImage
    ? {
        url: firstImage.data.url,
        alt: firstImage.data.alt,
        width: firstImage.data.width,
        height: firstImage.data.height,
        blurDataURL: firstImage.data.blurDataURL,
      }
    : undefined;

  return {
    slug,
    title,
    category,
    difficulty,
    tags,
    excerpt: description,
    metaTitle,
    metaDescription: description,
    coverImage,
    content: finalBlocks,
    toc,
    readingTime,
    warnings: [...new Set(warnings)].slice(0, MAX_WARNINGS),
    imageStats: stats,
    imagePublicIds: [...publicIds],
  };
}