import Image from 'next/image';
import espImage from '../../../public/images/esp.webp';

export const metadata = {
  title: 'Complete ESP32 Setup & Projects Guide – Sarkitshala',
  description: 'Step-by-step ESP32 setup tutorials, projects, and coding examples. Master ESP32 Wi-Fi, Bluetooth, and IoT projects with Sarkitshala.',
  robots: 'index, follow',
  canonical: 'https://sarkitshala.com/esp',
 
  twitter: {
    card: 'summary_large_image',
   },
  author: 'Aman Raj',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Complete ESP32 Setup & Projects Guide – Sarkitshala",
    description:
      "Step-by-step ESP32 setup tutorials, projects, and coding examples for Wi-Fi, Bluetooth, and IoT.",
    image: "https://sarkitshala.com/images/esp.webp",
    author: {
      "@type": "Person",
      name: "Aman Raj",
    },
    publisher: {
      "@type": "Organization",
      name: "Sarkitshala",
      logo: {
        "@type": "ImageObject",
        url: "https://sarkitshala.com/images/logo.png",
      },
    },
    datePublished: "2025-05-22",
    dateModified: "2025-05-22",
  },
};

export default function ESPSetupPage() {
  return (
    <>
     
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.structuredData) }}
      />

      <main className="articleContainer  ">
        <h1 >
          Complete ESP32 Setup & Projects Guide
        </h1>

        <Image
          src={espImage}
          alt="ESP32 Microcontroller Setup and Projects"
          width={700}
          height={400}
          className="rounded-lg mx-auto"
          loading="lazy"
        />
<section >
        <p className=''>
          ESP32 is one of the most popular microcontrollers for IoT and embedded projects. This guide covers
          everything you need to get started — from hardware setup to Wi-Fi and Bluetooth programming.
          Whether you’re a beginner or an expert, this page will help you build powerful IoT projects with ESP32.
        </p>
        </section>

        {/* Section: Why ESP32? */}
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 className=''>Why Choose ESP32 for Your Projects?</h2>
          <ul className="list-disc list-inside  space-y-2">
            <li>Dual-core 240MHz processor for efficient multitasking</li>
            <li>Built-in Wi-Fi and Bluetooth (Classic & BLE)</li>
            <li>34 programmable GPIO pins for sensors and peripherals</li>
            <li>Low power consumption for battery-operated devices</li>
            <li>Compatible with Arduino IDE, MicroPython, PlatformIO</li>
            <li>Strong community support and abundant libraries</li>
          </ul>
        </section>

        {/* Section: Hardware Setup */}
        <section >
          <h2 className=''>ESP32 Hardware Setup</h2>
          <p >
            To start your ESP32 journey, connect your ESP32 development board to your PC using a USB cable.
            Install the required USB-to-serial drivers if necessary. Next, install the Arduino IDE and add the ESP32 board
            URL to the Board Manager.
          </p>

          <h3 className=''>Steps:</h3>
  <ol >
    <li>
      Download and install the latest Arduino IDE from{' '}
      <a
        href="https://www.arduino.cc/en/software"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-words"
      >
        arduino.cc
      </a>.
    </li>
    <li>
      Open Arduino IDE, go to <em>File &gt; Preferences</em> and paste this URL in{' '}
      <em>Additional Board Manager URLs</em>:<br />
      <code className="block bg-gray-100 p-2 rounded text-sm break-all mt-1">
        https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
      </code>
    </li>
    <li>
      Go to <em>Tools &gt; Board &gt; Boards Manager</em>, search for "esp32" and install the ESP32 platform.
    </li>
    <li>
      Select your ESP32 board and the correct COM port under <em>Tools</em>.
    </li>
    <li>
      Upload your first example sketch like <em>Blink</em> to test the setup.
    </li>
  </ol>
        </section>

        {/* Section: Basic ESP32 Wi-Fi Project */}
        <section >
          <h2 className=''>Basic ESP32 Wi-Fi Connection Example</h2>
          <pre >
            {`
#include <WiFi.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Your code here
}
            `}
          </pre>
          <p >
            Replace <code>YOUR_SSID</code> and <code>YOUR_PASSWORD</code> with your Wi-Fi credentials and upload the code.
            Open Serial Monitor to see the connection status and IP address.
          </p>
        </section>

        {/* Section: Project Ideas */}
        <section >
          <h2 >Top ESP32 Project Ideas</h2>
          <ul >
            <li>Home Automation System using ESP32 & MQTT</li>
            <li>IoT Weather Station with Sensors and Cloud Upload</li>
            <li>Bluetooth Controlled Robot Car</li>
            <li>Smart Lighting with ESP32 and Alexa</li>
            <li>Real-time Data Logger using ThingSpeak</li>
          </ul>
        </section>

        {/* Section: FAQs (for SEO Rich Snippet) */}
        <section >
          <h2 >Frequently Asked Questions (FAQs)</h2>
          <dl >
            <dt >What is ESP32?</dt>
            <dd>
              ESP32 is a low-cost, low-power microcontroller with integrated Wi-Fi and Bluetooth, ideal for IoT and embedded projects.
            </dd>

            <dt >How is ESP32 different from ESP8266?</dt>
            <dd>
              ESP32 supports Bluetooth, dual-core CPU, more GPIOs, and better peripherals compared to the single-core ESP8266.
            </dd>

            <dt >Which IDE can I use to program ESP32?</dt>
            <dd>
              You can program ESP32 using Arduino IDE, PlatformIO, or MicroPython.
            </dd>
          </dl>
        </section>

       
        
      </main>
    </>
  );
}
