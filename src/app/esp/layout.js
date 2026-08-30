'use client';
import Link from "next/link";
import { useState } from "react";

const experiments = [
  {
    label: "Basic Experiments",
    key: "basic",
    links: [
      { href: "/esp/led-blink-button-control", text: "LED Blink with Button" },
      { href: "/esp/motion-detection-alarm-system", text: "Motion Detection Alarm System" },
      { href: "/esp/simple-rgb-led-controller", text: "Simple RGB LED Controller" },
      { href: "/esp/blinking-led-websocket-control", text: "Blinking LED with WebSocket Control" },
      { href: "/esp/pwm-led-brightness", text: "Control LED Brightness using PWM" },
      { href: "/esp/html-css-web-page", text: "Web Page with HTML and CSS on ESP32" },
      { href: "/esp/multiple-leds-web-control", text: "Control Multiple LEDs" },
      { href: "/esp/bluetooth-serial-communication", text: "ESP32 with Bluetooth Serial Communication" },
      { href: "/esp/eeprom-storage", text: "EEPROM with ESP32" },
      { href: "/esp/push-button", text: "ESP32 Push Button Input: Reading Digital States" },
      { href: "/esp/dht11", text: "Interfacing DHT11 Sensor" },
      { href: "/esp/ultrasonic-sensor", text: "Interfacing Ultrasonic Sensor" },
      { href: "/esp/flame-sensor", text: "Interfacing Flame Sensor" },
      { href: "/esp/sound-sensor", text: "Interfacing Sound Sensor" },
    ],
  },
  {
    label: "Intermediate Experiments",
    key: "intermediate",
    links: [
      { href: "/esp/potentiometer", text: "Interfacing Potentiometer" },
      { href: "/esp/ir-sensor", text: "Interfacing IR Sensor" },
      { href: "/esp/servo-motor", text: "Interfacing Servo Motor" },
      { href: "/esp/cam-wireless-camera", text: "Interfacing Cam Wireless" },
      { href: "/esp/dc-motor", text: "Interfacing DC Motor" },
      { href: "/esp/interfacing-shock-sensor", text: "Interfacing Shock Sensor" },
      { href: "/esp/interfacing-color-recognition-sensor", text: "Interfacing Color Recognition Sensor" },
      { href: "/esp/rfid-access-control", text: "Interfacing RFID Module" },
      { href: "/esp/lora32-sx1276-oled", text: "TTGO LoRa32 SX1276 OLED" },
      { href: "/esp/keypad-access-control", text: "Interfacing Keypad" },
      { href: "/esp/solenoid-lock", text: "Interfacing Solenoid Lock" },
      { href: "/esp/16x2-lcd-i2c", text: "Interfacing 16x2 LCD" },
      { href: "/esp/soil-moisture-sensor", text: "Interfacing Soil Moisture" },
      { href: "/esp/mq7-gas-sensor", text: "Interfacing MQ-7 Gas Sensor" },
      { href: "/esp/light-sleep-mode", text: "Interfacing Light Sleep Mode" },
      { href: "/esp/smart-light-control-bluetooth", text: "Interfacing Smart Light Control" },
      { href: "/esp/iot-weather-station", text: "Interfacing (IoT) Weather Station" },
      { href: "/esp/web-server-temperature-display", text: "Web Server for Temperature Data Display" },
      { href: "/esp/home-automation-relay-control", text: "Home Automation System with Relay Control" },
      { href: "/esp/iot-smart-garden-esp32", text: "Interfacing IoT Smart Garden" },
      { href: "/esp/face-recognition-door-unlock", text: "Face Recognition-Based Door Unlock System" },
      { href: "/esp/wifi-jammer", text: "Interfacing Wi-Fi Jammer Detector" },
      { href: "/esp/health-band-with-pulse", text: "Interfacing Health Band with Pulse" },
      { href: "/esp/sound-level-logger-classrooms", text: "Sound Level Logger for Classrooms" },
      { href: "/esp/night-vision-surveillance-camera", text: "Night Vision Surveillance Camera" },
      { href: "/esp/solar-panel-monitoring", text: "Solar Panel Monitoring System" },
      { href: "/esp/smart-farming-robot-crop-surveillance", text: "Smart Farming Robot for Crop Surveillance" },
      { href: "/esp/smart-water-quality-monitoring", text: "Smart Water Quality Monitoring System" },
      { href: "/esp/industrial-iot-gateway-real-time-monitoring", text: "Industrial IoT Gateway for Real-Time Monitoring" },
      { href: "/esp/smart-agriculture-system-drone-control", text: "Agriculture System with Automated Drone Control" },
    ],
  },
];

export default function EspLayout({ children }) {
  const [toggles, setToggles] = useState({ basic: true, intermediate: false });
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
          ESP32 Experiments
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