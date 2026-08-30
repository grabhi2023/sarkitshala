'use client';
import Link from "next/link";
import { useState } from "react";

const experiments = [
  {
    label: "Basic Experiments",
    key: "basic",
    links: [
      { href: "/raspberry/interfacing-led-raspberrypi", text: "Interfacing LED" },
      { href: "/raspberry/interfacing-laser-sensor-raspberrypi", text: "Interfacing Laser Sensor" },
      { href: "/raspberry/interfacing-joystick-module-raspberrypi", text: "Interfacing Joystick Module" },
      { href: "/raspberry/interfacing-4x4-keypad-raspberrypi", text: "Interfacing 4x4 Keypad" },
      { href: "/raspberry/interfacing-ldr-raspberrypi", text: "Interfacing LDR (Light Sensor)" },
      { href: "/raspberry/lcd-i2c", text: "Interfacing LCD" },
      { href: "/raspberry/dc-motor-control-l298n", text: "Interfacing DC Motor" },
      { href: "/raspberry/ultrasonic-sensor-raspberrypir", text: "Interfacing Ultrasonic Sensor" },
      { href: "/raspberry/dht11-raspberrypi", text: "Interfacing DHT11 Sensor" },
      { href: "/raspberry/pulse-rate-sensor-raspberrypi", text: "Interfacing Pulse Rate Sensor" },
      { href: "/raspberry/pir-sensor-raspberrypi", text: "Interfacing PIR Sensor" },
      { href: "/raspberry/gear-motor", text: "Interfacing Gear Motor" },
      { href: "/raspberry/obstacle-avoidance-sensor", text: "Interfacing Obstacle Avoidance Sensor" },
      { href: "/raspberry/servo-motor", text: "Interfacing Sound Sensor" },
      { href: "/raspberry/oled-display", text: "Interfacing OLED Display" },
      { href: "/raspberry/home-automation-system-raspberry-pi", text: "Home Automation System" },
      { href: "/raspberry/weather-station-raspberry-pi", text: "Weather Station" },
      { href: "/raspberry/security-camera-system", text: "Security Camera System" },
      { href: "/raspberry/controlled-drone", text: "Raspberry Pi-Controlled Drone" },
    ],
  },
  {
    label: "Intermediate Experiments",
    key: "intermediate",
    links: [
      { href: "/raspberry/drone-delivery-system-raspberry-pi", text: "Drone Delivery System" },
      { href: "/raspberry/automated-lighting-system", text: "Automated Lighting System" },
      { href: "/raspberry/health-monitoring-system", text: "Health Monitoring System" },
      { href: "/raspberry/plant-care-monitoring-system", text: "Plant Care and Monitoring System" },
      { href: "/raspberry/buzzer-activation-using-gpio", text: "Buzzer Activation using GPIO" },
      { href: "/raspberry/voice-assistant-python", text: "Voice Assistant using Python" },
      { href: "/raspberry/gpio-button", text: "GPIO Button Control" },
      { href: "/raspberry/barcode-scanner", text: "Barcode Scanner System" },
      { href: "/raspberry/rfid-attendance-system-raspberry-pi", text: "RFID Attendance System" },
      { href: "/raspberry/smart-dustbin-ultrasonic-sensor-raspberry-pi", text: "Smart Dustbin" },
      { href: "/raspberry/telegram-bot-controlled-raspberry-pi", text: "Telegram Bot Controlled System" },
      { href: "/raspberry/python-based-object-detection-with-pi-camera", text: "Object Detection with Pi Camera" },
      { href: "/raspberry/controlled-robot-car", text: "Controlled Robot Car" },
      { href: "/raspberry/gesture-controlled-media-player", text: "Gesture Controlled Media Player" },
      { href: "/raspberry/smart-energy-meter-using-pi-and-current-sensor", text: "Smart Energy Meter" },
      { href: "/raspberry/smart-mirror-with-raspberry-pi", text: "Smart Mirror" },
      { href: "/raspberry/machine-learning-model-deployment-on-raspberry-pi", text: "ML Model Deployment" },
      { href: "/raspberry/build-your-own-vpn-server-on-raspberry-pi", text: "VPN Server on Pi" },
      { href: "/raspberry/smart-traffic-light-system-using-image-processing", text: "Smart Traffic Light System" },
      { href: "/raspberry/lora-communication-with-raspberry-pi", text: "LoRa Communication" },
      { href: "/raspberry/license-plate-recognition-system", text: "License Plate Recognition" },
      { href: "/raspberry/smart-agriculture-system-raspberry-pi", text: "Smart Agriculture System" },
      { href: "/raspberry/industrial-iot-monitoring-system", text: "Industrial IoT Monitoring" },
      { href: "/raspberry/blockchain-node-deployment-on-raspberry-pi", text: "Blockchain Node Deployment" },
      { href: "/raspberry/interfacing-servo-raspberrypi", text: "Servo Motor with Raspberry Pi" },
      { href: "/raspberry/interfacing-dht11-dht22-raspberrypi", text: "DHT11/DHT22 with Raspberry Pi" },
      { href: "/raspberry/interfacing-gpsmodule-raspberrypi", text: "GPS Module with Raspberry Pi" },
      { href: "/raspberry/interfacing-soil-moisture-sensor-raspberrypi", text: "Soil Moisture Sensor" },
      { href: "/raspberry/interfacing-relay-module-raspberrypi", text: "Relay Module with Raspberry Pi" },
      { href: "/raspberry/interfacing-npk-sensor-raspberrypi", text: "NPK Sensor Module" },
      { href: "/raspberry/interfacing-soil-humidity-sensor-raspberrypi", text: "Soil Humidity Sensor" },
    ],
  },
];

export default function RaspberryLayout({ children }) {
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
          Raspberry Pi Experiments
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