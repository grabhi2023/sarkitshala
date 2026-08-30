import image1 from '../../../public/images/Arduino_SKT.webp';
import Image from 'next/image';
import Link from 'next/link';

// ✅ Next.js 16 — jsonLd metadata object mein directly kaam nahi karta
// Ise page ke andar <script> tag se inject karo
export const metadata = {
  title: "Best Arduino Projects & Tutorials for Beginners - Sarkitshala",
  description:
    "Discover top Arduino projects & tutorials for beginners. Learn digital, analog & PWM pins, IoT applications, sensor projects & more with step-by-step guides!",
  alternates: {
    canonical: "https://sarkitshala.com/arduino",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Best Arduino Projects & Tutorials for Beginners - Sarkitshala",
  description:
    "Discover top Arduino projects & tutorials for beginners. Learn digital, analog & PWM pins, IoT applications, sensor projects & more with step-by-step guides!",
  url: "https://sarkitshala.com/arduino",
  publisher: {
    "@type": "Organization",
    name: "Sarkitshala",
    logo: { "@type": "ImageObject", url: "https://sarkitshala.com/logo.webp" },
  },
  mainEntityOfPage: "https://sarkitshala.com/arduino",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Arduino used for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Arduino is widely used for DIY electronics, IoT projects, robotics, and STEM education.",
      },
    },
    {
      "@type": "Question",
      name: "Is Arduino good for beginners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Arduino has a simple interface, a large supportive community, and plenty of tutorials.",
      },
    },
    {
      "@type": "Question",
      name: "Which Arduino board is best to start with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Arduino Uno is the most recommended board for beginners due to its reliability and simplicity.",
      },
    },
  ],
};

const pinGuides = [
  {
    id: "Digital-Pins",
    title: "1. Digital Pins",
    desc: "Used to read/write HIGH or LOW signals. Connect LEDs, switches, relays, etc. Key functions: pinMode(), digitalWrite(), digitalRead().",
    color: "blue",
  },
  {
    id: "Analog-Pins",
    title: "2. Analog Pins",
    desc: "Analog pins (A0–A5) work with analog sensors like LDR and temperature sensors. Use analogRead() to measure voltages (0–1023).",
    color: "green",
  },
  {
    id: "Power-Pins",
    title: "3. Power Pins",
    desc: "Provide 3.3V or 5V power and GND to components. Vin is used for supplying power from external sources.",
    color: "orange",
  },
  {
    id: "PWM-Pins",
    title: "4. PWM Pins",
    desc: "Pins marked with ~ output PWM signals. Used for dimming LEDs, controlling DC motor speed, and servo angles via analogWrite().",
    color: "purple",
  },
  {
    id: "Communication-Pins",
    title: "5. Communication Pins",
    desc: "TX/RX for Serial, SDA/SCL for I2C, MOSI/MISO/SCK for SPI communication protocols.",
    color: "red",
  },
];

const colorMap = {
  blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
  green: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400",
  orange: "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400",
  purple: "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400",
  red: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
};

const faqs = [
  { q: "What is Arduino used for?", a: "Arduino is widely used for DIY electronics, IoT projects, robotics, and STEM education. It helps you interact with the physical world using sensors and actuators." },
  { q: "Is Arduino good for beginners?", a: "Yes! Arduino has a simple interface, a large supportive community, and plenty of tutorials. It's ideal for beginners who want to learn electronics and coding." },
  { q: "Which Arduino board is best to start with?", a: "The Arduino Uno is the most recommended board for beginners due to its reliability, community support, and simplicity." },
];

const relatedLinks = [
  { slug: 'interfacing-pir-sensor', text: 'PIR Sensor' },
  { slug: 'interfacing-rgb-led', text: 'RGB LED' },
  { slug: 'interfacing-seven-segment-display', text: '7-Segment Display' },
  { slug: 'interfacing-ir-sensor', text: 'IR Sensor' },
];

export default function Page() {
  return (
    <>
      {/* ✅ JSON-LD via script tag — correct way in Next.js 16 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="articleContainer mt-12">
        <h1 id="Arduino">
          Best Arduino Projects, Pin Guides & Step-by-Step Tutorials for Beginners
        </h1>

        <Image
          src={image1}
          alt="Arduino Microcontroller Setup and Projects"
          width={700}
          height={400}
          priority
        />

        {/* Overview */}
        <section>
          <h2 id="Overview-of-Arduino">
            What is Arduino? Features, Boards & Benefits
          </h2>
          <p>
            Arduino is an open-source electronics platform based on easy-to-use hardware and software.
            It allows users to read data from sensors and control actuators like motors, LEDs, and displays.
            Widely used in DIY projects, IoT systems, robotics, and educational kits.
          </p>
        </section>

        {/* Pin Guides */}
        <section>
          <h2 id="Arduino-Pins">How to Use Digital, Analog, and PWM Pins</h2>
          <p>Understanding the types of pins is crucial to building Arduino projects:</p>
        </section>

        <div className="grid gap-3 mb-8">
          {pinGuides.map((pin) => (
            <div
              key={pin.id}
              className={`p-4 rounded-xl border ${colorMap[pin.color]} transition-colors duration-200`}
            >
              <h3 id={pin.id} className="font-semibold mb-1">{pin.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 m-0">{pin.desc}</p>
            </div>
          ))}
        </div>

        {/* Getting Started */}
        <section>
          <h2 id="Steps-to-Get-Started-with-Arduino">Steps to Get Started with Arduino</h2>
          <ol>
            <li>Download and install Arduino IDE from arduino.cc</li>
            <li>Connect your Arduino board using a USB cable.</li>
            <li>Select your board and COM port from the Tools menu.</li>
            <li>Write a simple sketch like Blink.</li>
            <li>Click the Upload button to flash code.</li>
            <li>Observe the output (like an LED blinking).</li>
          </ol>
        </section>

        {/* FAQ */}
        <section>
          <h2>Frequently Asked Questions</h2>
          <div className="space-y-4 mt-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-border rounded-xl overflow-hidden"
              >
                <summary className="
                  flex items-center justify-between px-5 py-3.5
                  cursor-pointer list-none font-semibold text-sm
                  bg-muted/40 hover:bg-muted transition-colors
                  text-foreground
                ">
                  {faq.q}
                  <svg
                    className="w-4 h-4 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-5 py-3.5 text-sm text-muted-foreground border-t border-border m-0 bg-background">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related links */}
        <section>
          <h2>More Arduino Experiments</h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {relatedLinks.map((item) => (
              <Link
                key={item.slug}
                href={`/arduino/${item.slug}`}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}