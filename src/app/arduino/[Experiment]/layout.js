'use client';

import Link from "next/link";
import { useState } from "react";

const experiments = [
  {
    label: "Basic Experiments",
    key: "basic",
    links: [
      { href: `/arduino/interfacing-led`, text: "Interfacing LED" },
      { href: `/arduino/interfacing-rgb-led`, text: "Interfacing RGB LED" },
      { href: `/arduino/interfacing-seven-segment-display`, text: "Interfacing 7-Segment Display" },
      { href: `/arduino/interfacing-ir-sensor`, text: "Interfacing IR Sensor" },
      { href: `/arduino/interfacing-ldr`, text: "Interfacing LDR Sensor" },
      { href: `/arduino/interfacing-dtmf-module`, text: "Interfacing DTMF Module" },
      { href: `/arduino/interfacing-keypad`, text: "Interfacing Keypad" },
      { href: `/arduino/interfacing-oled-display-module`, text: "Interfacing OLED Display" },
      { href: `/arduino/interfacing-pir-sensor`, text: "Interfacing PIR Sensor" },
      { href: `/arduino/interfacing-soil-moisture`, text: "Interfacing Soil Moisture" },
      { href: `/arduino/interfacing-dc-motor`, text: "Interfacing DC Motor" },
      { href: `/arduino/interfacing-servo-motor`, text: "Interfacing Servo Motor" },
      { href: `/arduino/interfacing-gear-motor`, text: "Interfacing Gear Motor" },
      { href: `/arduino/interfacing-traffic-light-system`, text: "Traffic Light System" },
      { href: `/arduino/interfacing-lcd`, text: "Interfacing LCD" },
      { href: `/arduino/interfacing-ultrasonic-sensor-with-led`, text: "Ultrasonic & LED" },
      { href: `/arduino/interfacing-oled-with-push-button`, text: "Push Button & OLED" },
      { href: `/arduino/interfacing-dht22`, text: "Interfacing DHT22" },
      { href: `/arduino/interfacing-led-with-push-button`, text: "LED & Push Button" },
      { href: `/arduino/interfacing-joystick-module`, text: "Joystick Module" },
      { href: `/arduino/interfacing-laser-sensor`, text: "Laser Sensor" },
      { href: `/arduino/interfacing-obstacle-avoidance-sensor`, text: "Obstacle Avoidance Sensor" },
      { href: `/arduino/interfacing-finger-detecting-heartbeat`, text: "Finger Detecting Heartbeat" },
      { href: `/arduino/interfacing-sound-sensor`, text: "Sound Sensor Module" },
      { href: `/arduino/interfacing-metal-touch-sensor`, text: "Metal Touch Sensor" },
      { href: `/arduino/interfacing-line-sensor-module`, text: "Line Sensor Module" },
      { href: `/arduino/interfacing-linear-magnetic-hall-sensor`, text: "Linear Magnetic Hall Sensor" },
    ],
  },
  {
    label: "Intermediate Experiments",
    key: "intermediate",
    links: [
      { href: `/arduino/interfacing-thermostat-switch`, text: "Digital Thermostat Switch" },
      { href: `/arduino/interfacing-humidity-controller`, text: "Humidity Controller Module" },
      { href: `/arduino/interfacing-stainless-steel-probe-temperature-sensor`, text: "Stainless Steel Temp Sensor" },
      { href: `/arduino/interfacing-thermocouple-sensor`, text: "Thermocouple Sensor Module" },
      { href: `/arduino/interfacing-ir-temperature-sensor`, text: "Non-contact IR Temp Sensor" },
      { href: `/arduino/interfacing-analog-temperature-sensor`, text: "Analog Temperature Sensor" },
      { href: `/arduino/interfacing-voice-recognition-module`, text: "Voice Recognition Module" },
      { href: `/arduino/interfacing-analog-sound-sensor`, text: "Analog Sound Sensor" },
      { href: `/arduino/interfacing-ambient-light-sensor`, text: "Ambient Light Sensor" },
      { href: `/arduino/interfacing-light-intensity-sensor`, text: "Light Intensity Sensor" },
      { href: `/arduino/interfacing-color-recognition-sensor`, text: "Color Recognition Sensor" },
      { href: `/arduino/interfacing-flex-sensor`, text: "Flex Sensor Module" },
      { href: `/arduino/interfacing-rain-sensor`, text: "Rain Sensor Module" },
      { href: `/arduino/interfacing-hall-sensor`, text: "Hall Sensor Module" },
      { href: `/arduino/interfacing-accelerometer-sensor`, text: "Accelerometer Sensor" },
      { href: `/arduino/interfacing-rfid-sensor-module`, text: "RFID Sensor Module" },
      { href: `/arduino/interfacing-nfc-module`, text: "NFC Module" },
      { href: `/arduino/interfacing-mq135-gas-sensor`, text: "MQ135 Gas Sensor" },
      { href: `/arduino/interfacing-mq2-gas-sensor`, text: "MQ2 Gas Sensor" },
      { href: `/arduino/interfacing-mq7-carbon-monoxide-sensor`, text: "MQ7 CO Sensor" },
      { href: `/arduino/interfacing-flame-sensor`, text: "Flame Sensor Module" },
      { href: `/arduino/interfacing-1-channel-relay`, text: "1 Channel Relay" },
      { href: `/arduino/interfacing-2-channel-relay`, text: "2 Channel Relay" },
      { href: `/arduino/interfacing-4-channel-relay`, text: "4 Channel Relay" },
      { href: `/arduino/interfacing-8-channel-relay`, text: "8 Channel Relay" },
    ],
  },
  {
    label: "Advanced Experiments",
    key: "advanced",
    links: [
      { href: `/arduino/interfacing-tilt-switch`, text: "Tilt Switch Module" },
      { href: `/arduino/interfacing-rotary-encoder-switch`, text: "Rotary Encoder Switch" },
      { href: `/arduino/interfacing-16x2-lcd-hd44780`, text: "16x2 LCD HD44780" },
      { href: `/arduino/interfacing-20x4-lcd-arduino`, text: "20x4 LCD Module" },
      { href: `/arduino/interfacing-tft-display-arduino`, text: "TFT Display Module" },
      { href: `/arduino/interfacing-led-matrix-with-arduino`, text: "LED Matrix Module" },
      { href: `/arduino/interfacing-nokia-5110-lcd`, text: "NOKIA 5110 LCD" },
      { href: `/arduino/interfacing-nextion-display`, text: "Nextion Display" },
      { href: `/arduino/interfacing-e-ink-display`, text: "E-ink Display" },
      { href: `/arduino/interfacing-neopixel`, text: "Neopixel" },
      { href: `/arduino/interfacing-dotstar-leds`, text: "Dotstar LEDs" },
      { href: `/arduino/interfacing-pulse-sensor-arduino`, text: "Pulse Sensor" },
      { href: `/arduino/interfacing-fingerprint-sensor-module`, text: "Fingerprint Sensor" },
      { href: `/arduino/interfacing-water-flow-sensor-yf-s201`, text: "Water Flow Sensor" },
      { href: `/arduino/interfacing-led-strip-digital-addressable`, text: "Addressable LED Strip" },
      { href: `/arduino/interfacing-touch-screen-tft`, text: "Touch Screen TFT" },
      { href: `/arduino/interfacing-rgb-led-matrix-panel`, text: "RGB LED Matrix Panel" },
    ],
  },
];

export default function ArduinoLayout({ children }) {
  const [toggles, setToggles] = useState({ basic: true, intermediate: false, advanced: false });
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleToggle = (key) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-[1400px] mx-auto pt-20 min-h-screen px-3 lg:grid lg:gap-6 transition-all"
      style={{ gridTemplateColumns: '260px 1fr' }}
    >
      {/* Mobile toggle button — fixed, only on small screens */}
      <button
        onClick={() => setSidebarOpen((p) => !p)}
        aria-label="Toggle sidebar"
        className="
          lg:hidden fixed top-[72px] left-3 z-50
          flex items-center gap-1.5
          bg-blue-600 hover:bg-blue-700 text-white
          px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md
          transition-colors duration-200
        "
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
            Experiments
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
          Arduino Experiments
        </p>

        <nav className="space-y-3">
          {experiments.map((exp) => (
            <div key={exp.key}>
              {/* Section toggle */}
              <button
                onClick={() => handleToggle(exp.key)}
                aria-expanded={toggles[exp.key]}
                className="
                  flex w-full items-center justify-between
                  px-3 py-2 rounded-lg text-sm font-semibold
                  bg-blue-600 hover:bg-blue-700 text-white
                  transition-colors duration-150
                "
              >
                <span>{exp.label}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${toggles[exp.key] ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Links */}
              <div className={`overflow-hidden transition-all duration-300 ${toggles[exp.key] ? 'max-h-[2000px] mt-1' : 'max-h-0'}`}>
                <ul className="pl-2 border-l-2 border-blue-500/40 ml-2 space-y-0.5 py-1">
                  {exp.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className="
                          block px-3 py-1.5 text-xs rounded-md
                          text-muted-foreground hover:text-foreground
                          hover:bg-accent
                          transition-colors duration-150
                        "
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
      <main className="min-w-0 py-4 lg:py-6">
        {children}
      </main>
    </div>
  );
}