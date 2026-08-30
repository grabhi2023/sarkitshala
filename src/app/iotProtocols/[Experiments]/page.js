import dynamic from 'next/dynamic';
import allData from '@/components/data';

const CodeBox = dynamic(() => import('@/components/code.jsx'));


function LoRaExperimentCom({ data }) {
  return (
    <div  className="articleContainer w-[90%]">
      <h1 >LoRa/LoRaWAN Communication</h1>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 >Objective</h2>
        <p className="">{data.objective}</p>
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 >Hardware Requirements</h2>
        <ul className="list-disc list-inside ">
          {data.hardwareRequirements.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 >Wiring</h2>
        <ul className="list-disc list-inside ">
          {Object.entries(data.wiring).map(([key, value]) => (
            key !== 'note' ? <li key={key}>{key} → {value}</li> : null
          ))}
        </ul>
        <p className="text-sm mt-2 italic">{data.wiring.note}</p>
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Libraries</h2>
        <ul className="list-disc list-inside ">
          {Object.entries(data.libraries).map(([lib, note]) => (
            <li key={lib}><strong>{lib}</strong>: {note}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Transmitter Code</h2>
        <CodeBox code={data.transmitterCode.trim()} language="cpp" />
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Receiver Code</h2>
        <CodeBox code={data.receiverCode.trim()} language="cpp" />
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">TTN Integration</h2>
        <ul className="list-decimal list-inside p mb-4">
          {data.ttnIntegration.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
        <h3 className="text-lg font-semibold mb-2">LMIC Code</h3>
        <CodeBox code={data.ttnIntegration.lmicCode.trim()} language="cpp" />
        <p className="mt-2 -600">View data on: <strong>{data.ttnIntegration.viewData}</strong></p>
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">LoRa vs LoRaWAN</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-collapse border-gray-300 text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                {data.loraVsLorawan.feature.map((heading, idx) => (
                  <th key={idx} className="border px-4 py-2">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {data.loraVsLorawan.lora.map((val, idx) => (
                  <td key={idx} className="border px-4 py-2">{val}</td>
                ))}
              </tr>
              <tr>
                {data.loraVsLorawan.lorawan.map((val, idx) => (
                  <td key={idx} className="border px-4 py-2">{val}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
function Lwm2mExperimentCom({ data }) {
  return (
    <div className="articleContainer w-[90%]">
      <h1 className="text-3xl font-bold text-center mb-6">LWM2M with ESP32 using Eclipse Leshan</h1>

      
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Objective</h2>
        <p className="p">{data.objective}</p>
      </section>

      {/* Hardware Requirements */}
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Hardware Requirements</h2>
        <ul className="list-disc list-inside ">
          {data.hardwareRequirements.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Step 1: Server Setup */}
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Step 1: Leshan Server Setup</h2>
        <ul className="list-decimal list-inside ">
          {data.step1_serverSetup.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </section>

      {/* Step 2: Client Setup */}
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Step 2: ESP32 Client Setup</h2>
        <p><strong>Environment:</strong> {data.step2_clientSetup.environment}</p>
        <h3 className="font-semibold mt-2">Required Libraries</h3>
        <ul className="list-disc list-inside ">
          {data.step2_clientSetup.libraries.map((lib, idx) => (
            <li key={idx}>{lib}</li>
          ))}
        </ul>
        <h3 className="font-semibold mt-2">Server Configuration</h3>
        <CodeBox code={data.step2_clientSetup.serverConfig.code.trim()} language="cpp" />
      </section>

      {/* Step 3: LWM2M Client Code */}
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Step 3: LWM2M Client Code</h2>
        <h3 className="font-semibold mt-2">WiFi Setup</h3>
        <CodeBox code={data.step3_lwm2mClientCode.wifiSetup.trim()} language="cpp" />
        <h3 className="font-semibold mt-2">Basic Client Code</h3>
        <CodeBox code={data.step3_lwm2mClientCode.basicClientCode.trim()} language="cpp" />
        <h3 className="font-semibold mt-2">Define Resources</h3>
        <CodeBox code={data.step3_lwm2mClientCode.defineResources.trim()} language="cpp" />
      </section>

      {/* Step 4: Communication Setup */}
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Step 4: LWM2M Communication Functions</h2>
        <h3 className="font-semibold mt-2">Client Init</h3>
        <CodeBox code={data.step4_communication.clientSetup.trim()} language="cpp" />
        <h3 className="font-semibold mt-2">Resource Handling</h3>
        <CodeBox code={data.step4_communication.resourceHandling.trim()} language="cpp" />
      </section>

      {/* Step 5: Monitoring */}
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Step 5: Monitoring</h2>
        <p className="">{data.step5_monitoring}</p>
      </section>

      {/* Step 6: Testing */}
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Step 6: Testing</h2>
        <p className="">{data.step6_testing}</p>
      </section>

      {/* Step 7: Security */}
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Step 7: Security Configuration</h2>
        <p className=""><strong>Objective:</strong> {data.step7_security.objective}</p>
        <CodeBox code={data.step7_security.code.trim()} language="cpp" />
      </section>
    </div>
  );
}
function ProtocolsCom({ data }) {
  return (
    <div className="articleContainer mt-14 w-[80%] md:mt-10 md:ml-0">
      <h1 className="text-3xl font-bold text-center mb-6 ">{data.title}</h1>

      <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Objective</h2>
        <p className="">{data.objective}</p>
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Methodology</h2>
        <ul className="list-disc list-inside ">
          {data.methodology.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Implementation Steps</h2>
        {data.steps.map((step, idx) => (
          <div
            key={idx}
            className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
            {step.description && (
              <p className="mb-3 ">{step.description}</p>
            )}
            {step.commands && (
              <CodeBox code={step.commands.join('\n')} language="bash" />
            )}
            {step.code && <CodeBox code={step.code} language="python" />}
          </div>
        ))}
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Applications</h2>
        <ul className="list-disc list-inside ">
          {data.applications.map((app, idx) => (
            <li key={idx}>{app}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Future Research Concepts</h2>
        <ul className="list-disc list-inside ">
          {data.futureResearchConcepts.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
function WifiEsp32RestApi({ data }) {
  return (
    <div className="articleContainer w-[90%]">
      <h1 className="text-3xl font-bold mb-2 text-center">{data.title}</h1>
      <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
      <p className="-600 mb-6">{data.objective}</p>
</section>
 <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Benefits</h2>
      <ul className="list-disc list-inside mb-6">
        {data.benefits.map((benefit, index) => (
          <li key={index} className="mb-1">{benefit}</li>
        ))}
      </ul>
      </section>
 <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Required Hardware</h2>
      <ul className="list-disc list-inside mb-6">
        {data.hardware.map((item, index) => (
          <li key={index} className="mb-1">{item}</li>
        ))}
      </ul>
      </section>
 <section className="mb-6 p-4 rounded-lg border border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Steps</h2>
      <ol className="list-decimal list-inside mb-6 space-y-6">
        {data.steps.map((step, index) => (
          <li key={index}>
            <strong>{step.step}</strong>
            {step.description && <p className="ml-4">{step.description}</p>}
            {step.codeSnippet && (
              <div className="mt-2 ml-4">
                <CodeBox code={step.codeSnippet.trim()} language="cpp" />
              </div>
            )}
          </li>
        ))}
      </ol>
      </section>
    </div>
  );
}




function MqttEsp32PubSubClient  ({data}) {
  return (
    <div className="articleContainer w-[90%]">
      <h1 className="text-3xl font-bold mb-2 text-center">{data.title}</h1>
      <p className="-600 mb-6">{data.shortDesc}</p>

      <h2 className="text-xl font-semibold mb-2">Description</h2>
      <p className="mb-6">{data.longDesc}</p>

      <h2 className="text-xl font-semibold mb-2">Required Components</h2>
      <ul className="list-disc list-inside mb-6">
        {data.components.map((item, index) => (
          <li key={index} className="mb-1">{item}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Steps</h2>
      <ol className="list-decimal list-inside mb-6 space-y-4">
        {data.steps.map((step, index) => (
          <li key={index}>
            <strong>{step.title}</strong>
            <p className="ml-4">{step.desc}</p>
          </li>
        ))}
      </ol>

      <h2 className="text-xl font-semibold mb-2">Code: {data.code[0].filename}</h2>
     
        <CodeBox code={data.code[0].content} language={'cpp'}/>
      
    </div>
  );
};




function XmppRaspberryPiSleekxmpp() {
  return (
    <div  className="articleContainer w-[90%]">
      <h1 className="text-3xl font-bold mb-2 text-center">
        XMPP Implementation: Raspberry Pi using SleekXMPP Library for IoT Communication
      </h1>
      <p className="-600 mb-6">
        To implement XMPP communication on a Raspberry Pi using the SleekXMPP library for real-time instant messaging, allowing IoT devices to exchange data instantly.
      </p>

      <h2 className="text-xl font-semibold mb-2">Why Use XMPP?</h2>
      <ul className="list-disc list-inside mb-6">
        <li className="mb-1"> Real-Time Communication: Enables quick exchange of messages and updates.</li>
        <li className="mb-1">Lightweight Protocol: Well-suited for IoT devices where bandwidth and power consumption are crucial.</li>
        <li className="mb-1">Presence Information: XMPP can maintain device availability status (online/offline).</li>
        <li className="mb-1">Scalability: Efficient for large numbers of devices in a connected IoT system.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Hardware Requirements</h2>
      <ul className="list-disc list-inside mb-6">
        <li className="mb-1">Raspberry Pi (any version)</li>
        <li className="mb-1">Wi-Fi/Network Connection</li>
        <li className="mb-1">Sensors (e.g., Temperature, Humidity) – Optional</li>
        <li className="mb-1">XMPP Server (e.g., Openfire, ejabberd, or a public service like Jabber.org)</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Steps</h2>
      <ol className="list-decimal list-inside mb-6 space-y-6">
        <li>
          <strong>Install the Necessary Libraries</strong>
          <p className="ml-4">Install SleekXMPP and required dependencies on Raspberry Pi.</p>
          <div className="mt-2 ml-4">
            <CodeBox
              code={`sudo apt-get update\nsudo apt-get install python3 python3-pip\npip install sleekxmpp\nsudo apt-get install libxml2-dev libxslt-dev`}
              language="bash"
            />
          </div>
        </li>

        <li>
          <strong>Set Up the XMPP Server</strong>
          <p className="ml-4">Use a public XMPP server like Jabber.org or host a private one using Openfire or ejabberd.</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Create user account with username/password on public server</li>
            <li>Set up Openfire/ejabberd for private control</li>
          </ul>
        </li>

        <li>
          <strong>Create an XMPP Client on Raspberry Pi</strong>
          <p className="ml-4">Use SleekXMPP in Python to connect and send messages.</p>
          <div className="mt-2 ml-4">
            <CodeBox
              code={`import sleekxmpp\nclass XmppClient(sleekxmpp.ClientXMPP):\n    # Connect, send messages, and handle responses\n    pass`}
              language="python"
            />
          </div>
        </li>

        <li>
          <strong>Send Sensor Data to the XMPP Server</strong>
          <p className="ml-4">Read sensor data from DHT22 and send via XMPP.</p>
          <div className="mt-2 ml-4">
            <CodeBox
              code={`import Adafruit_DHT\n# Read temperature and send as message`}
              language="python"
            />
          </div>
        </li>

        <li>
          <strong>Monitor Data</strong>
          <p className="ml-4">Use an XMPP client to view messages sent from the Raspberry Pi in real time.</p>
        </li>

        <li>
          <strong>Advanced Features (Optional)</strong>
          <ul className="list-disc ml-6 mt-2">
            <li>Presence Status: Show device availability.</li>
            <li>Group Messaging: Broadcast to multiple recipients or chatrooms.</li>
            <li>Message Encryption: Secure communication.</li>
            <li>Data Logging: Store received data in a database.</li>
          </ul>
        </li>
      </ol>
    </div>
  );
}





export default async function Page({ params }) {
  const { Experiments } = params;

 
  const experimentMap = {
    amqp: allData[0],
    bluetooth: allData[1],
    gsm: allData[2],
    coap: allData[3],
    dds: allData[4],
  
   
  };

  const selectedData = experimentMap[Experiments];
if(Experiments=='lorawan')
{
  return <LoRaExperimentCom data={allData[5]} />;
}
if(Experiments=='lwm2m')
  {
    return <Lwm2mExperimentCom data={allData[6]} />;
  }
  if(Experiments=='mqtt')
    {
      return <MqttEsp32PubSubClient data={allData[7]}/>;
    }
    if(Experiments=='wifi')
      {
        return <WifiEsp32RestApi data={allData[9]}/>;
      }
      if(Experiments=='xmpp')
        {
          return <XmppRaspberryPiSleekxmpp />;
        }
  if (!selectedData) {
    return <div className="text-center py-10">Experiment not found.</div>;
  }

  return <ProtocolsCom data={selectedData} />;
}
