'use client';
import Link from "next/link";
import { useState } from "react";

const experiments = [
  {
    label: "IoT Protocols",
    key: "basic",
    links: [
      { href: "/iotProtocols/amqp", text: "AMQP Communication" },
      { href: "/iotProtocols/bluetooth", text: "Bluetooth Communication" },
      { href: "/iotProtocols/gsm", text: "GSM Communication" },
      { href: "/iotProtocols/coap", text: "CoAP Communication" },
      { href: "/iotProtocols/dds", text: "Data Distribution Service Communication" },
      { href: "/iotProtocols/lorawan", text: "LoRaWAN Communication" },
      { href: "/iotProtocols/lwm2m", text: "LWM2M Communication" },
      { href: "/iotProtocols/mqtt", text: "MQTT Communication" },
      { href: "/iotProtocols/wifi", text: "Wi-Fi Implementation" },
      { href: "/iotProtocols/xmpp", text: "XMPP Communication" },
    ],
  },
];

export default function IotProtocolsLayout({ children }) {
  const [toggles, setToggles] = useState({ basic: true });
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleToggle = (key) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      className="max-w-[1400px] mx-auto pt-20 min-h-screen px-3 lg:grid lg:gap-6 transition-all"
      style={{ gridTemplateColumns: '260px 1fr' }}
    >
      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen((p) => !p)}
        aria-label="Toggle sidebar"
        className="lg:hidden fixed top-[72px] left-3 z-50 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-colors duration-200"
      >
        {isSidebarOpen ? (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Protocols
          </>
        )}
      </button>

      {/* Sidebar overlay on mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[64px] left-0 z-40 h-[calc(100vh-64px)] w-[280px]
          bg-background border-r border-border
          overflow-y-auto p-4
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:translate-x-0 lg:w-auto lg:rounded-xl lg:shadow-none lg:border lg:border-border
          ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
        `}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 px-1">
          IoT Protocols
        </p>

        <nav className="space-y-3">
          {experiments.map((exp) => (
            <div key={exp.key}>
              <button
                onClick={() => handleToggle(exp.key)}
                aria-expanded={toggles[exp.key]}
                className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150"
              >
                <span>{exp.label}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${toggles[exp.key] ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${toggles[exp.key] ? 'max-h-[2000px] mt-1' : 'max-h-0'}`}>
                <ul className="pl-2 border-l-2 border-blue-500/40 ml-2 space-y-0.5 py-1">
                  {exp.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className="block px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="min-w-0 py-4 lg:py-6">{children}</main>
    </div>
  );
}