const SITE_URL = 'https://sarkitshala.com/hindicompiler';
const COMPILER_URL = 'https://hindicoding.netlify.app/';
const TITLE = 'Hindi Programming Language Interpreter - Run Hindi Code Online';
const DESCRIPTION =
  'Execute Hindi programming language code online using our custom Hindi interpreter. Learn coding in Hindi with real-time output – created by Sarkitshala.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Sarkitshala',
    type: 'website',
    images: [{ url: 'https://sarkitshala.com/opengraph-image.jpg', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['https://sarkitshala.com/opengraph-image.jpg'],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-12 pt-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 text-center text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
          Run Hindi Code Online - <span lang="hi">हिंदी प्रोग्रामिंग इंटरप्रेटर</span>
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-center text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          Sarkitshala presents an online platform to write and execute code in the Hindi language. Start coding in your mother tongue!
        </p>

        <div className="mb-3 flex justify-end">
          <a
            href={COMPILER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Open in new tab
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6M10 14L20 4M20 14v6H4V4h6" />
            </svg>
          </a>
        </div>

        <div className="h-[75vh] min-h-[480px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 md:h-[80vh]">
          <iframe
            src={COMPILER_URL}
            title="Hindi programming language interpreter"
            loading="lazy"
            allow="fullscreen; clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}