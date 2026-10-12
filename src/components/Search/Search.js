"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MIN_LENGTH = 2;
const DEBOUNCE_MS = 300;

function hrefOf(item) {
  const slug = String(item?.slug ?? "").trim();
  if (!slug) return null;
  if (slug.startsWith("/")) return slug;
  if (slug.includes("/")) return `/${slug}`;
  const category = String(item?.category ?? "arduino").replace(/^\/+|\/+$/g, "");
  return `/${category}/${slug}`;
}

export default function Search({ onSelect, className = "" }) {
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const term = query.trim();
  const showPanel = open && term.length >= MIN_LENGTH;

  useEffect(() => {
    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (term.length < MIN_LENGTH) {
      setResults([]);
      setStatus("idle");
      setActive(-1);
      return undefined;
    }

    setStatus("loading");
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/experiments/Search?Search=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        const items = (Array.isArray(data) ? data : [])
          .map((item) => ({
            href: hrefOf(item),
            label: item?.ExperimentName || item?.title || item?.slug,
          }))
          .filter((item) => item.href && item.label);
        setResults(items);
        setStatus("done");
        setActive(-1);
      } catch (error) {
        if (error.name === "AbortError") return;
        setResults([]);
        setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  function reset() {
    setQuery("");
    setResults([]);
    setStatus("idle");
    setOpen(false);
    setActive(-1);
  }

  function choose(item) {
    reset();
    if (onSelect) onSelect();
    router.push(item.href);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      if (active >= 0 && results[active]) {
        event.preventDefault();
        choose(results[active]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <svg
          className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Search experiments"
          aria-expanded={showPanel && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search experiments..."
          className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-9 text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800 sm:text-sm"
        />

        {status === "loading" ? (
          <span className="absolute right-3" aria-hidden="true">
            <svg className="h-4 w-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </span>
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              reset();
              inputRef.current?.focus();
            }}
            className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>

      {showPanel ? (
        <div className="absolute left-0 right-0 top-full z-[999] mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {results.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Search results" className="py-1">
              {results.map((item, index) => (
                <li key={item.href} id={`${listId}-${index}`} role="option" aria-selected={index === active}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      reset();
                      if (onSelect) onSelect();
                    }}
                    onMouseEnter={() => setActive(index)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      index === active
                        ? "bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-300"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="line-clamp-2">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : status === "loading" ? (
            <p className="px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400">Searching...</p>
          ) : status === "error" ? (
            <p className="px-4 py-3 text-center text-sm text-red-600 dark:text-red-400">Search is not working right now. Try again.</p>
          ) : (
            <p className="px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400">
              No results for &quot;{term}&quot;
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}