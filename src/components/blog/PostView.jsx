import Link from 'next/link';
import Blocks from '@/components/blog/Blocks';
import { getRelatedPosts } from '@/lib/posts';
import { articleGraph } from '@/lib/seo';
import { CATEGORIES } from '@/lib/config';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function PostView({ post }) {
  const isLive = post.status === 'published';
  const related = isLive ? await getRelatedPosts(post).catch(() => []) : [];
  const graph = JSON.stringify(articleGraph(post)).replace(/</g, '\\u003c');
  const toc = Array.isArray(post.toc) ? post.toc.filter((item) => item?.id && item?.text) : [];
  const categoryLabel = CATEGORIES[post.category]?.label || post.category;
  const updated = formatDate(post.updatedAt);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph }} />

      {!isLive && (
        <div
          role="status"
          className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 shadow-sm dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <span>Draft preview. This page is not public yet.</span>
          <a href="/api/admin/preview?exit=1" className="font-semibold underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-100">
            Exit preview
          </a>
        </div>
      )}

      <article className="articleContainer mx-auto w-full max-w-3xl px-1 pb-16 sm:px-2">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="rounded transition-colors hover:text-blue-600 hover:underline dark:hover:text-blue-400">
            Home
          </Link>
          <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
          <Link href={`/${post.category}`} className="rounded font-medium text-slate-700 transition-colors hover:text-blue-600 hover:underline dark:text-slate-300 dark:hover:text-blue-400">
            {categoryLabel}
          </Link>
        </nav>

        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="mb-6 mt-3 text-sm text-slate-500 dark:text-slate-400">
          {[categoryLabel, post.readingTime ? `${post.readingTime} min read` : '', updated ? `Updated ${updated}` : '']
            .filter(Boolean)
            .join(' | ')}
        </p>

        {toc.length > 2 && (
          <details className="group mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <summary className="flex cursor-pointer list-none items-center justify-between bg-slate-50 px-5 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:bg-slate-800 [&::-webkit-details-marker]:hidden">
              On this page
              <svg
                className="h-4 w-4 text-slate-500 transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <ul className="space-y-1 border-t border-slate-200 px-5 py-3 text-sm dark:border-slate-700">
              {toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                  <a
                    href={`#${item.id}`}
                    className="block rounded-md px-2 py-1 text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        <Blocks blocks={post.content} />

        {related.length > 0 && (
          <section className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-700">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Related experiments</h2>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${post.category}/${item.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}