import Image from "next/image";

const LEDArduino = ({ data }) => {
  return (
    <div className="articleContainer md:ml-0 mt-10 w-[100%]">
      <h1 className="headingClass">Interfacing of LED with Arduino</h1>

      <Image
        src={data.image1}
        height={400}
        width={500}
        alt="LED with Arduino"
        className="mx-auto rounded my-6"
        sizes="(max-width: 768px) 100vw, 500px"
      />

      {/* Section 1 */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">1. LED (Light Emitting Diode)</h2>
        <p className="paragraphText">
          It is a semiconductor device that emits light when an electric current passes through it. It is a
          special type of diode that converts electrical energy directly into light energy through a
          process called electroluminescence. LEDs are widely used in various applications, including
          display panels, indicator lights, lighting systems, and communication devices due to their
          high efficiency, low power consumption, and long lifespan.
        </p>
      </section>

      {/* Section 2 */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">2. How Does an LED Work?</h2>

        <h3 className="text-xl font-semibold text-blue-600 mb-2">2.1. Structure of an LED</h3>
        <p className="paragraphText mb-2">
          An LED is made of a p-n junction semiconductor, similar to a regular diode. It consists of:
        </p>
        <ul className="list-disc pl-6 paragraphText space-y-1">
          <li>P-type semiconductor (positive side) – Contains excess holes (positive charge carriers).</li>
          <li>N-type semiconductor (negative side) – Contains excess electrons (negative charge carriers).</li>
        </ul>
        <p className="paragraphText mt-2">
          When voltage is applied in the forward direction, electrons and holes recombine at the
          junction, releasing energy in the form of light (photons).
        </p>

        <h3 className="text-xl font-semibold text-blue-600 mb-2 mt-4">2.2. Working Principle of LED (Electroluminescence)</h3>
        <ol className="list-decimal pl-6 paragraphText space-y-1">
          <li>Forward Bias Application: A voltage is applied across the LED terminals.</li>
          <li>Electron-Hole Recombination: Electrons and holes recombine at the junction, emitting photons (light).</li>
          <li>Emission of Light: The wavelength (color) depends on the bandgap of the semiconductor material.</li>
          <li>Fast Switching – Turns on and off instantly without warm-up time.</li>
          <li>Compact Size – Available in small sizes suitable for various applications.</li>
          <li>Durability – Resistant to shock and vibration compared to traditional bulbs.</li>
          <li>Eco-Friendly – LEDs do not contain harmful substances like mercury.</li>
        </ol>
      </section>

      {/* Semiconductor Table */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">3. Semiconductor Materials and LED Colors</h2>
        <p className="paragraphText mb-4">
          The color of an LED depends on the bandgap energy of the semiconductor material used.
          Different materials produce different wavelengths of light:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full styledTable paragraphText">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="p-2 border">LED Color</th>
                <th className="p-2 border">Semiconductor Material</th>
                <th className="p-2 border">Wavelength (nm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { color: "Infrared (IR)", material: "GaAs (Gallium Arsenide)", wavelength: "850 - 940 nm" },
                { color: "Red", material: "GaAsP (Gallium Arsenide Phosphide)", wavelength: "620 - 750 nm" },
                { color: "Orange", material: "GaAsP, GaP (Gallium Phosphide)", wavelength: "590 - 620 nm" },
                { color: "Yellow", material: "GaAsP, GaP", wavelength: "570 - 590 nm" },
                { color: "Green", material: "GaP, InGaN (Indium Gallium Nitride)", wavelength: "495 - 570 nm" },
                { color: "Blue", material: "InGaN, SiC (Silicon Carbide)", wavelength: "450 - 495 nm" },
                { color: "White", material: "Blue LED + Phosphor Coating", wavelength: "Mixed spectrum" },
                { color: "Ultraviolet (UV)", material: "GaN (Gallium Nitride)", wavelength: "10 - 400 nm" },
              ].map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{item.color}</td>
                  <td className="p-2 border">{item.material}</td>
                  <td className="p-2 border">{item.wavelength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Characteristics */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">4. Characteristics of LEDs</h2>
        <ol className="list-decimal pl-6 paragraphText space-y-1">
          <li>Low Power Consumption – LEDs consume very little energy, making them highly efficient.</li>
          <li>High Brightness – Modern LEDs provide bright illumination.</li>
          <li>Long Lifespan – Can last 50,000 hours or more.</li>
          <li>Fast Switching – Turns on and off instantly without warm-up time.</li>
          <li>Compact Size – Available in small sizes suitable for various applications.</li>
          <li>Durability – Resistant to shock and vibration compared to traditional bulbs.</li>
          <li>Eco-Friendly – LEDs do not contain harmful substances like mercury.</li>
        </ol>
      </section>

      {/* Types of LEDs */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">5. Types of LEDs</h2>
        <p className="paragraphText mb-3">
          There are different types of LEDs, categorized based on their applications and construction:
        </p>

        <h3 className="text-xl font-semibold text-blue-600 mb-2">Based on Construction:</h3>
        <ul className="list-disc pl-6 paragraphText space-y-1 mb-4">
          <li>Through-Hole LEDs: Standard 3mm, 5mm, 10mm LEDs used in circuits.</li>
          <li>Surface Mount Device (SMD) LEDs: Used in compact electronics (e.g., mobile phones, TVs).</li>
          <li>Chip-on-Board (COB) LEDs: High-power LEDs with multiple chips for bright light output.</li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-600 mb-2">Based on Color &amp; Functionality:</h3>
        <ul className="list-disc pl-6 paragraphText space-y-1 mb-4">
          <li>Single-color LEDs: Emit one specific color (red, blue, green, etc.).</li>
          <li>RGB LEDs: Can produce multiple colors by mixing Red, Green, and Blue.</li>
          <li>Infrared (IR) LEDs: Used in remote controls and night vision cameras.</li>
          <li>Ultraviolet (UV) LEDs: Used in sterilization, counterfeit detection, and curing applications.</li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-600 mb-2">Based on Power Rating:</h3>
        <ul className="list-disc pl-6 paragraphText space-y-1 mb-4">
          <li>Low-power LEDs: Used in indicators and displays.</li>
          <li>High-power LEDs: Used in lighting applications like streetlights and automotive headlights.</li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-600 mb-2">Applications of LEDs:</h3>
        <ul className="list-disc pl-6 paragraphText space-y-1">
          <li>Indicator Lights: Used in electronic devices (power indicators, alarms).</li>
          <li>Displays and Signage: Used in LED screens, billboards, and TVs.</li>
          <li>Automotive Lighting: Used in headlights, tail-lights, and dashboard indicators.</li>
          <li>Home and Office Lighting: Energy-efficient LED bulbs and tube lights.</li>
          <li>Streetlights &amp; Industrial Lighting: Used for outdoor and commercial lighting.</li>
          <li>Medical Applications: Used in phototherapy, pulse oximeters, and endoscopy.</li>
          <li>Communication Systems: Used in optical fiber communication and remote controls.</li>
        </ul>
      </section>

      {/* Requirements */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">6. Requirements</h2>

        <h3 className="text-xl font-semibold text-blue-600 mb-2">6.1 Hardware Components</h3>
        <ul className="list-disc pl-6 paragraphText space-y-1 mb-4">
          <li>Arduino Board</li>
          <li>LED (5mm)</li>
          <li>Resistor (220Ω – 330Ω)</li>
          <li>Breadboard</li>
          <li>Jumper Wires</li>
          <li>USB Cable</li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-600 mb-2">6.2 Software Requirements</h3>
        <ul className="list-disc pl-6 paragraphText space-y-1">
          <li>Arduino IDE</li>
          <li>USB Drivers</li>
          <li>Arduino Board Support Package</li>
        </ul>
      </section>

      {/* Advantages Table */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">7. Advantages of LEDs Over Traditional Lighting</h2>
        <div className="overflow-x-auto">
          <table className="w-full styledTable paragraphText">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="p-2 border">Feature</th>
                <th className="p-2 border">LED</th>
                <th className="p-2 border">Incandescent Bulb</th>
                <th className="p-2 border">CFL</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Power Consumption", led: "Low (1W – 10W)", incandescent: "High (40W – 100W)", cfl: "Moderate (5W – 25W)" },
                { feature: "Lifespan", led: "50,000+ hours", incandescent: "1,000 hours", cfl: "8,000 hours" },
                { feature: "Heat Emission", led: "Very low", incandescent: "High", cfl: "Moderate" },
                { feature: "Eco-Friendly", led: "Yes (no toxic materials)", incandescent: "No (filament waste)", cfl: "No (contains mercury)" },
                { feature: "Switching Time", led: "Instant", incandescent: "Slow", cfl: "Moderate" },
              ].map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{item.feature}</td>
                  <td className="p-2 border">{item.led}</td>
                  <td className="p-2 border">{item.incandescent}</td>
                  <td className="p-2 border">{item.cfl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Hardware Components Table */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">8. Hardware Components</h2>
        <div className="overflow-x-auto">
          <table className="w-full styledTable paragraphText">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="p-2 border">Component</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { Component: "Arduino Board", Quantity: "1", Description: "Any model (Arduino Uno, Mega, Nano, etc.)" },
                { Component: "LED (5mm)", Quantity: "1", Description: "Any color (Red, Green, Blue, etc.)" },
                { Component: "Resistor (220Ω – 330Ω)", Quantity: "1", Description: "To limit current and protect the LED" },
                { Component: "Breadboard", Quantity: "1", Description: "For making easy connections" },
                { Component: "Jumper Wires", Quantity: "As needed", Description: "Male-to-Male wires for connections" },
                { Component: "USB Cable", Quantity: "1", Description: "To connect Arduino to a PC" },
              ].map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{item.Component}</td>
                  <td className="p-2 border">{item.Quantity}</td>
                  <td className="p-2 border">{item.Description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Software Table */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">9. Software Requirements</h2>
        <div className="overflow-x-auto">
          <table className="w-full styledTable paragraphText">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="p-2 border">Software</th>
                <th className="p-2 border">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                { Software: "Arduino IDE", Purpose: "Writing and uploading code to Arduino" },
                { Software: "USB Drivers", Purpose: "Required for Arduino communication with PC" },
                { Software: "Arduino Board Support Package", Purpose: "Libraries and tools for programming the Arduino" },
              ].map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{item.Software}</td>
                  <td className="p-2 border">{item.Purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Circuit Diagram */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">10. Circuit Diagram</h2>
        <h3 className="text-xl font-semibold text-blue-600 mb-3">LED Connection with Arduino</h3>
        <Image
          src={data.image4}
          width={600}
          height={400}
          alt="Arduino LED Circuit"
          className="mx-auto rounded"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </section>

      {/* Connection Details */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">11. Connection Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full styledTable paragraphText">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="p-2 border">Component</th>
                <th className="p-2 border">Arduino Pin</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { Component: "LED Anode (+)", ArduinoPin: "Digital Pin 9", Description: "Supplies voltage to the LED" },
                { Component: "LED Cathode (-)", ArduinoPin: "GND (Ground)", Description: "Completes the circuit" },
                { Component: "Resistor (220Ω – 330Ω)", ArduinoPin: "In series with LED", Description: "Limits current to prevent LED damage" },
              ].map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{item.Component}</td>
                  <td className="p-2 border">{item.ArduinoPin}</td>
                  <td className="p-2 border">{item.Description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Algorithm + Code */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">12. Algorithm</h2>
        <ol className="list-decimal pl-6 paragraphText space-y-1 mb-6">
          <li>Start</li>
          <li>Initialize Arduino and define LED pin</li>
          <li>Set LED pin as OUTPUT in setup() function</li>
          <li>Turn LED ON</li>
          <li>Wait for 1 second (1000ms delay)</li>
          <li>Turn LED OFF</li>
          <li>Wait for 1 second (1000ms delay)</li>
          <li>Repeat steps 4–7 in a loop</li>
        </ol>

        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Arduino Code: Basic LED Blinking</h2>
        <pre className="codeBox">
          {`// Define LED pin
const int ledPin = 9; // LED is connected to digital pin 9

void setup() {
  pinMode(ledPin, OUTPUT); // Set LED pin as an output
}

void loop() {
  digitalWrite(ledPin, HIGH); // Turn LED ON
  delay(1000);                // Wait for 1 second
  digitalWrite(ledPin, LOW);  // Turn LED OFF
  delay(1000);                // Wait for 1 second
}`}
        </pre>

        <h2 className="text-2xl font-semibold text-indigo-600 mb-4 mt-6">Explanation of the Code</h2>
        <ul className="list-disc pl-6 paragraphText space-y-1 mb-6">
          <li><strong>Defining the LED Pin:</strong> <code>const int ledPin = 9;</code> assigns pin 9 to control the LED.</li>
          <li><strong>Configuring the LED as Output:</strong> <code>pinMode(ledPin, OUTPUT);</code> sets pin 9 as an output.</li>
          <li><strong>Turning the LED ON and OFF in a Loop:</strong> <code>digitalWrite()</code> is used to control the state.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Modifying LED Behavior</h2>
        <h3 className="text-xl font-semibold text-blue-600 mb-2">Adjusting Blink Speed</h3>
        <p className="paragraphText mb-2">Modify the <code>delay()</code> value:</p>
        <ul className="list-disc pl-6 paragraphText space-y-1 mb-4">
          <li>For faster blinking (0.5 seconds ON/OFF): <code>delay(500);</code></li>
          <li>For slower blinking (2 seconds ON/OFF): <code>delay(2000);</code></li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-600 mb-2">LED Brightness Control (PWM)</h3>
        <pre className="codeBox">
          {`const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  for (int brightness = 0; brightness <= 255; brightness += 5) {
    analogWrite(ledPin, brightness); // Increase brightness
    delay(30);
  }
  for (int brightness = 255; brightness >= 0; brightness -= 5) {
    analogWrite(ledPin, brightness); // Decrease brightness
    delay(30);
  }
}`}
        </pre>

        <h2 className="text-2xl font-semibold text-indigo-600 mb-4 mt-6">Applications of LED Interfacing with Arduino</h2>
        <ul className="list-disc pl-6 paragraphText space-y-1">
          <li>Status Indicator: Shows device status (ON/OFF).</li>
          <li>Traffic Light System: Simulates red, yellow, and green lights.</li>
          <li>Smart Lighting: Can be controlled using sensors or IoT.</li>
          <li>Notification Systems: Used in alarm systems.</li>
          <li>Pulse &amp; Heartbeat Indicators: Medical applications.</li>
          <li>Automated Signaling: In smart cities and automation.</li>
        </ul>
      </section>

      {/* Troubleshooting */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">13. Troubleshooting Common Issues</h2>
        <div className="overflow-x-auto">
          <table className="w-full styledTable paragraphText">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="p-2 border">Issue</th>
                <th className="p-2 border">Possible Causes</th>
                <th className="p-2 border">Solution</th>
              </tr>
            </thead>
            <tbody>
              {[
                { Issue: "LED does not turn ON", PossibleCauses: "Loose connections, incorrect polarity", Solution: "Check wiring, ensure LED is in the correct orientation" },
                { Issue: "LED is too dim", PossibleCauses: "Resistor value too high", Solution: "Use a lower resistor (220Ω)" },
                { Issue: "LED is not blinking", PossibleCauses: "Code issue, wrong pin", Solution: "Check code and ensure correct pin is assigned" },
                { Issue: "LED turns ON but doesn't turn OFF", PossibleCauses: "Pin not set as OUTPUT", Solution: "Ensure pinMode(ledPin, OUTPUT); is in setup()" },
              ].map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{item.Issue}</td>
                  <td className="p-2 border">{item.PossibleCauses}</td>
                  <td className="p-2 border">{item.Solution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Conclusion */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">14. Conclusion</h2>
        <p className="paragraphText">
          Interfacing an LED with Arduino is a great way to learn digital output control. By
          controlling the LED using <code>digitalWrite()</code> and <code>analogWrite()</code>, we can create blinking effects,
          brightness control, and automated lighting systems.
        </p>
      </section>
    </div>
  );
};

export default LEDArduino;