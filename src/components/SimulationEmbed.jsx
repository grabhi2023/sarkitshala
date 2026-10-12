
'use client';

const SIMULATION_URL = 'https://www.sarkitlab.com/';

export default function SimulationEmbed() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            SarkitLab Simulator
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Design circuits, write Arduino code, and simulate electronics online.
          </p>
        </div>

        <a
          href={SIMULATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Open in new tab

          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 4h6v6M10 14L20 4M20 14v6H4V4h6"
            />
          </svg>
        </a>
      </div>

      <div className="h-[75vh] min-h-[480px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 md:h-[80vh]">
        <iframe
          src={SIMULATION_URL}
          title="SarkitLab online circuit simulator"
          loading="lazy"
          allow="fullscreen; clipboard-write"
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0 bg-white"
        />
      </div>
    </section>
  );
}
