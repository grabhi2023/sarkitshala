'use client';

import { useEffect, useRef, useState } from 'react';

const COLLAPSE_AFTER_LINES = 40;

const LABELS = {
  cpp: 'C++',
  c: 'C',
  python: 'Python',
  bash: 'Bash',
  javascript: 'JavaScript',
  json: 'JSON',
};

function legacyCopy(text) {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}

export default function CodeBlock({ code, language }) {
  const text = typeof code === 'string' ? code : String(code ?? '');
  const lineCount = text.split('\n').length;
  const collapsible = lineCount > COLLAPSE_AFTER_LINES;
  const [expanded, setExpanded] = useState(!collapsible);
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = legacyCopy(text);
    }
    setStatus(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 1800);
  }

  const label = LABELS[language] || language || 'Code';

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
      <div className="flex items-center justify-between gap-3 border-b border-slate-700 bg-slate-800 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-semibold text-slate-100">
            {label}
            <span className="ml-2 font-normal text-slate-400">{lineCount} lines</span>
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          className={`rounded-md border px-3 py-1 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
            status === 'copied'
              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
              : status === 'failed'
                ? 'border-red-500 bg-red-500/15 text-red-300'
                : 'border-slate-600 text-slate-200 hover:border-slate-400 hover:bg-slate-700'
          }`}
          aria-live="polite"
        >
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
      </div>
      <div className="relative">
        <pre
          tabIndex={0}
          className={`m-0 overflow-x-auto bg-slate-900 p-4 font-mono text-[13px] leading-6 text-slate-100 focus:outline-none sm:text-sm [scrollbar-width:thin] ${
            expanded ? '' : 'max-h-[28rem] overflow-y-hidden'
          }`}
        >
          <code className="font-mono">{text}</code>
        </pre>
        {!expanded ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900 to-transparent" />
        ) : null}
      </div>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="w-full border-t border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `Show all ${lineCount} lines`}
        </button>
      ) : null}
    </div>
  );
}