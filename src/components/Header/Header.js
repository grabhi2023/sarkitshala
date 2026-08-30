"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../togle.jsx";
import Search from '../Search/Search.js';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileIotOpen, setMobileIotOpen] = useState(false);
  const [iotHovered, setIotHovered] = useState(false);
  const pathname = usePathname();

  const primaryLinks = [
    { href: "/", label: "Home" },
    { href: "/ai-tools", label: "AI Tools" },
    { href: "/jetson", label: "Jetson" },
    { href: "/hindicompiler", label: "हिंदी में कोड" },
  ];

  const iotLinks = [
    { href: "/arduino", label: "Arduino" },
    { href: "/esp", label: "ESP32" },
    { href: "/raspberry", label: "Raspberry Pi" },
    { href: "/stm32-microcontroller-setup-guide", label: "STM32" },
  ];

  const NavLink = ({ href, label }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`
          relative px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200
          ${isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground"
          }
        `}
        onClick={() => setMobileOpen(false)}
      >
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8 gap-4">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
            Sarkitshala
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xs">
          <Search />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">

          {/* IOT Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIotHovered(true)}
            onMouseLeave={() => setIotHovered(false)}
          >
            <button className={`
              flex items-center gap-1.5 px-3 py-2 text-sm font-medium tracking-wide rounded-lg transition-colors duration-200
              ${iotHovered ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent"}
            `}>
              IOT
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${iotHovered ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`
              absolute left-0 top-full mt-1.5 w-44 rounded-xl bg-popover border border-border shadow-lg
              transition-all duration-200 origin-top-left
              ${iotHovered ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
            `}>
              <div className="p-1.5 space-y-0.5">
                {iotLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      block px-3 py-2 text-sm rounded-lg transition-colors duration-150
                      ${pathname === link.href
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {primaryLinks.filter((l) => l.href !== "/").map((link) => (
            <NavLink key={link.href} {...link} />
          ))}

          <div className="ml-2 pl-2 border-l border-border">
            <ModeToggle />
          </div>
        </nav>

        {/* Mobile: Right side buttons */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`
        md:hidden border-t border-border bg-background/95 backdrop-blur-xl
        overflow-hidden transition-all duration-300 ease-in-out
        ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
      `}>
        <div className="px-4 pt-3 pb-2">
          <Search />
        </div>

        <nav className="px-4 pb-4 space-y-1">
          {/* IOT section */}
          <div>
            <button
              onClick={() => setMobileIotOpen(!mobileIotOpen)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              IOT
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileIotOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`overflow-hidden transition-all duration-200 ${mobileIotOpen ? "max-h-60" : "max-h-0"}`}>
              <div className="pl-4 pt-1 pb-1 space-y-0.5">
                {iotLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      block px-3 py-2 text-sm rounded-lg transition-colors
                      ${pathname === link.href
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Links */}
          {primaryLinks.filter((l) => l.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`
                block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${pathname === link.href
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}