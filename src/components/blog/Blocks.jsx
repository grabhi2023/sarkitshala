import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import CodeBlock from '@/components/blog/CodeBlock';

const HTML_OPTIONS = {
  allowedTags: ['strong', 'b', 'em', 'i', 'u', 's', 'a', 'code', 'br', 'sub', 'sup', 'span', 'p', 'ul', 'ol', 'li'],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: (tagName, attribs) =>
      attribs.href
        ? { tagName: 'a', attribs: { href: attribs.href, rel: 'noopener noreferrer', target: '_blank' } }
        : { tagName: 'span', attribs: {} },
  },
};

const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 675;

const HEADING_CLASSES = {
  2: 'scroll-mt-24 mb-4 mt-12 border-b border-slate-200 pb-2 text-2xl font-bold tracking-tight text-slate-900 dark:border-slate-700 dark:text-slate-50 sm:text-3xl',
  3: 'scroll-mt-24 mb-3 mt-8 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl',
  4: 'scroll-mt-24 mb-2 mt-6 text-lg font-semibold text-slate-900 dark:text-slate-50',
};

const PROSE_TEXT = 'text-base leading-7 text-slate-700 dark:text-slate-300 [&_a]:font-medium [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-700 dark:[&_a]:text-blue-400 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_code]:text-pink-600 dark:[&_code]:bg-slate-800 dark:[&_code]:text-pink-300';

const clean = (value) => sanitizeHtml(String(value ?? ''), HTML_OPTIONS).trim();
const list = (value) => (Array.isArray(value) ? value : []);
const positive = (value, fallback) => (Number.isFinite(value) && value > 0 ? value : fallback);
const safeId = (value) => (typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value) ? value : undefined);
const isSecureUrl = (value) => typeof value === 'string' && /^https:\/\//i.test(value);

function renderBlock(block, index, isFirstImage) {
  const d = block?.data && typeof block.data === 'object' ? block.data : {};

  switch (block?.type) {
    case 'heading': {
      const text = String(d.text ?? '').trim();
      if (!text) return null;
      const level = Math.min(Math.max(Number(d.level) || 2, 2), 4);
      const Tag = `h${level}`;
      return (
        <Tag key={index} id={safeId(d.id)} className={HEADING_CLASSES[level]}>
          {text}
        </Tag>
      );
    }

    case 'paragraph': {
      const html = clean(d.html);
      if (!html) return null;
      return <p key={index} className={`my-4 ${PROSE_TEXT}`} dangerouslySetInnerHTML={{ __html: html }} />;
    }

    case 'image': {
      if (!isSecureUrl(d.url)) return null;
      const alt = typeof d.alt === 'string' ? d.alt : '';
      const caption = typeof d.caption === 'string' ? d.caption.trim() : '';
      const hasBlur = typeof d.blurDataURL === 'string' && d.blurDataURL.startsWith('data:image/');
      return (
        <figure key={index} className="my-8">
          <Image
            src={d.url}
            alt={alt}
            width={positive(d.width, FALLBACK_WIDTH)}
            height={positive(d.height, FALLBACK_HEIGHT)}
            sizes="(max-width: 768px) 100vw, 700px"
            placeholder={hasBlur ? 'blur' : 'empty'}
            blurDataURL={hasBlur ? d.blurDataURL : undefined}
            priority={isFirstImage}
            className="mx-auto h-auto max-w-full rounded-xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900"
          />
          {caption ? (
            <figcaption className="mt-3 px-2 text-center text-sm italic text-slate-500 dark:text-slate-400">{caption}</figcaption>
          ) : null}
        </figure>
      );
    }

    case 'code': {
      const code = typeof d.code === 'string' ? d.code : '';
      if (!code.trim()) return null;
      return <CodeBlock key={index} code={code} language={typeof d.language === 'string' ? d.language : undefined} />;
    }

    case 'list': {
      const items = list(d.items).map(clean).filter(Boolean);
      if (items.length === 0) return null;
      const Tag = d.ordered ? 'ol' : 'ul';
      return (
        <Tag
          key={index}
          className={`my-5 space-y-2 pl-6 marker:font-semibold marker:text-blue-600 dark:marker:text-blue-400 ${
            d.ordered ? 'list-decimal' : 'list-disc'
          }`}
        >
          {items.map((item, j) => (
            <li key={j} className={`pl-1 ${PROSE_TEXT}`} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </Tag>
      );
    }

    case 'table': {
      const headers = list(d.headers);
      const rows = list(d.rows).map(list);
      const columns = rows.reduce((max, row) => Math.max(max, row.length), headers.length);
      if (columns === 0) return null;
      const pad = (cells) => Array.from({ length: columns }, (_, c) => clean(cells[c]));
      return (
        <div
          key={index}
          className="my-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
          role="region"
          tabIndex={0}
          aria-label="Table"
        >
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            {headers.length > 0 ? (
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  {pad(headers).map((cell, c) => (
                    <th
                      key={c}
                      scope="col"
                      className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {rows.map((row, r) => (
                <tr key={r} className="transition-colors even:bg-slate-50 hover:bg-blue-50/60 dark:even:bg-slate-800/40 dark:hover:bg-slate-800">
                  {pad(row).map((cell, c) => (
                    <td
                      key={c}
                      className="px-4 py-3 align-top text-slate-700 dark:text-slate-300"
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'callout': {
      const html = clean(d.html);
      if (!html) return null;
      return (
        <div
          key={index}
          className={`my-8 rounded-xl border border-blue-200 border-l-4 border-l-blue-600 bg-blue-50 px-5 py-4 text-sm shadow-sm dark:border-blue-900 dark:border-l-blue-500 dark:bg-blue-950/40 [&_p]:my-1 ${PROSE_TEXT}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    case 'faq': {
      const items = list(d.items).filter((item) => item && typeof item === 'object' && clean(item.q));
      if (items.length === 0) return null;
      return (
        <div key={index} className="my-6 space-y-3">
          {items.map((item, j) => (
            <details
              key={j}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow open:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:bg-slate-800 [&::-webkit-details-marker]:hidden">
                <span dangerouslySetInnerHTML={{ __html: clean(item.q) }} />
                <svg
                  className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div
                className={`border-t border-slate-200 px-5 py-4 text-sm dark:border-slate-700 ${PROSE_TEXT}`}
                dangerouslySetInnerHTML={{ __html: clean(item.a) }}
              />
            </details>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

export default function Blocks({ blocks = [] }) {
  const items = list(blocks);
  const firstImage = items.findIndex((b) => b?.type === 'image' && isSecureUrl(b?.data?.url));

  return <>{items.map((block, index) => renderBlock(block, index, index === firstImage))}</>;
}