import pir from '../../public/images/pir.webp';
import Image from 'next/image';
import CodeBox from './code';

export default function PIRSensorTutorial() {
  return (
    <div className="articleContainer md:ml-0 mt-10 w-[100%]">
      <h1 className="headingClass">Interfacing Arduino with PIR Sensor</h1>

      <Image
        src={pir}
        alt="PIR sensor Projects at Sarkitshala"
        width={700}
        height={600}
        className="mx-auto rounded my-6"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
      />

      <section className="sectionHeading">
        <p className="paragraphText">
          Ever wished your Arduino could act like a tiny security guard who never blinks? Meet the PIR sensor—a clever
          little gadget that detects motion faster than your cat spots a snack. In this DIY electronics experiment,
          you'll learn how to interface an Arduino with a PIR (Passive Infrared) sensor to create your very own motion
          detection system. Whether you're a curious kid or a seasoned tinkerer, this project will show you how a
          humble sensor can transform ordinary circuits into smart guardians. From spotting sneaky intruders to
          automating lights, this tutorial makes motion sensing both fun and surprisingly easy. Ready to give your
          Arduino a sixth sense? Let's get moving!
        </p>
      </section>

      {/* Objective */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Objective</h2>
        <p className="paragraphText">To detect motion using a PIR sensor connected to an Arduino.</p>
      </section>

      {/* Theory */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Theory</h2>
        <ul className="list-disc pl-5 space-y-2 paragraphText">
          <li>
            <strong className="text-xl text-blue-400 font-semibold">What is PIR Sensor: </strong>
            A Passive Infrared (PIR) sensor detects motion by measuring changes in infrared radiation emitted by warm
            objects (like humans).
          </li>
          <li>
            <strong>How Does It Work: </strong>The sensor has two slots that detect infrared levels. When motion
            occurs, the levels change, triggering an output signal.
          </li>
          <li>
            <strong>Why Use It: </strong>Motion detection is used in security systems, automatic lights, and smart
            home devices.
          </li>
          <li>
            <strong>Learning Outcome: </strong>Understand how to connect, configure, and program an Arduino to detect
            motion events using a PIR sensor.
          </li>
        </ul>
      </section>

      {/* Components */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Components Required</h2>
        <ul className="list-disc pl-5 space-y-1 paragraphText">
          <li>Arduino Uno</li>
          <li>Breadboard</li>
          <li>Resistor 220Ω (for LED)</li>
          <li>PIR Motion Sensor Module (HC-SR501)</li>
          <li>Jumper Wires (Male-to-Male) 5-6</li>
          <li>USB Power Cable</li>
          <li>LED (Optional for indication)</li>
        </ul>
      </section>

      {/* Pin Diagram */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Pin Diagram</h2>
        <Image
          src="https://res.cloudinary.com/drryay3rg/image/upload/v1753616146/pirPin_u80n97.webp"
          width={700}
          height={600}
          alt="PIR Sensor Pin Diagram"
          className="mx-auto rounded"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </section>

      {/* Circuit Diagram */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Circuit Diagram</h2>
        <Image
          src="https://res.cloudinary.com/drryay3rg/image/upload/v1753616146/PirCir_pw63ee.webp"
          width={700}
          height={700}
          alt="PIR Sensor Circuit Diagram"
          className="mx-auto rounded"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </section>

      {/* Assembly Steps */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Assembly Steps</h2>
        <ol className="list-decimal pl-5 space-y-1 paragraphText">
          <li>Connect PIR VCC pin to Arduino 5V</li>
          <li>Connect PIR GND to Arduino GND</li>
          <li>Connect PIR OUT to Arduino digital pin 2</li>
          <li>Insert LED anode in pin 13 via 220Ω resistor (optional)</li>
          <li>Connect LED cathode to GND</li>
          <li>Plug in the USB cable</li>
        </ol>
        <p className="noteBox mt-4">
          Tip: If the sensor has sensitivity and delay knobs, set them to mid-range for testing.
        </p>
      </section>

      {/* Arduino Code */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Arduino Code</h2>
        <CodeBox
          code={`int pirPin = 2;    // PIR sensor output pin
int ledPin = 13;   // Onboard LED

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("PIR Motion Sensor Test");
}

void loop() {
  int motionState = digitalRead(pirPin);
  if (motionState == HIGH) {
    Serial.println("Motion Detected!");
    digitalWrite(ledPin, HIGH);
  } else {
    Serial.println("No Motion.");
    digitalWrite(ledPin, LOW);
  }
  delay(500);
}`}
          language="cpp"
        />
      </section>

      {/* Code Explanation */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Code Explanation</h2>

        {/* Variable Declaration */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">1. Variable Declaration</h3>
          <pre className="codeBox">{`int pirPin = 2;`}</pre>
          <p className="paragraphText mt-2">pirPin tells the Arduino where the PIR sensor's output is connected — digital pin 2.</p>
          <pre className="codeBox mt-3">{`int ledPin = 13;`}</pre>
          <p className="paragraphText mt-2">ledPin sets pin 13 to control the onboard LED.</p>
        </div>

        {/* Setup Function */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">2. setup() Function</h3>
          <CodeBox
            code={`void setup() {
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("PIR Motion Sensor Test");
}`}
            language="cpp"
          />
          <ul className="list-disc pl-5 paragraphText space-y-1 mt-3">
            <li><strong>pinMode(pirPin, INPUT):</strong> Sets pin 2 as input for the PIR sensor.</li>
            <li><strong>pinMode(ledPin, OUTPUT):</strong> Sets pin 13 as output for the LED.</li>
            <li><strong>Serial.begin(9600):</strong> Starts serial communication at 9600 baud.</li>
            <li><strong>Serial.println(...):</strong> Prints a test message on startup.</li>
          </ul>
        </div>

        {/* Loop Function */}
        <div>
          <h3 className="text-xl font-semibold text-blue-600 mb-2">3. loop() Function</h3>
          <CodeBox
            code={`void loop() {
  int motionState = digitalRead(pirPin);
  if (motionState == HIGH) {
    Serial.println("Motion Detected!");
    digitalWrite(ledPin, HIGH);
  } else {
    Serial.println("No Motion.");
    digitalWrite(ledPin, LOW);
  }
  delay(500);
}`}
            language="cpp"
          />
          <ul className="list-disc pl-5 paragraphText space-y-1 mt-3">
            <li><strong>digitalRead(pirPin):</strong> Reads the state of the PIR sensor.</li>
            <li><strong>if (motionState == HIGH):</strong> Checks if motion is detected.</li>
            <li><strong>digitalWrite(ledPin, HIGH):</strong> Turns ON the LED.</li>
            <li><strong>digitalWrite(ledPin, LOW):</strong> Turns OFF the LED.</li>
            <li><strong>delay(500):</strong> Waits for 500ms before checking again.</li>
          </ul>
        </div>
      </section>

      {/* Line-by-Line Breakdown */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Line-by-Line Code Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full styledTable paragraphText">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="p-2 border">Line</th>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { line: 1, code: 'int pirPin = 2;', desc: 'Define PIR sensor pin (digital pin 2).' },
                { line: 2, code: 'int ledPin = 13;', desc: 'Define LED pin (digital pin 13).' },
                { line: 3, code: 'void setup() {', desc: 'Start setup function (runs once at start).' },
                { line: 4, code: 'pinMode(pirPin, INPUT);', desc: 'Set PIR pin as INPUT.' },
                { line: 5, code: 'pinMode(ledPin, OUTPUT);', desc: 'Set LED pin as OUTPUT.' },
                { line: 6, code: 'Serial.begin(9600);', desc: 'Start serial communication at 9600 baud.' },
                { line: 7, code: 'Serial.println("PIR Motion Sensor Test");', desc: 'Print test message.' },
                { line: 8, code: '}', desc: 'End of setup function.' },
                { line: 9, code: 'void loop() {', desc: 'Start loop function (repeats forever).' },
                { line: 10, code: 'int motionState = digitalRead(pirPin);', desc: 'Read PIR sensor state.' },
                { line: 11, code: 'if (motionState == HIGH) {', desc: 'Check if motion detected.' },
                { line: 12, code: 'Serial.println("Motion Detected!");', desc: 'Print motion message.' },
                { line: 13, code: 'digitalWrite(ledPin, HIGH);', desc: 'Turn LED ON.' },
                { line: 14, code: '} else {', desc: 'If no motion detected...' },
                { line: 15, code: 'Serial.println("No Motion.");', desc: 'Print no motion message.' },
                { line: 16, code: 'digitalWrite(ledPin, LOW);', desc: 'Turn LED OFF.' },
                { line: 17, code: '}', desc: 'End if-else block.' },
                { line: 18, code: 'delay(500);', desc: 'Wait 500 milliseconds.' },
                { line: 19, code: '}', desc: 'End loop function.' },
              ].map((row, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{row.line}</td>
                  <td className="p-2 border font-mono text-sm">{row.code}</td>
                  <td className="p-2 border">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Expected Outcome */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Expected Outcome</h2>
        <p className="paragraphText mb-2">Once your code is uploaded and the setup powered on:</p>
        <ul className="list-disc pl-5 space-y-1 paragraphText">
          <li><strong>Startup:</strong> Serial Monitor displays: <code>PIR Motion Sensor Test</code></li>
          <li><strong>Motion Detected:</strong> LED lights up and Serial prints <code>Motion Detected!</code></li>
          <li><strong>No Motion:</strong> LED stays off and Serial prints <code>No Motion.</code></li>
          <li><strong>Loop:</strong> The detection checks run every 500ms continuously.</li>
        </ul>
      </section>

      {/* Troubleshooting */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Troubleshooting</h2>
        <ul className="list-disc pl-5 space-y-1 paragraphText">
          <li><strong>PIR sensor always HIGH:</strong> Adjust sensitivity knob; check connections</li>
          <li><strong>No Serial output:</strong> Verify Serial Monitor baud rate (9600)</li>
          <li><strong>LED not lighting:</strong> Check resistor and LED orientation</li>
          <li><strong>Random triggers:</strong> Reduce sensitivity or shield sensor</li>
        </ul>
      </section>

      {/* Related Experiments */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Related Experiments</h2>
        <ul className="list-disc pl-5 space-y-1 paragraphText">
          <li>Use multiple PIR sensors for room coverage</li>
          <li>Connect to a buzzer instead of LED</li>
          <li>Log motion data to an SD card</li>
          <li>Trigger camera capture with motion</li>
        </ul>
      </section>

      {/* Fun Facts */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Fun Facts about PIR Sensor</h2>
        <ul className="list-disc pl-5 space-y-1 paragraphText">
          <li>PIR stands for Passive Infrared</li>
          <li>They detect changes in infrared levels, not static heat</li>
          <li>Used in automatic doors and wildlife cameras</li>
        </ul>
      </section>

      {/* Glossary */}
      <section className="sectionHeading">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Glossary of Terms</h2>
        <ul className="list-disc pl-5 space-y-1 paragraphText">
          <li><strong>PIR Sensor:</strong> Device detecting infrared radiation changes</li>
          <li><strong>VCC:</strong> Positive voltage supply</li>
          <li><strong>GND:</strong> Ground connection</li>
          <li><strong>Digital Pin:</strong> Pin reading HIGH/LOW signal</li>
          <li><strong>Serial Monitor:</strong> Tool for viewing text output from Arduino</li>
        </ul>
      </section>
    </div>
  );
}