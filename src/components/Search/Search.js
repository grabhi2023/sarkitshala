"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const debounceTimeout = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced fetch
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (!search.trim()) {
      setResults([]);
      setShowResults(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/experiments/Search?Search=${encodeURIComponent(search)}`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setResults(data);
        setShowResults(true);
      } catch {
        setResults([]);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  const clearSearch = () => {
    setSearch("");
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div className="relative flex items-center">
        {/* Search icon */}
        <svg
          className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search && results.length > 0 && setShowResults(true)}
          placeholder="Search experiments..."
          className="
            w-full h-9 pl-9 pr-8 text-sm rounded-lg
            bg-accent/50 dark:bg-accent/30
            border border-border
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200
          "
        />

        {/* Loading spinner or clear button */}
        {loading ? (
          <span className="absolute right-3">
            <svg className="w-3.5 h-3.5 text-muted-foreground animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </span>
        ) : search ? (
          <button
            onClick={clearSearch}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="
          absolute top-full left-0 right-0 mt-1.5 z-[999]
          bg-popover border border-border rounded-xl shadow-lg
          max-h-60 overflow-y-auto
          animate-in fade-in-0 slide-in-from-top-1 duration-150
        ">
          {results.map((item, idx) => (
            <Link
              key={item.ExperimentId}
              href={item.slug}
              onClick={clearSearch}
              className={`
                flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground
                hover:bg-accent transition-colors duration-100
                ${idx !== results.length - 1 ? "border-b border-border/50" : ""}
              `}
            >
              <svg className="w-3.5 h-3.5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {item.ExperimentName}
            </Link>
          ))}
        </div>
      )}

      {/* No results */}
      {showResults && !loading && results.length === 0 && search.trim() && (
        <div className="
          absolute top-full left-0 right-0 mt-1.5 z-[999]
          bg-popover border border-border rounded-xl shadow-lg
          px-4 py-3 text-sm text-muted-foreground text-center
        ">
          No results found for &quot;{search}&quot;
        </div>
      )}
    </div>
  );
}