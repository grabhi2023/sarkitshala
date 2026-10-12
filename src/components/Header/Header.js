"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../togle.jsx";
import Search from "../Search/Search.js";

const primaryLinks = [
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/jetson", label: "Jetson" },
  { href: "/hindicompiler", label: "हिंदी में कोड" },
];

const iotLinks = [
  { href: "/arduino", label: "Arduino", desc: "Sensors, motors and displays" },
  { href: "/esp", label: "ESP32", desc: "WiFi and Bluetooth projects" },
  { href: "/raspberry", label: "Raspberry Pi", desc: "Linux, Python and GPIO" },
  { href: "/stm32-microcontroller-setup-guide", label: "STM32", desc: "ARM microcontroller guides" },
];

const isActivePath = (pathname, href) => pathname === href || pathname.startsWith(`${href}/`);

function Chevron({ open }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
        active
          ? "text-blue-600 dark:text-blue-400"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
    >
      {label}
      {active ? <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" /> : null}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [iotOpen, setIotOpen] = useState(false);
  const [mobileIotOpen, setMobileIotOpen] = useState(false);
  const iotRef = useRef(null);

  const isIotActive = iotLinks.some((link) => isActivePath(pathname, link.href));

  useEffect(() => {
    setMenuOpen(false);
    setIotOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!iotOpen) return undefined;
    function onPointerDown(event) {
      if (iotRef.current && !iotRef.current.contains(event.target)) setIotOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setIotOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [iotOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
        <Link href="/" className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-md" aria-label="Sarkitshala home">
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:to-violet-400">
            Sarkitshala
          </span>
        </Link>

        <div className="hidden max-w-sm flex-1 lg:block">
          <Search />
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <div ref={iotRef} className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={iotOpen}
              aria-controls="iot-menu"
              onClick={() => setIotOpen((open) => !open)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                isIotActive || iotOpen
                  ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              IOT
              <Chevron open={iotOpen} />
            </button>

            <div
              id="iot-menu"
              className={`absolute left-0 top-full mt-2 w-72 origin-top-left rounded-xl border border-slate-200 bg-white p-2 shadow-xl transition duration-150 dark:border-slate-700 dark:bg-slate-900 ${
                iotOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
              }`}
            >
              {iotLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    tabIndex={iotOpen ? 0 : -1}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setIotOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                      active ? "bg-blue-50 dark:bg-blue-950/50" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className={`block text-sm font-semibold ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-slate-100"}`}>
                      {link.label}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{link.desc}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {primaryLinks.map((link) => (
            <NavLink key={link.href} {...link} active={isActivePath(pathname, link.href)} />
          ))}

          <div className="ml-2 border-l border-slate-200 pl-3 dark:border-slate-700">
            <ModeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ModeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 lg:hidden"
        >
          <div className="mx-auto max-w-2xl px-4 py-4">
            <Search onSelect={() => setMenuOpen(false)} />

            <nav className="mt-4 space-y-1" aria-label="Mobile navigation">
              <button
                type="button"
                onClick={() => setMobileIotOpen((open) => !open)}
                aria-expanded={mobileIotOpen}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                  isIotActive ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-slate-100"
                } hover:bg-slate-100 dark:hover:bg-slate-800`}
              >
                IOT
                <Chevron open={mobileIotOpen} />
              </button>

              {mobileIotOpen ? (
                <div className="ml-3 space-y-1 border-l-2 border-blue-500/40 pl-3">
                  {iotLinks.map((link) => {
                    const active = isActivePath(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          active
                            ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}

              {primaryLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                        : "text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}