'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SidebarShell({ title, groups, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => {
    const active = groups.find((g) => g.links.some((l) => l.href === pathname));
    return { [(active || groups[0])?.key]: true };
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      className="mx-auto min-h-screen max-w-[1400px] px-3 pt-20 transition-all sm:px-5 lg:grid lg:gap-8"
      style={{ gridTemplateColumns: '280px 1fr' }}
    >
      <button
        onClick={() => setSidebarOpen((p) => !p)}
        aria-label="Toggle sidebar"
        className="fixed left-3 top-[72px] z-50 flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 lg:hidden"
      >
        {isSidebarOpen ? (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Experiments
          </>
        )}
      </button>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`
          fixed left-0 top-[64px] z-40 h-[calc(100vh-64px)] w-[300px] max-w-[85vw]
          overflow-y-auto border-r border-slate-200 bg-white p-4
          transition-transform duration-300 ease-in-out
          dark:border-slate-700 dark:bg-slate-900
          [scrollbar-width:thin]
          lg:sticky lg:top-20 lg:h-[calc(100vh-100px)] lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-2xl lg:border lg:shadow-sm
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        <p className="mb-4 px-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{title}</p>

        <nav className="space-y-3">
          {groups.map((group) => (
            <div key={group.key} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => toggle(group.key)}
                aria-expanded={!!open[group.key]}
                className="flex w-full items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
              >
                <span>{group.label}</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${open[group.key] ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`overflow-hidden bg-slate-50 transition-all duration-300 dark:bg-slate-800/40 ${open[group.key] ? 'max-h-[3000px]' : 'max-h-0'}`}>
                <ul className="space-y-0.5 p-2">
                  {group.links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setSidebarOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={`block rounded-lg border-l-2 px-3 py-2 text-[13px] leading-snug transition-colors duration-150 ${
                            active
                              ? 'border-blue-600 bg-blue-100 font-semibold text-blue-700 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'border-transparent text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                          }`}
                        >
                          {link.text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 py-4 lg:py-6">{children}</main>
    </div>
  );
}