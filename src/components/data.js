let allData= [
    {
    title: "Implementation of AMQP on Raspberry Pi",
    objective:
      "To establish a message queuing system using AMQP with RabbitMQ on a Raspberry Pi. The Raspberry Pi will act as a publisher, sending sensor data, while a client device will act as a subscriber.",
    methodology: [
      "Install RabbitMQ as the message broker on Raspberry Pi.",
      "Use Python and Pika library to publish and consume messages.",
      "Simulate sensor data using a Python script.",
    ],
    steps: [
      {
        title: "Step 1: Install RabbitMQ on Raspberry Pi",
        commands: [
          "sudo apt update",
          "sudo apt install rabbitmq-server -y",
          "sudo systemctl enable rabbitmq-server",
          "sudo systemctl start rabbitmq-server",
        ],
      },
      {
        title: "Step 2: Install Pika Library for Python",
        commands: ["pip install pika"],
      },
      {
        title: "Step 3: Create a Publisher Script on Raspberry Pi",
        description: "This script sends random temperature values as messages.",
        code: `import pika
  import random
  import time
  
  # Connection to RabbitMQ
  connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
  channel = connection.channel()
  
  # Declare a queue
  channel.queue_declare(queue='sensor_data')
  
  while True:
      temp = random.uniform(20.0, 35.0)  # Simulated temperature data
      message = f"Temperature: {temp:.2f}°C"
      
      # Publish message to queue
      channel.basic_publish(exchange='',
                            routing_key='sensor_data',
                            body=message)
      
      print(f"Sent: {message}")
      time.sleep(5)  # Send data every 5 seconds`,
      },
      {
        title: "Step 4: Create a Subscriber Script to Read Data",
        description:
          "This script will run on another device (or the same Raspberry Pi) to receive and process messages.",
        code: `import pika
  
  # Connection to RabbitMQ
  connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
  channel = connection.channel()
  
  # Declare a queue
  channel.queue_declare(queue='sensor_data')
  
  # Callback function to process received messages
  def callback(ch, method, properties, body):
      print(f"Received: {body.decode()}")
  
  # Consume messages from the queue
  channel.basic_consume(queue='sensor_data',
                        on_message_callback=callback,
                        auto_ack=True)
  
  print("Waiting for messages. Press CTRL+C to exit.")
  channel.start_consuming()`,
      },
    ],
    applications: [
      "Smart Agriculture: Send real-time sensor data to the cloud.",
      "Industrial IoT: Ensure reliable communication between IoT nodes.",
      "Home Automation: Control smart home devices via message queues.",
    ],
    futureResearchConcepts: [
      "Integrating AMQP over WebSockets for real-time browser-based monitoring.",
      "Using AMQP with AI models for predictive analytics in IoT.",
      "Combining AMQP with Blockchain for secure IoT data transmission.",
    ],
  },
  {
    title: "Implementation of Bluetooth & BLE on ESP32",
    objective:
      "To establish Bluetooth Low Energy (BLE) communication using ESP32, where ESP32 acts as a BLE server broadcasting sensor data, and a smartphone or another ESP32 acts as a BLE client.",
    methodology: [
      "Set up ESP32 as a BLE server to advertise sensor data.",
      "Connect a smartphone or another ESP32 as a BLE client to receive the data.",
      "Use Arduino IDE with the ESP32 BLE library for implementation.",
    ],
    steps: [
      {
        title: "Step 1: Install ESP32 Board in Arduino IDE",
        commands: [
          "Open Arduino IDE.",
          "Go to File → Preferences, and add the ESP32 board URL:\nhttps://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json",
          "Install the ESP32 board from Boards Manager.",
        ],
      },
      {
        title: "Step 2: Install the Required BLE Library",
        commands: [
          'Go to Sketch → Include Library → Manage Libraries, and install:\n"ESP32 BLE Arduino" by Neil Kolban.',
        ],
      },
      {
        title: "Step 3: Write Code for ESP32 BLE Server",
        description:
          "This ESP32 BLE server continuously advertises temperature sensor data.",
        code: `#include <BLEDevice.h>
  #include <BLEUtils.h>
  #include <BLEServer.h>
  
  #define SERVICE_UUID "12345678-1234-5678-1234-56789abcdef0"
  #define CHARACTERISTIC_UUID "87654321-4321-6789-4321-abcdef012345"
  
  BLEServer* pServer = NULL;
  BLECharacteristic* pCharacteristic = NULL;
  
  void setup() {
      Serial.begin(115200);
      BLEDevice::init("ESP32_BLE_Sensor");
  
      pServer = BLEDevice::createServer();
      BLEService *pService = pServer->createService(SERVICE_UUID);
      
      pCharacteristic = pService->createCharacteristic(
                          CHARACTERISTIC_UUID,
                          BLECharacteristic::PROPERTY_READ | 
                          BLECharacteristic::PROPERTY_NOTIFY
                        );
  
      pCharacteristic->setValue("Temperature: 25°C");
      pService->start();
  
      BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
      pAdvertising->addServiceUUID(SERVICE_UUID);
      pAdvertising->setScanResponse(true);
      BLEDevice::startAdvertising();
      
      Serial.println("BLE Server is running...");
  }
  
  void loop() {
      int temp = random(20, 35);  // Simulate temperature data
      String tempValue = "Temperature: " + String(temp) + "°C";
      pCharacteristic->setValue(tempValue.c_str());
      pCharacteristic->notify();
      Serial.println(tempValue);
      delay(5000);  // Update every 5 seconds
  }`,
      },
      {
        title: "Step 4: Write Code for ESP32 BLE Client",
        description:
          "This ESP32 BLE client scans for BLE devices and receives temperature data.",
        code: `#include <BLEDevice.h>
  #include <BLEUtils.h>
  #include <BLEScan.h>
  #include <BLEAdvertisedDevice.h>
  
  #define SERVICE_UUID "12345678-1234-5678-1234-56789abcdef0"
  
  void setup() {
      Serial.begin(115200);
      BLEDevice::init("");
  
      BLEScan* pBLEScan = BLEDevice::getScan();
      pBLEScan->setActiveScan(true);
      
      Serial.println("Scanning for BLE devices...");
      pBLEScan->start(10, false);
  }
  
  void loop() {
      BLEScanResults foundDevices = BLEDevice::getScan()->getResults();
      for (int i = 0; i < foundDevices.getCount(); i++) {
          BLEAdvertisedDevice device = foundDevices.getDevice(i);
          if (device.haveServiceUUID() && device.isAdvertisingService(BLEUUID(SERVICE_UUID))) {
              Serial.print("Found ESP32 BLE Server: ");
              Serial.println(device.getName().c_str());
          }
      }
      delay(5000);
  }`,
      },
    ],
    applications: [
      "Remote Sensor Monitoring: View ESP32 sensor values via BLE apps.",
      "Health & Fitness Devices: BLE for wearable sensor data transmission.",
      "Smart Home: Inter-device communication using low power BLE.",
    ],
    futureResearchConcepts: [
      "Integrate BLE with cloud platforms for IoT dashboards.",
      "Use BLE Mesh networking for broader smart home coverage.",
      "Combine BLE with AI for proximity-based automation.",
    ],
  },

  {
    title: "Implementation of Cellular Communication on Arduino using GSM Module (SIM800L)",
    objective:
      "To implement cellular communication using an Arduino and a SIM800L GSM module for IoT applications. This setup allows the Arduino to send sensor data via SMS or HTTP requests to cloud platforms.",
    methodology: [
      "Connect the SIM800L GSM module to Arduino.",
      "Use AT commands to send data via SMS or HTTP.",
      "Implement communication with cloud platforms like ThingsBoard or ThingSpeak.",
    ],
    steps: [
      {
        title: "Hardware Requirements",
        commands: [
          "Arduino Uno/Nano",
          "SIM800L GSM module",
          "SIM card (2G/3G/4G) with an active data plan",
          "Li-ion battery or 5V 2A power supply",
          "Jumper wires",
        ],
      },
      {
        title: "Connections",
        commands: [
          "SIM800L VCC → External 5V supply (4.1V–4.4V preferred)",
          "SIM800L GND → Arduino GND",
          "SIM800L TX → Arduino RX (Pin 2)",
          "SIM800L RX → Arduino TX (Pin 3)",
          "SIM800L RST → Not connected",
          "Note: Use a voltage divider or logic level shifter between Arduino TX and SIM800L RX to prevent damage.",
        ],
      },
      {
        title: "Step 1: Send SMS Using SIM800L",
        description: "Code for sending SMS via SIM800L using AT commands.",
        code: `#include <SoftwareSerial.h>
  
  SoftwareSerial sim800(2, 3);  // RX, TX
  
  void setup() {
      Serial.begin(115200);
      sim800.begin(9600);
      
      delay(1000);
      Serial.println("Initializing SIM800L...");
      
      sim800.println("AT");
      delay(1000);
      
      sim800.println("AT+CMGF=1");  // Set SMS mode
      delay(1000);
      
      sim800.println("AT+CMGS=\\"+91XXXXXXXXXX\\"");  // Replace with recipient number
      delay(1000);
      
      sim800.print("Temperature Alert! Sensor value: 30°C");
      delay(1000);
      
      sim800.write(26);  // End SMS
      Serial.println("Message Sent!");
  }
  
  void loop() {
  }`,
      },
      {
        title: "Step 2: Send Data to a Cloud Platform via HTTP",
        description: "Code for sending temperature data to ThingsBoard cloud platform via HTTP.",
        code: `#include <SoftwareSerial.h>
  
  SoftwareSerial sim800(2, 3);  // RX, TX
  
  void setup() {
      Serial.begin(115200);
      sim800.begin(9600);
      
      Serial.println("Initializing SIM800L...");
      sendCommand("AT", 1000);
      
      sendCommand("AT+SAPBR=3,1,\\"Contype\\",\\"GPRS\\"", 1000);
      sendCommand("AT+SAPBR=3,1,\\"APN\\",\\"your_apn\\"", 1000);  // Replace with your APN
      sendCommand("AT+SAPBR=1,1", 2000);
      
      sendCommand("AT+HTTPINIT", 1000);
      sendCommand("AT+HTTPPARA=\\"CID\\",1", 1000);
      sendCommand("AT+HTTPPARA=\\"URL\\",\\"http://demo.thingsboard.io/api/v1/YOUR_ACCESS_TOKEN/telemetry\\"", 1000);
      sendCommand("AT+HTTPDATA=25,10000", 1000);
      
      sim800.println("{\\"temperature\\":30}");
      delay(1000);
      
      sendCommand("AT+HTTPACTION=1", 10000);
      sendCommand("AT+HTTPTERM", 1000);
  }
  
  void loop() {}
  
  void sendCommand(String command, int timeout) {
      sim800.println(command);
      delay(timeout);
  }`,
      },
    ],
    applications: [
      "Remote Monitoring: Use SMS to alert users in areas without Wi-Fi.",
      "IoT with Cellular: Send telemetry to cloud via GSM where internet is not available.",
      "Agricultural Sensors: Use GSM to send field data like temperature and moisture.",
    ],
    futureResearchConcepts: [
      "Switch to NB-IoT or LTE-M for low-power wide-area cellular IoT.",
      "Enable MQTT over GSM for real-time lightweight communication.",
      "Integrate GPS with SIM800L to track and report device location.",
    ],
  },
  {
    title: "Implementation of CoAP on ESP32 for IoT Communication",
    objective:
      "To implement CoAP (Constrained Application Protocol) on ESP32 for lightweight, efficient IoT communication. CoAP is optimized for low-power and resource-constrained devices, making it ideal for IoT applications.",
    methodology: [
      "Set up an ESP32 with a CoAP client.",
      "Use the CoAP Simple library to communicate with a CoAP server.",
      "Send sensor data to a CoAP cloud server (e.g., CoAPthon, Eclipse Californium, or ThingsBoard).",
    ],
    steps: [
      {
        title: "Hardware Requirements",
        commands: [
          "ESP32 Development Board",
          "DHT11 or DHT22 Sensor (for temperature & humidity)",
          "Wi-Fi connectivity",
          "Jumper wires",
        ],
      },
      {
        title: "Step 1: Install Required Libraries",
        commands: [
          "Arduino IDE",
          "Install ESP32 board support (https://dl.espressif.com/dl/package_esp32_index.json)",
          "Install CoAP Simple Library",
          "Install DHT Sensor Library",
        ],
      },
      {
        title: "Step 2: CoAP Client Code for ESP32",
        description: "This code reads sensor values from DHT11 and sends it to the CoAP server every 5 seconds.",
        code: `#include <WiFi.h>
  #include <coap-simple.h>
  #include <DHT.h>
  
  #define WIFI_SSID "YourWiFiSSID"
  #define WIFI_PASSWORD "YourWiFiPassword"
  
  #define DHTPIN 4  // Pin where the DHT sensor is connected
  #define DHTTYPE DHT11
  
  DHT dht(DHTPIN, DHTTYPE);
  WiFiUDP udp;
  Coap coap(udp);
  
  void callback_response(CoapPacket &packet, IPAddress ip, int port) {
      Serial.println("Response received from CoAP Server");
  }
  
  void setup() {
      Serial.begin(115200);
      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
      
      while (WiFi.status() != WL_CONNECTED) {
          delay(500);
          Serial.print(".");
      }
      
      Serial.println("Connected to WiFi");
  
      coap.start();
      coap.response(callback_response);
  }
  
  void loop() {
      float temperature = dht.readTemperature();
      float humidity = dht.readHumidity();
  
      if (!isnan(temperature) && !isnan(humidity)) {
          String payload = "{\\"temperature\\":" + String(temperature) + ", \\"humidity\\":" + String(humidity) + "}";
  
          coap.put(IPAddress(192, 168, 1, 100), 5683, "sensor/data", payload.c_str());
          Serial.println("Data Sent: " + payload);
      } else {
          Serial.println("Failed to read from DHT sensor");
      }
  
      coap.loop();
      delay(5000); // Send data every 5 seconds
  }`,
      },
      {
        title: "Step 3: CoAP Server Setup",
        description: "Choose either a local CoAP server or a cloud-based one like ThingsBoard.",
        commands: [
          "**Option 1: Local CoAP Server (CoAPthon)**",
          "`pip install coapthon3`",
          "Run this server script in Python:",
          `from coapthon.server.coap import CoAP
  from coapthon.resources.resource import Resource
  
  class SensorResource(Resource):
      def __init__(self, name="sensor"):
          super(SensorResource, self).__init__(name)
          self.payload = "Waiting for data"
  
      def render_PUT(self, request):
          self.payload = request.payload
          print("Received Data: ", self.payload)
          return self
  
  server = CoAP(("0.0.0.0", 5683))
  server.add_resource("sensor/data/", SensorResource())
  server.listen(10)`,
          "**Option 2: Cloud CoAP Server (ThingsBoard)**",
          "Use the CoAP endpoint: `coap://demo.thingsboard.io/api/v1/YOUR_ACCESS_TOKEN/telemetry`",
          "Replace IP in ESP32 code with `demo.thingsboard.io`.",
        ],
      },
    ],
    applications: [
      "Smart Agriculture: Send real-time field data using CoAP with minimal power usage.",
      "Home Automation: Control or monitor sensors in a local network using CoAP.",
      "Industrial IoT: Use CoAP for low-bandwidth, high-efficiency telemetry.",
    ],
    futureResearchConcepts: [
      "Secure CoAP (DTLS-based) communication with ESP32.",
      "Implementing CoAP Observe for real-time push updates.",
      "Comparing CoAP vs MQTT in resource-constrained environments.",
    ],
  },
  {
    title: "Implementation of DDS (Data Distribution Service) on Jetson Nano for Real-Time IoT Communication",
    objective:
      "To implement DDS (Data Distribution Service) on Jetson Nano for high-performance, real-time IoT messaging. DDS is widely used in autonomous systems, robotics, industrial automation, and edge computing due to its low-latency, high-reliability, and decentralized architecture.",
    methodology: [
      "Install a DDS Middleware (Fast DDS or Eclipse Cyclone DDS) on Jetson Nano.",
      "Set up a DDS Publisher and Subscriber for sensor data transmission.",
      "Use Python or C++ to publish sensor data from Jetson Nano.",
      "Visualize real-time data on a remote device using DDS communication.",
    ],
    steps: [
      {
        title: "Hardware Requirements",
        commands: [
          "Jetson Nano (2GB/4GB)",
          "Raspberry Pi (for cross-device communication test, optional)",
          "Sensors (DHT11, MPU6050, etc.)",
          "Ethernet or Wi-Fi connectivity",
        ],
      },
      {
        title: "Step 1: Install Fast DDS on Jetson Nano",
        commands: [
          "Update Jetson Nano:",
          "`sudo apt update && sudo apt upgrade -y`",
          "Install dependencies:",
          "`sudo apt install -y cmake g++ python3-pip git libasio-dev libtinyxml2-dev`",
          "Clone and install Fast DDS:",
          "`git clone --recurse-submodules https://github.com/eProsima/Fast-DDS.git`",
          "`cd Fast-DDS && mkdir build && cd build`",
          "`cmake ..`",
          "`make -j$(nproc)`",
          "`sudo make install`",
        ],
      },
      {
        title: "Step 2: Configure Fast DDS",
        commands: [
          "Verify installation:",
          "`fastdds --help`",
          "Set environment variable:",
          "`export FASTRTPS_DEFAULT_PROFILES_FILE=$HOME/.fastdds/DEFAULT_FASTRTPS_PROFILES.xml`",
          "Create `DEFAULT_FASTRTPS_PROFILES.xml` file in `~/.fastdds/` with the following content:",
          `<?xml version="1.0" encoding="UTF-8"?>
  <profiles xmlns="http://www.eprosima.com/XMLSchemas/fastRTPS_Profiles">
      <participant profile_name="default_participant_profile">
          <rtps>
              <name>JetsonNano_Participant</name>
          </rtps>
      </participant>
  </profiles>`,
        ],
      },
      {
        title: "Step 3: Create DDS Publisher on Jetson Nano",
        description: "Python code for DDS Publisher that reads data from a DHT11 sensor and publishes it to the DDS network.",
        code: `import fastdds
  import time
  import Adafruit_DHT
  
  DHT_SENSOR = Adafruit_DHT.DHT11
  DHT_PIN = 4
  
  class TemperaturePublisher:
      def __init__(self):
          self.participant = fastdds.DomainParticipant(0)
          self.publisher = self.participant.create_publisher()
          self.topic = self.participant.create_topic("SensorData", fastdds.STRING_TYPE)
          self.writer = self.publisher.create_datawriter(self.topic)
  
      def publish(self):
          while True:
              humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
              if humidity is not None and temperature is not None:
                  message = f'Temperature: {temperature}°C, Humidity: {humidity}%'
                  self.writer.write(message)
                  print(f"Published: {message}")
              time.sleep(2)
  
  if __name__ == "__main__":
      pub = TemperaturePublisher()
      pub.publish()`,
      },
      {
        title: "Step 4: Create DDS Subscriber on Jetson Nano or Another Device",
        description: "Python code for DDS Subscriber that listens to the `SensorData` topic.",
        code: `import fastdds
  
  class TemperatureSubscriber:
      def __init__(self):
          self.participant = fastdds.DomainParticipant(0)
          self.subscriber = self.participant.create_subscriber()
          self.topic = self.participant.create_topic("SensorData", fastdds.STRING_TYPE)
          self.reader = self.subscriber.create_datareader(self.topic)
  
      def listen(self):
          while True:
              data = self.reader.read()
              if data:
                  print(f"Received: {data}")
  
  if __name__ == "__main__":
      sub = TemperatureSubscriber()
      sub.listen()`,
      },
      {
        title: "Step 5: Testing DDS Communication",
        commands: [
          "Run the DDS Publisher on Jetson Nano:",
          "`python3 dds_publisher.py`",
          "Run the DDS Subscriber on another Jetson Nano or Raspberry Pi:",
          "`python3 dds_subscriber.py`",
          "Verify real-time data exchange over DDS.",
        ],
      },
      {
        title: "Step 6: Visualizing Data in Real-Time",
        commands: [
          "Use Fast DDS Monitor to check real-time DDS traffic:",
          "`fastdds_monitor`",
          "Connect DDS to IoT dashboards like Grafana or ThingsBoard for visualization.",
          "Enable Quality of Service (QoS) policies for real-time reliability in edge/robotic systems.",
        ],
      },
    ],
    applications: [
      "Autonomous vehicles and robotics where low-latency communication is critical.",
      "Real-time industrial control systems over local DDS mesh networks.",
      "Smart factories using DDS for machine-to-machine (M2M) communication.",
    ],
    futureResearchConcepts: [
      "Integrating DDS with ROS2 (Robot Operating System) for real-time robotics.",
      "Implementing secure DDS with RTPS over TLS.",
      "Deploying large-scale DDS-based networks using edge clusters and Jetson nodes.",
    ],
  },
  {
    objective: "To implement LoRa/LoRaWAN communication using Arduino and the RFM95 LoRa module, enabling long-range wireless sensor data transmission to The Things Network (TTN).",
    hardwareRequirements: [
      "Arduino Uno/Nano",
      "RFM95 LoRa Module",
      "DHT11/DHT22 Sensor (Optional)",
      "Jumper Wires"
    ],
    wiring: {
      VCC: "3.3V",
      GND: "GND",
      NSS: "D10",
      MOSI: "D11",
      MISO: "D12",
      SCK: "D13",
      RST: "D9",
      DIO0: "D2",
      note: "The RFM95 module must use 3.3V logic levels, so use a logic level shifter if using a 5V Arduino."
    },
    libraries: {
      RadioHead: "Install from Library Manager",
      LMIC: "IBM LMIC Framework (for LoRaWAN)"
    },
    transmitterCode: `#include <SPI.h>
  #include <RH_RF95.h>
  
  #define RFM95_CS 10
  #define RFM95_RST 9
  #define RFM95_INT 2
  
  RH_RF95 rf95(RFM95_CS, RFM95_INT);
  
  void setup() {
      Serial.begin(115200);
      pinMode(RFM95_RST, OUTPUT);
      digitalWrite(RFM95_RST, HIGH); delay(10);
      digitalWrite(RFM95_RST, LOW); delay(10);
      digitalWrite(RFM95_RST, HIGH); delay(10);
  
      if (!rf95.init()) {
          Serial.println("LoRa init failed!");
          while (1);
      }
  
      rf95.setFrequency(915.0);
      rf95.setTxPower(23, false);
  
      Serial.println("LoRa Sender Ready.");
  }
  
  void loop() {
      const char *msg = "Hello, LoRa!";
      rf95.send((uint8_t *)msg, strlen(msg));
      rf95.waitPacketSent();
      Serial.println("Message Sent: Hello, LoRa!");
      delay(5000);
  }`,
    receiverCode: `#include <SPI.h>
  #include <RH_RF95.h>
  
  #define RFM95_CS 10
  #define RFM95_RST 9
  #define RFM95_INT 2
  
  RH_RF95 rf95(RFM95_CS, RFM95_INT);
  
  void setup() {
      Serial.begin(115200);
      pinMode(RFM95_RST, OUTPUT);
      digitalWrite(RFM95_RST, HIGH); delay(10);
      digitalWrite(RFM95_RST, LOW); delay(10);
      digitalWrite(RFM95_RST, HIGH); delay(10);
  
      if (!rf95.init()) {
          Serial.println("LoRa init failed!");
          while (1);
      }
  
      rf95.setFrequency(915.0);
      Serial.println("LoRa Receiver Ready.");
  }
  
  void loop() {
      if (rf95.available()) {
          uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
          uint8_t len = sizeof(buf);
          if (rf95.recv(buf, &len)) {
              Serial.print("Received: ");
              Serial.println((char*)buf);
          }
      }
  }`,
    ttnIntegration: {
      steps: [
        "Create a TTN account and register your device",
        "Note your Device EUI, App EUI, and App Key",
        "Install LMIC library",
      ],
      lmicCode: `#include <lmic.h>
  #include <hal/hal.h>
  #include <SPI.h>
  
  static const u1_t PROGMEM APPEUI[8] = { 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 };
  static const u1_t PROGMEM DEVEUI[8] = { 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01 };
  static const u1_t PROGMEM APPKEY[16] = { 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10 };
  
  void os_getArtEui (u1_t* buf) { memcpy(buf, APPEUI, 8); }
  void os_getDevEui (u1_t* buf) { memcpy(buf, DEVEUI, 8); }
  void os_getDevKey (u1_t* buf) { memcpy(buf, APPKEY, 16); }
  
  static osjob_t sendjob;
  
  void setup() {
      Serial.begin(115200);
      os_init();
      LMIC_reset();
  }
  
  void loop() {
      static uint8_t mydata[] = "Hello TTN!";
      LMIC_setTxData2(1, mydata, sizeof(mydata) - 1, 0);
      Serial.println("Packet sent to TTN!");
      delay(60000);
  }`,
      viewData: "TTN Console → Applications → Your Device → Live Data"
    },
    loraVsLorawan: {
      feature: ["Protocol", "Gateway Required", "Internet Connectivity", "Security"],
      lora: ["Point-to-Point", "❌ No", "❌ No", "❌ No Encryption"],
      lorawan: ["Uses Gateway & Cloud", "✅ Yes", "✅ Yes", "✅ AES-128 Encryption"]
    }
  },
  {
    objective: "To implement LWM2M communication on an ESP32 using the Eclipse Leshan client, enabling efficient device management and remote monitoring through an LWM2M server.",
    hardwareRequirements: [
      "ESP32 Development Board",
      "Wi-Fi Network",
      "PC/Laptop for running Leshan Server",
      "Optional IoT Sensors (e.g., DHT11, Temperature, Humidity)"
    ],
    step1_serverSetup: [
      "Clone the Eclipse Leshan GitHub repository.",
      "Follow the Leshan Server Setup Guide for installation on a local or cloud server.",
      "Run the Leshan server (default port: 5683)."
    ],
    step2_clientSetup: {
      environment: "Use Arduino IDE or PlatformIO to set up your ESP32 development environment.",
      libraries: ["WiFi.h", "CoAP.h (for LWM2M protocol)"],
      serverConfig: {
        code: `const char* serverAddress = "your_leshan_server_ip";\nconst int serverPort = 5683;`
      }
    },
    step3_lwm2mClientCode: {
      wifiSetup: `const char* ssid = "your_wifi_ssid";\nconst char* password = "your_wifi_password";\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(1000);\n    Serial.println("Connecting to WiFi...");\n  }\n  Serial.println("Connected to WiFi");\n}`,
      basicClientCode: `#include <WiFi.h>\n#include <CoAP.h>\n\nconst char* serverAddress = "your_leshan_server_ip";\nconst int serverPort = 5683;\nconst char* ssid = "your_wifi_ssid";\nconst char* password = "your_wifi_password";\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(1000);\n    Serial.println("Connecting to WiFi...");\n  }\n  Serial.println("Connected to WiFi");\n\n  lwm2m_client_init();\n  lwm2m_set_server_address(serverAddress, serverPort);\n}\n\nvoid loop() {\n  lwm2m_send_data();\n  delay(10000);\n}`,
      defineResources: `#include <lwm2m.h>\n\nlwm2m_resource_t temperature_resource;\nfloat temperature_value = 25.0;\n\nvoid setup() {\n  lwm2m_init();\n  lwm2m_register_resource(&temperature_resource, 3303, 0, "Temperature", &temperature_value);\n}\n\nvoid loop() {\n  lwm2m_update_resource(&temperature_resource);\n  delay(5000);\n}`
    },
    step4_communication: {
      clientSetup: `void lwm2m_client_init() {\n  lwm2m_client_init(client);\n  lwm2m_set_server_address(client, serverAddress, serverPort);\n}`,
      resourceHandling: `void lwm2m_update_resource(lwm2m_resource_t* resource) {\n  lwm2m_send_data(client, resource);\n}`
    },
    step5_monitoring: "Once ESP32 is running, the device will register with Leshan server and can be managed via the Leshan web UI or any CoAP client.",
    step6_testing: "Verify that ESP32 successfully sends data to the server. Check that the resources like temperature are visible and retrievable via UI or CoAP queries.",
    step7_security: {
      objective: "Use DTLS for secure communication between ESP32 and Leshan server.",
      code: `lwm2m_set_security_mode(client, LWM2M_SECURITY_DTLS);\nlwm2m_set_dtls_certificates(client, "client_cert.pem", "client_key.pem", "server_cert.pem");`
    }
  },
  {
    "title": "MQTT Implementation: ESP32 with PubSubClient Library",
    "slug": "mqtt-esp32-pubsubclient",
    "shortDesc": "Implement MQTT communication on ESP32 using the PubSubClient library to publish data to a broker like Mosquitto or AWS IoT.",
    "longDesc": "This tutorial explains how to implement MQTT protocol on the ESP32 development board using the PubSubClient library. You'll learn how to connect the ESP32 to a Wi-Fi network, set up a local MQTT broker (Mosquitto), configure the ESP32 as an MQTT client, and publish sensor data to the broker. The guide also covers optional AWS IoT Core integration for cloud-based communication.",
    "steps": [
      {
        "title": "Set Up MQTT Broker (Mosquitto)",
        "desc": "Install Mosquitto using `sudo apt install mosquitto mosquitto-clients` and start the service with `sudo systemctl start mosquitto`. Ensure it's running on port 1883."
      },
      {
        "title": "Install PubSubClient Library",
        "desc": "Open Arduino IDE → Sketch → Include Library → Manage Libraries → Search and install 'PubSubClient' library."
      },
      {
        "title": "Configure the MQTT Client on ESP32",
        "desc": "Include WiFi and PubSubClient libraries. Define the MQTT broker IP, port, and credentials. Add your Wi-Fi SSID and password."
      },
      {
        "title": "Set Up Wi-Fi and MQTT Client",
        "desc": "Create a `setup_wifi()` function to connect to Wi-Fi. Initialize PubSubClient with server and callback in `setup()`."
      },
      {
        "title": "Publish Data to MQTT Broker",
        "desc": "Create a `loop()` function to check MQTT connection, call `reconnect()` if needed, and publish sensor data every 10 seconds."
      },
      {
        "title": "MQTT Callback",
        "desc": "Define a `mqtt_callback()` function to handle incoming MQTT messages and print them to Serial Monitor."
      },
      {
        "title": "Monitor Data from MQTT Broker",
        "desc": "Use MQTT Explorer or MQTT.fx to subscribe to `esp32/sensorData` topic and monitor the published data in real-time."
      },
      {
        "title": "Use AWS IoT Core (Optional)",
        "desc": "Create an AWS IoT Thing, download certificates, and update the MQTT configuration in the code to connect to AWS IoT Core securely using TLS."
      }
    ],
    "components": [
      "ESP32 Development Board",
      "Wi-Fi Network",
      "MQTT Broker (Mosquitto, AWS IoT Core, or similar)",
      "Optional: Sensors (e.g., DHT11)"
    ],
    "code": [
      {
        "filename": "mqtt_esp32_pubsubclient.ino",
        "content": "#include <WiFi.h>\n#include <PubSubClient.h>\n\nconst char* ssid = \"your_wifi_ssid\";\nconst char* password = \"your_wifi_password\";\nconst char* mqtt_server = \"mqtt.eclipse.org\";\nconst char* mqtt_username = \"your_username\";\nconst char* mqtt_password = \"your_password\";\nconst int mqtt_port = 1883;\n\nWiFiClient espClient;\nPubSubClient client(espClient);\n\nvoid setup_wifi() {\n  delay(10);\n  Serial.println();\n  Serial.print(\"Connecting to WiFi...\");\n\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(1000);\n    Serial.print(\".\");\n  }\n\n  Serial.println(\"Connected to WiFi\");\n}\n\nvoid mqtt_callback(char* topic, byte* payload, unsigned int length) {\n  Serial.print(\"Message arrived on topic: \");\n  Serial.println(topic);\n  String message = \"\";\n  for (int i = 0; i < length; i++) {\n    message += (char)payload[i];\n  }\n  Serial.println(\"Message: \" + message);\n}\n\nvoid reconnect() {\n  while (!client.connected()) {\n    Serial.print(\"Attempting MQTT connection...\");\n    if (client.connect(\"ESP32Client\", mqtt_username, mqtt_password)) {\n      Serial.println(\"connected\");\n      client.subscribe(\"esp32/topic\");\n    } else {\n      Serial.print(\"failed, rc=\");\n      Serial.print(client.state());\n      Serial.println(\" try again in 5 seconds\");\n      delay(5000);\n    }\n  }\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  setup_wifi();\n  client.setServer(mqtt_server, mqtt_port);\n  client.setCallback(mqtt_callback);\n}\n\nvoid loop() {\n  if (!client.connected()) {\n    reconnect();\n  }\n  client.loop();\n  String sensorData = \"Temperature: 25.5°C\";\n  client.publish(\"esp32/sensorData\", sensorData.c_str());\n  delay(10000);\n}"
      }
    ],
    
  },
  {
    title: "MQTT Implementation: ESP32 with PubSubClient Library",
    objective: "To implement MQTT communication on an ESP32 using the PubSubClient library, enabling data publishing to an MQTT broker (e.g., Mosquitto or AWS IoT Core).",
    benefits: [
      "Lightweight messaging protocol",
      "Efficient for IoT communication",
      "Supports real-time pub/sub architecture"
    ],
    hardware: [
      "ESP32 Development Board",
      "Wi-Fi Network",
      "MQTT Broker (Mosquitto, AWS IoT Core, or similar)",
      "(Optional) Sensors (e.g., DHT11, Temperature, Humidity)"
    ],
    steps: [
      {
        step: "Set Up MQTT Broker (Mosquitto)",
        description: "Install Mosquitto and start the service. Use default port 1883 or configure broker accordingly."
      },
      {
        step: "Install the PubSubClient Library",
        description: "Install via Arduino IDE → Manage Libraries → Search 'PubSubClient'."
      },
      {
        step: "Configure MQTT Client",
        codeSnippet: `
#include <WiFi.h>
#include <PubSubClient.h>

const char* mqtt_server = "mqtt.eclipse.org";
const char* mqtt_username = "your_username";
const char* mqtt_password = "your_password";
const int mqtt_port = 1883;

const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";
        `
      },
      {
        step: "Wi-Fi & MQTT Setup",
        description: "Connect to Wi-Fi and configure MQTT client.",
        codeSnippet: `
// Wi-Fi Setup
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(1000);
}

// MQTT Reconnect
void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32Client", mqtt_username, mqtt_password)) {
      client.subscribe("esp32/topic");
    } else {
      delay(5000);
    }
  }
}
        `
      },
      {
        step: "Publish Sensor Data",
        codeSnippet: `
void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  String sensorData = "Temperature: 25.5°C";
  client.publish("esp32/sensorData", sensorData.c_str());
  delay(10000);
}
        `
      },
      {
        step: "MQTT Callback Function",
        codeSnippet: `
void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
}
        `
      },
      {
        step: "Monitor MQTT Data",
        description: "Use MQTT.fx or MQTT Explorer to subscribe and visualize data from topic esp32/sensorData."
      }
    ]
  },

  {
    title: "Wi-Fi Implementation: ESP32 using REST API for Cloud Services",
    objective: "To implement Wi-Fi communication on an ESP32, using REST API to send real-time sensor data to cloud services like ThingSpeak, AWS, or Firebase.",
    benefits: [
      "Fast data transfer",
      "Easy REST API integration",
      "Real-time monitoring via cloud"
    ],
    hardware: [
      "ESP32 Development Board",
      "Wi-Fi Network",
      "Cloud Service (e.g., ThingSpeak, Firebase, AWS)",
      "(Optional) Sensors (e.g., DHT11, Temperature, Humidity)"
    ],
    steps: [
      {
        step: "Set Up Cloud Services",
        description: "Create ThingSpeak or Firebase account and obtain API keys/URLs."
      },
      {
        step: "Install Required Libraries",
        description: "Install WiFi.h, HTTPClient.h, and optionally ArduinoJson via Arduino Library Manager."
      },
      {
        step: "Configure Wi-Fi and API Keys",
        codeSnippet: `
const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";
const String writeAPIKey = "your_thingspeak_write_api_key";
const String firebaseURL = "https://your-project-id.firebaseio.com/";
        `
      },
      {
        step: "Wi-Fi Connection Setup",
        codeSnippet: `
#include <WiFi.h>
#include <HTTPClient.h>

void setup() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(1000);
}
        `
      },
      {
        step: "Send Data to ThingSpeak",
        codeSnippet: `
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    float sensorData = 25.5;
    String url = "http://api.thingspeak.com/update?api_key=" + writeAPIKey + "&field1=" + String(sensorData);
    http.begin(url);
    int httpResponseCode = http.GET();
    http.end();
    delay(20000);
  }
}
        `
      },
      {
        step: "Send Data to Firebase (Optional)",
        codeSnippet: `
void sendToFirebase(float sensorData) {
  HTTPClient http;
  String jsonData = "{\"temperature\": " + String(sensorData) + "}";
  http.begin(firebaseURL);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(jsonData);
  http.end();
}
        `
      },
      {
        step: "Monitor Data on Cloud",
        description: "Use ThingSpeak graphs or Firebase Console → Realtime Database to view data."
      }
    ]
  },
  {
    "title": "XMPP Implementation: Raspberry Pi using SleekXMPP Library for IoT Communication",
    "objective": "To implement XMPP communication on a Raspberry Pi using the SleekXMPP library for real-time instant messaging, allowing IoT devices to exchange data instantly.",
    "why": [
      "✅ Real-Time Communication: Enables quick exchange of messages and updates.",
      "✅ Lightweight Protocol: Well-suited for IoT devices where bandwidth and power consumption are crucial.",
      "✅ Presence Information: XMPP can maintain device availability status (online/offline).",
      "✅ Scalability: Efficient for large numbers of devices in a connected IoT system."
    ],
    "hardware_requirements": [
      "Raspberry Pi (any version)",
      "Wi-Fi/Network Connection",
      "Sensors (e.g., Temperature, Humidity) – Optional",
      "XMPP Server (e.g., Openfire, ejabberd, or a public service like Jabber.org)"
    ],
    "steps": [
      {
        "title": "Install the Necessary Libraries",
        "description": "Install SleekXMPP and required dependencies on Raspberry Pi.",
        "commands": [
          "sudo apt-get update",
          "sudo apt-get install python3 python3-pip",
          "pip install sleekxmpp",
          "sudo apt-get install libxml2-dev libxslt-dev"
        ]
      },
      {
        "title": "Set Up the XMPP Server",
        "description": "Use a public XMPP server like Jabber.org or host a private one using Openfire or ejabberd.",
        "options": [
          "Create user account with username/password on public server",
          "Set up Openfire/ejabberd for private control"
        ]
      },
      {
        "title": "Create an XMPP Client on Raspberry Pi",
        "description": "Use SleekXMPP in Python to connect and send messages.",
        "code_sample": "import sleekxmpp\nclass XmppClient(sleekxmpp.ClientXMPP):\n    # Connect, send messages, and handle responses\n    pass"
      },
      {
        "title": "Send Sensor Data to the XMPP Server",
        "description": "Read sensor data from DHT22 and send via XMPP.",
        "code_sample": "import Adafruit_DHT\n# Read temperature and send as message"
      },
      {
        "title": "Monitor Data",
        "description": "Use an XMPP client to view messages sent from the Raspberry Pi in real time."
      },
      {
        "title": "Advanced Features (Optional)",
        "features": [
          "Presence Status: Show device availability.",
          "Group Messaging: Broadcast to multiple recipients or chatrooms.",
          "Message Encryption: Secure communication.",
          "Data Logging: Store received data in a database."
        ]
      }
    ]
  }
  
  
]
  
  
  export default allData
