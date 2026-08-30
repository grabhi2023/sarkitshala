let res=[

    `import RPi.GPIO as GPIO
import time

LED_PIN = 17  # GPIO pin connected to the LED

# Setup GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)

try:
    while True:
        # Turn on the LED
        GPIO.output(LED_PIN, GPIO.HIGH)
        time.sleep(1)  # Wait for 1 second

        # Turn off the LED
        GPIO.output(LED_PIN, GPIO.LOW)
        time.sleep(1)  # Wait for 1 second

except KeyboardInterrupt:
    # Clean up GPIO on keyboard interrupt (Ctrl+C)
    GPIO.cleanup()
`,
  
  `import RPi.GPIO as GPIO
import time

# Define LCD pin mapping (adjust based on your LCD module)
LCD_RS = 25
LCD_E = 24
LCD_D4 = 23
LCD_D5 = 17
LCD_D6 = 18
LCD_D7 = 22

# Define LCD dimensions (number of columns and rows)
LCD_COLUMNS = 16
LCD_ROWS = 2

# Initialize GPIO and LCD
def lcd_init():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(LCD_RS, GPIO.OUT)
    GPIO.setup(LCD_E, GPIO.OUT)
    GPIO.setup(LCD_D4, GPIO.OUT)
    GPIO.setup(LCD_D5, GPIO.OUT)
    GPIO.setup(LCD_D6, GPIO.OUT)
    GPIO.setup(LCD_D7, GPIO.OUT)

    # Initialize LCD to 4-bit mode and clear the display
    lcd_send_command(0x33)  # Initialize
    lcd_send_command(0x32)  # Set to 4-bit mode
    lcd_send_command(0x28)  # 2 lines, 5x8 font
    lcd_send_command(0x0C)  # Display on, cursor off, blink off
    lcd_send_command(0x01)  # Clear display
    time.sleep(0.002)

# Send a command to the LCD
def lcd_send_command(command):
    GPIO.output(LCD_RS, GPIO.LOW)  # Set RS to 0 for command mode
    lcd_write(command >> 4)  # Send the higher nibble
    lcd_write(command & 0x0F)  # Send the lower nibble

# Write data to the LCD (4-bit mode)
def lcd_write(data):
    GPIO.output(LCD_D4, GPIO.HIGH if (data & 0x01) else GPIO.LOW)
    GPIO.output(LCD_D5, GPIO.HIGH if (data & 0x02) else GPIO.LOW)
    GPIO.output(LCD_D6, GPIO.HIGH if (data & 0x04) else GPIO.LOW)
    GPIO.output(LCD_D7, GPIO.HIGH if (data & 0x08) else GPIO.LOW)
    lcd_toggle_enable()

# Toggle the enable pin to send data to the LCD
def lcd_toggle_enable():
    GPIO.output(LCD_E, GPIO.HIGH)
    time.sleep(0.0005)
    GPIO.output(LCD_E, GPIO.LOW)
    time.sleep(0.0005)

# Display text on the LCD
def lcd_display_text(text):
    lcd_send_command(0x01)  # Clear display
    time.sleep(0.002)
    
    for char in text:
        GPIO.output(LCD_RS, GPIO.HIGH)  # Set RS to 1 for data mode
        lcd_write(ord(char) >> 4)  # Send higher nibble
        lcd_write(ord(char) & 0x0F)  # Send lower nibble

# Main program
try:
    lcd_init()  # Initialize the LCD
    lcd_display_text("Hello, Raspberry Pi!")  # Display text on LCD
    time.sleep(2)  # Wait for 2 seconds
    lcd_display_text("LCD Display Test")  # Display more text
    while True:
        pass  # Keep the script running to keep the LCD on

except KeyboardInterrupt:
    GPIO.cleanup()  # Clean up GPIO settings on Ctrl+C
`,

    `
import RPi.GPIO as GPIO
import time

# Define GPIO pins connected to L293D motor driver
MOTOR_ENA = 17
MOTOR_IN1 = 18
MOTOR_IN2 = 27

# Setup GPIO mode and pins
GPIO.setmode(GPIO.BCM)
GPIO.setup(MOTOR_ENA, GPIO.OUT)
GPIO.setup(MOTOR_IN1, GPIO.OUT)
GPIO.setup(MOTOR_IN2, GPIO.OUT)

# Create a PWM object for motor speed control
motor_pwm = GPIO.PWM(MOTOR_ENA, 1000)  # Frequency = 1000 Hz
motor_pwm.start(0)  # Initialize with 0% duty cycle (motor off)

# Function to control motor direction and speed
def control_motor(direction, speed):
    # Set direction of the motor
    if direction == 'forward':
        GPIO.output(MOTOR_IN1, GPIO.HIGH)
        GPIO.output(MOTOR_IN2, GPIO.LOW)
    elif direction == 'backward':
        GPIO.output(MOTOR_IN1, GPIO.LOW)
        GPIO.output(MOTOR_IN2, GPIO.HIGH)
    else:
        print("Invalid direction")
        return
    
    # Set PWM duty cycle for motor speed (0-100%)
    motor_pwm.ChangeDutyCycle(speed)

# Stop motor function
def stop_motor():
    motor_pwm.ChangeDutyCycle(0)  # Stop the motor
    GPIO.output(MOTOR_IN1, GPIO.LOW)
    GPIO.output(MOTOR_IN2, GPIO.LOW)

# Main program loop
try:
    while True:
        # Control motor forward with 50% speed
        print("Motor Forward")
        control_motor('forward', 50)
        time.sleep(2)
        
        # Stop motor
        print("Stopping Motor")
        stop_motor()
        time.sleep(1)

        # Control motor backward with 75% speed
        print("Motor Backward")
        control_motor('backward', 75)
        time.sleep(2)
        
        # Stop motor
        print("Stopping Motor")
        stop_motor()
        time.sleep(1)

except KeyboardInterrupt:
    # Clean up GPIO pins on exit
    print("Exiting Program")
    stop_motor()
    GPIO.cleanup()
                        
    
    `,
    `
from machine import Pin, time_pulse_us
from time import sleep

# Define GPIO pins
TRIG_PIN = Pin(15, Pin.OUT)  # Trigger pin
ECHO_PIN = Pin(14, Pin.IN)   # Echo pin

# Function to measure distance
def measure_distance():
    # Ensure the trigger pin is low
    TRIG_PIN.value(0)
    sleep(0.002)  # Wait for 2ms to stabilize
    
    # Send a 10us pulse to the trigger pin
    TRIG_PIN.value(1)
    sleep(0.00001)  # 10 microseconds
    TRIG_PIN.value(0)
    
    # Measure the echo pulse duration
    pulse_duration = time_pulse_us(ECHO_PIN, 1, 30000)  # Timeout after 30ms

    if pulse_duration < 0:  # Handle timeout
        return None
    
    # Calculate distance (speed of sound is 343 m/s or 0.0343 cm/us)
    distance = (pulse_duration * 0.0343) / 2  # Divide by 2 for round trip
    return distance

# Main program loop
while True:
    distance = measure_distance()
    if distance is not None:
        print(f"Distance: {distance:.2f} cm")
    else:
        print("Out of range")
    sleep(1)  # Wait for 1 second before the next measurement
  
    `,
    `
from machine import Pin
from time import sleep
from dht import DHT22, DHT11  # Import DHT classes

# Create a DHT object
# Use DHT11 for DHT11 sensor or DHT22 for DHT22 sensor
dht = DHT11(Pin(15))  # Replace with DHT22(Pin(15)) if you're using DHT22

# Continuously get sensor readings while the board has power
while True:
    try:
        # Get sensor readings
        dht.measure()
        temp = dht.temperature()  # Get temperature in Celsius
        hum = dht.humidity()      # Get humidity percentage

        # Display the values to the console
        print(f"Temperature: {temp}°C   Humidity: {hum}%")
    
    except Exception as e:
        print(f"Error reading sensor: {e}")
    
    # Delay of 2 seconds, because DHT sensors have a minimum sampling interval
    sleep(2)

    `,
    `
import RPi.GPIO as GPIO
import time

# Define GPIO pin number for Pulse Sensor
PULSE_SENSOR_PIN = 18

# Setup GPIO
def setup_gpio():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(PULSE_SENSOR_PIN, GPIO.IN)

# Function to calculate the pulse rate (beats per minute)
def get_pulse_rate(duration=10):
    pulse_count = 0
    last_state = GPIO.input(PULSE_SENSOR_PIN)
    start_time = time.time()

    while time.time() - start_time < duration:
        current_state = GPIO.input(PULSE_SENSOR_PIN)
        
        if current_state != last_state and current_state == GPIO.HIGH:  # Count only rising edges
            pulse_count += 1
            last_state = current_state

    # Convert pulse count to beats per minute (BPM)
    pulse_rate = (pulse_count / duration) * 60
    return pulse_rate

# Main function to run the pulse rate measurement
try:
    setup_gpio()
    print("Pulse Sensor Initialized. Measure your pulse...")

    while True:
        pulse_rate = get_pulse_rate(duration=10)  # Measure over 10 seconds
        print(f"Pulse Rate: {pulse_rate:.2f} BPM")  # Display pulse rate with 2 decimal places
        time.sleep(1)  # Pause for a second before the next reading

except KeyboardInterrupt:
    print("Program interrupted. Cleaning up...")
    GPIO.cleanup()  # Clean up GPIO settings before exiting
  `,
    `
import RPi.GPIO as GPIO
import time

# Define the GPIO pin where the PIR sensor is connected
PIR_SENSOR_PIN = 17

# Setup GPIO mode and pin
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIR_SENSOR_PIN, GPIO.IN)

# Function to handle motion detection
def motion_detected(channel):
    print("Motion detected!")

# Attach event detection to the PIR sensor pin
GPIO.add_event_detect(PIR_SENSOR_PIN, GPIO.RISING, callback=motion_detected)

try:
    print("PIR Sensor Test (Press CTRL+C to exit)")
    time.sleep(2)  # Allow the PIR sensor to stabilize
    print("Ready to detect motion")

    # Infinite loop to keep the script running
    while True:
        time.sleep(1)  # Keep the loop running at 1-second intervals
except KeyboardInterrupt:
    print("Program terminated by user")
    GPIO.cleanup()  # Clean up the GPIO settings

 `,
   
]
let esp=[
    `
 #include <DHT.h>   // Include the DHT sensor library

// Define the pin and type of the DHT sensor
#define DHTPIN 4     // Pin where the DHT sensor is connected
#define DHTTYPE DHT22  // DHT 22 (AM2302), change this to DHT11 or DHT21 if you're using those

// Initialize the DHT sensor
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);  // Start the serial communication
  Serial.println(F("DHTxx test!"));
  dht.begin();  // Initialize the DHT sensor
}

void loop() {
  // Wait a few seconds between measurements
  delay(2000);  // Delay to allow the sensor time to stabilize
  
  // Reading humidity and temperature (Celsius by default)
  float h = dht.readHumidity();  
  float t = dht.readTemperature();  // Temperature in Celsius
  float f = dht.readTemperature(true);  // Temperature in Fahrenheit

  // Check if any reads failed and exit early if so
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Compute heat index in Fahrenheit and Celsius
  float hif = dht.computeHeatIndex(f, h);  // Heat index in Fahrenheit
  float hic = dht.computeHeatIndex(t, h, false);  // Heat index in Celsius

  // Output the sensor readings to the serial monitor
  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  Serial.print(f);
  Serial.print(F("°F  Heat index: "));
  Serial.print(hic);
  Serial.print(F("°C "));
  Serial.print(hif);
  Serial.println(F("°F"));
}
   `
    ,
    `
const int trigPin = 5;      // Trigger pin of the ultrasonic sensor
const int echoPin = 18;     // Echo pin of the ultrasonic sensor

// Define sound speed in cm/us
#define SOUND_SPEED 0.034  // Speed of sound in cm/us (at 20°C)
#define CM_TO_INCH 0.393701  // Conversion factor from cm to inches

long duration;              // Variable to store the duration of the pulse
float distanceCm;           // Variable to store the calculated distance in cm
float distanceInch;         // Variable to store the calculated distance in inches

void setup() {
  Serial.begin(115200);      // Start the serial communication at 115200 baud rate

  pinMode(trigPin, OUTPUT);  // Set the trigPin as an Output
  pinMode(echoPin, INPUT);   // Set the echoPin as an Input
}

void loop() {
  // Clears the trigPin to ensure the pulse is clean
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);  // Small delay for stability

  // Sets the trigPin on HIGH state for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);  // Pulse width is 10 microseconds
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  // Calculate the distance in centimeters using the sound speed
  distanceCm = duration * SOUND_SPEED / 2;

  // Convert the distance to inches
  distanceInch = distanceCm * CM_TO_INCH;

  // Print the distance in the Serial Monitor
  Serial.print("Distance (cm): ");
  Serial.println(distanceCm);   // Print distance in centimeters

  Serial.print("Distance (inch): ");
  Serial.println(distanceInch);  // Print distance in inches

  delay(1000);  // Wait for 1 second before taking the next measurement
}
 `,
    `
  #define DO_PIN 13  // ESP32's GPIO13 pin connected to DO pin of the flame sensor

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Initialize the ESP32's pin as an input
  pinMode(DO_PIN, INPUT);
}

void loop() {
  // Read the state of the flame sensor
  int flame_state = digitalRead(DO_PIN);
  
  // Check if the flame sensor is triggered
  if (flame_state == HIGH) {
    // No flame detected (sensor output HIGH means no flame)
    Serial.println("No flame detected => The fire is NOT detected");
  } else {
    // Flame detected (sensor output LOW means flame detected)
    Serial.println("Flame detected => The fire is detected");
  }

  delay(1000);  // Wait for 1 second before checking again
}
 `,
    `
int led = 36;            // Define pin for the LED
int sound_digital = 2;   // Define pin for the digital sound sensor
int sound_analog = 4;    // Define pin for the analog sound sensor

void setup() {
  // Initialize serial communication
  Serial.begin(9600);

  // Initialize LED pin as an output
  pinMode(led, OUTPUT);

  // Initialize sound sensor pins
  pinMode(sound_digital, INPUT);  // Digital sound sensor pin
}

void loop() {
  // Read the digital value from the sound sensor
  int val_digital = digitalRead(sound_digital);

  // Read the analog value from the sound sensor
  int val_analog = analogRead(sound_analog);

  // Print the analog and digital sensor values to the serial monitor
  Serial.print(val_analog);
  Serial.print("\t");
  Serial.println(val_digital);

  // If sound is detected (digital pin is HIGH), turn on the LED
  if (val_digital == HIGH) {
    digitalWrite(led, HIGH);  // Turn on the LED
    delay(3000);              // Keep the LED on for 3 seconds
    digitalWrite(led, LOW);   // Turn off the LED after 3 seconds
  }

  delay(100);  // Small delay to avoid overloading the serial output
}

    `,
    `
#define potentiometerPin 34  // Analog pin for potentiometer

void setup() {
  Serial.begin(115200);       // Start serial communication
}

void loop() {
  int potentiometerValue = analogRead(potentiometerPin);  // Read potentiometer value (0-4095)
  Serial.print("Potentiometer Value: ");
  Serial.println(potentiometerValue);
  delay(100);  // Small delay to avoid flooding the serial monitor
}

    `,
    `
   #include <IRremote.h>  // Include IRremote library

const int RECV_PIN = 15;  // Define the pin where the IR receiver is connected (GPIO 15)
IRrecv irrecv(RECV_PIN);  // Create an IR receiver object
decode_results results;  // Variable to hold the decoded IR signal

void setup() {
  Serial.begin(9600);    // Start serial communication at 9600 baud
  irrecv.enableIRIn();   // Start the IR receiver
}

void loop() {
  if (irrecv.decode(&results)) {  // Check if we have received a signal
    Serial.println(results.value, HEX);  // Print the received value in hexadecimal format
    irrecv.resume();  // Receive the next value
  }
}
    `,
    `
 #include <ESP32Servo.h>  // Include the ESP32Servo library

Servo myservo;  // Create a servo object to control a servo

int pos = 0;     // Variable to store the servo position
int servoPin = 13;  // Define the servo pin (pin 13)

void setup() {
  myservo.setPeriodHertz(50);  // Set the servo frequency to 50 Hz (standard for servos)
  myservo.attach(servoPin, 500, 2400);  // Attach the servo on pin 13 with pulse width from 500us to 2400us
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (pos = 0; pos <= 180; pos += 1) {  // Move from 0 to 180 degrees in steps of 1 degree
    myservo.write(pos);  // Move servo to position 'pos'
    delay(15);            // Wait 15ms to allow the servo to reach the position
  }

  // Sweep back from 180 to 0 degrees
  for (pos = 180; pos >= 0; pos -= 1) {  // Move from 180 to 0 degrees in steps of 1 degree
    myservo.write(pos);  // Move servo to position 'pos'
    delay(15);            // Wait 15ms to allow the servo to reach the position
  }
}
   `
]
  
let ard=[
`
 void setup()
     { 
    pinMode(13, OUTPUT);
     // Set pin 13 as an output 
     } 
     void loop() 
     {
      digitalWrite(13, HIGH); 
      delay(1000);          
      digitalWrite(13, LOW);
      delay(1000);      
                  
      } 

`,
`
   int A= 3; 
   int B= 4; 
   int C= 5;
   int D= 6; 
   int E= 7; 
   int F= 8; 
   int G= 9; 
   int X= 13; 
   int Y= 12;  
   int Z= 11; 
   void setup() 
   { 
    pinMode(A,OUTPUT); 
    pinMode(B,OUTPUT); 
    pinMode(C,OUTPUT); 
    pinMode(D,OUTPUT); 
    pinMode(E,OUTPUT); 
    pinMode(F,OUTPUT);
    pinMode(G,OUTPUT); 
    pinMode(X,OUTPUT); 
    pinMode(Y,OUTPUT); 
    pinMode(Z,OUTPUT); 
      } 
    void loop()
    { 
      digitalWrite(A,HIGH); 
      digitalWrite(B,HIGH);
      digitalWrite(C,HIGH);
      digitalWrite(D,HIGH);
      digitalWrite(E,HIGH);
      digitalWrite(F,HIGH); 
      digitalWrite(G,LOW);
      digitalWrite(X,HIGH);
      digitalWrite(Y,LOW); 
      digitalWrite(Z,LOW);  
      delay(2000); 
      digitalWrite(A,LOW); 
      digitalWrite(B,HIGH);
      digitalWrite(C,HIGH);
      digitalWrite(D,LOW);
      digitalWrite(E,LOW); 
      digitalWrite(F,LOW); 
      digitalWrite(G,LOW); 
      digitalWrite(X,HIGH); 
      digitalWrite(Y,LOW); 
      digitalWrite(Z,LOW); 
      delay(2000); 
      digitalWrite(A,HIGH); 
      digitalWrite(B,HIGH); 
      digitalWrite(C,LOW); 
      digitalWrite(D,HIGH); 
      digitalWrite(E,HIGH); 
      digitalWrite(F,LOW); 
      digitalWrite(G,HIGH); 
      digitalWrite(X,HIGH); 
      digitalWrite(Y,LOW); 
      digitalWrite(Z,LOW); 
      delay(2000); 
      digitalWrite(A,HIGH); 
      digitalWrite(B,HIGH); 
      digitalWrite(C,HIGH); 
      digitalWrite(D,HIGH); 
      digitalWrite(E,LOW); 
      digitalWrite(F,LOW); 
      digitalWrite(G,HIGH); 
      digitalWrite(X,LOW); 
      digitalWrite(Y,HIGH); 
      digitalWrite(Z,LOW); 
      delay(2000); 
      digitalWrite(A,LOW); 
      digitalWrite(B,HIGH); 
      digitalWrite(C,HIGH); 
      digitalWrite(D,LOW); 
      digitalWrite(E,LOW); 
      digitalWrite(F,HIGH); 
      digitalWrite(G,HIGH); 
      digitalWrite(X,LOW); 
      digitalWrite(Y,HIGH); 
      digitalWrite(Z,LOW); 
      delay(2000); 
      digitalWrite(A,HIGH); 
      digitalWrite(B,LOW); 
      digitalWrite(C,HIGH); 
        
      digitalWrite(D,HIGH); 
      digitalWrite(E,LOW);
      digitalWrite(F,HIGH); 
      digitalWrite(G,HIGH); 
      digitalWrite(X,LOW); 
      digitalWrite(Y,HIGH); 
      digitalWrite(Z,LOW); 
      delay(2000); 
      digitalWrite(A,HIGH); 
      digitalWrite(B,LOW); 
      digitalWrite(C,HIGH); 
      digitalWrite(D,HIGH); 
      digitalWrite(E,HIGH); 
      digitalWrite(F,HIGH); 
      digitalWrite(G,HIGH); 
      digitalWrite(X,LOW); 
      digitalWrite(Y,LOW); 
      digitalWrite(Z,HIGH); 
      delay(2000); 
      digitalWrite(A,HIGH); 
      digitalWrite(B,HIGH); 
      digitalWrite(C,HIGH); 
      digitalWrite(D,LOW); 
      digitalWrite(E,LOW); 
      digitalWrite(F,LOW); 
      digitalWrite(G,LOW); 
         
      digitalWrite(X,LOW); 
      digitalWrite(Y,LOW); 
      digitalWrite(Z,HIGH); 
      delay(2000); 
      digitalWrite(A,HIGH); 
      digitalWrite(B,HIGH); 
      digitalWrite(C,HIGH); 
      digitalWrite(D,HIGH); 
      digitalWrite(E,HIGH); 
      digitalWrite(F,HIGH); 
      digitalWrite(G,HIGH); 
      digitalWrite(X,LOW); 
      digitalWrite(Y,LOW); 
      digitalWrite(Z,HIGH); 
      delay(2000); 
      digitalWrite(A,HIGH); 
      digitalWrite(B,HIGH); 
      digitalWrite(C,HIGH); 
      digitalWrite(D,HIGH);
      digitalWrite(E,LOW); 
      digitalWrite(F,HIGH); 
      digitalWrite(G,HIGH); 
      digitalWrite(X,LOW); 
      digitalWrite(Y,LOW); 
      digitalWrite(Z,HIGH);
      delay(2000); 
           }

`,
`
int A=3;
int B=4;
int C=5;
int D=6;
int E=7;
int F=8;
int G=9;
int X=10;
int Y=11; 
int Z=12;   
void setup()
 {
          pinMode(A, OUTPUT);
          pinMode(B, OUTPUT);
          pinMode(C, OUTPUT); 
          pinMode(D, OUTPUT); 
          pinMode(E, OUTPUT); 
          pinMode(F, OUTPUT); 
          pinMode(G, OUTPUT); 
          pinMode(X, OUTPUT); 
          pinMode(Y, OUTPUT); 
          pinMode(Z, OUTPUT); 
          } 
void loop() 
{ 

          digitalWrite(A, HIGH); 
          digitalWrite(B ,HIGH); 
          digitalWrite(C, HIGH); 
          digitalWrite(D, HIGH); 
          digitalWrite(E, HIGH); 
          digitalWrite(F, HIGH); 
          digitalWrite(G, LOW); 
          delay(1000); 
          digitalWrite(A, LOW);
           digitalWrite(B ,HIGH); 
           digitalWrite(C, HIGH); 
           digitalWrite(D, LOW); 
           digitalWrite(E, LOW); 
           digitalWrite(F, LOW); 
           digitalWrite(G, LOW); 
           delay(1000); 
           digitalWrite(A, HIGH); 
           digitalWrite(B ,HIGH); 
           digitalWrite(C, LOW); 
           digitalWrite(D, HIGH);
           digitalWrite(E, HIGH);
           digitalWrite(F, LOW); 
           digitalWrite(G, HIGH); 
           delay(1000); 
           digitalWrite(A, HIGH); 
           digitalWrite(B ,HIGH); 
           digitalWrite(C, HIGH); 
           digitalWrite(D, HIGH); 
           digitalWrite(E, LOW); 
           digitalWrite(F, LOW); 
           digitalWrite(G, HIGH); 
           delay(1000); 
           digitalWrite(A, LOW); 
           digitalWrite(B ,HIGH); 
           digitalWrite(C, HIGH); 
           digitalWrite(D, LOW); 
           digitalWrite(E, LOW); 
           digitalWrite(F, HIGH); 
           digitalWrite(G,HIGH); 
           delay(1000); 
           digitalWrite(A, HIGH); 
           digitalWrite(B ,LOW); 
           digitalWrite(C, HIGH); 
           digitalWrite(D, HIGH); 
           digitalWrite(E, LOW); 
           digitalWrite(F, HIGH); 
           digitalWrite(G, HIGH); 
           delay(1000); 
           digitalWrite(A, LOW); 
           digitalWrite(B ,LOW); 
           digitalWrite(C, HIGH); 
           digitalWrite(D, HIGH);
           digitalWrite(E, HIGH);
           digitalWrite(F, HIGH); 
           digitalWrite(G, HIGH); 
           delay(1000); 
           digitalWrite(A, HIGH); 
           digitalWrite(B ,HIGH); 
           digitalWrite(C, HIGH); 
           digitalWrite(D, LOW); 
           digitalWrite(E, LOW); 
           digitalWrite(F, LOW); 
           digitalWrite(G, LOW); 
           delay(1000); 
           digitalWrite(A, HIGH); 
           digitalWrite(B ,HIGH); 
           digitalWrite(C, HIGH); 
           digitalWrite(D, HIGH); 
           digitalWrite(E, HIGH); 
           digitalWrite(F, HIGH); 
           digitalWrite(G, HIGH); 
           delay(1000); 
           digitalWrite(A, HIGH); 
           digitalWrite(B ,HIGH);
           digitalWrite(C, HIGH); 
           digitalWrite(D, LOW); 
           digitalWrite(E, LOW); 
           digitalWrite(F, HIGH);
           digitalWrite(G, HIGH);
           delay(1000);           
           
           }
`,
`
 int PIR PIN = 4;
 void setup() 
{ 

       serial.begin(9600); 
       pinMode(PIR PIN, INPUT); 
       delay(1000); 
      
} 
Void loop()
{ 
       int motionDetected = digitalRead(PIR PIN); 
        if (motionDetected = = HIGH) 
         {

            serial.println(“Motion detected!”);   
         }
          delay(500); 
             

`,
`
 int sensor_pin=13;
int sensor_state=1;
void setup()
{ 

        pinMode(13,INPUT);
        Serial.begin(9600);

} 
void loop()
{  
         Serial.print("Soil Moisture Level: "); 
         sensor_state = digitalRead(sensor_pin); 
         if (sensor_state == 1) 
         { 
            Serial.println("Wet");
          } 
         else 
         { 
            Serial.println("Dry"); 
           } 
          delay(200); 
}
`,
`
// Define pin connections
const int trigPin = 9; 
const int echoPin = 10; 
// Define variables long duration; int distance;  
void setup()
{ 
         // Initialize serial communication Serial.begin(9600);
        // Define pin modes 
        pinMode(trigPin, OUTPUT); 
        pinMode(echoPin, INPUT);
}  
void loop()
{   
         digitalWrite(trigPin, LOW); delayMicroseconds(2);   
          
         digitalWrite(trigPin, HIGH); 
         delayMicroseconds(10);
         digitalWrite(trigPin, LOW);   
          // Measure the duration of the echo pulse   
         duration = pulse In(echo Pin, HIGH);    

          // Calculate distance in cm (speed of sound is 343 m/s) 
        distance = duration * 0.034 / 2;  
       // Print distance to the serial monitor Serial.print("Distance: "); 
        Serial.print(distance); Serial.println(" cm");  
       // Delay before next reading delay(1000);
}


  
`,
`
 #include <LiquidCrystal.h> 
  LiquidCrystal lcd(12,11,5,4,3,2); 
  void setup()
{ 
    lcd.begin(16,2); 
    lcd.print("ANJALI KUMARI");  
} 
void loop()
{
}
 
`,
`
const int motorPin = 9; 
void setup() 
{ 
      pinMode(motorPin, OUTPUT); 
} 
void loop() 
{
      digitalWrite(motorPin, HIGH);
      delay(2000); 
      digitalWrite(motorPin, LOW); 
      delay(1000);
      digitalWrite(motorPin, HIGH); 
      delay(2000);
      digitalWrite(motorPin, LOW); 
      delay(1000); 
}
 
`,
`
# include <Servo.h>; 
    Servo Motor; 
void setup()
{   
    Motor.attach(13);
} 
void loop ()
{   
    Motor.write(0);   
    delay(1000);   
    Motor.write(180);  
    delay(1000);   
}
  
`,
`

const int dirPin1 = 13;
void setup()
{ 
       pinMode(dirPin1, OUTPUT);
}
void loop() 
{ 
         digitalWrite(dirPin1, HIGH);
         digitalWrite(dirPin1, LOW);
}
 
`,
`
#include <Wire.h>                 // I2C library
#include <Adafruit_GFX.h>          // Core graphics library
#include <Adafruit_SSD1306.h>      // OLED display library

// OLED display dimensions (for 0.96" 128x64 OLED)
#define SCREEN_WIDTH 128          // OLED display width, in pixels
#define SCREEN_HEIGHT 64          // OLED display height, in pixels
#define OLED_RESET    -1          // Reset pin (or use -1 if not used)

// Create an instance of the SSD1306 display
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  // Start serial communication for debugging (optional)
  Serial.begin(9600);

  // Initialize OLED display
  if (!display.begin(SSD1306_I2C_ADDRESS, OLED_RESET)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);  // Infinite loop to stop execution if initialization fails
  }

  // Clear the buffer
  display.clearDisplay();

  // Display text on the OLED
  display.setTextSize(1);        // Set text size to 1 (small)
  display.setTextColor(SSD1306_WHITE);  // Set text color to white
  display.setCursor(0,0);        // Set the cursor to the top-left corner
  display.println(F("Hello, World!"));  // Print "Hello, World!" on the display

  display.setTextSize(2);        // Set text size to 2 (larger)
  display.setCursor(0, 20);      // Move cursor down
  display.println(F("Arduino")); // Print "Arduino" on the display

  display.display();             // Display the contents of the buffer
}

void loop() {
  // Optionally, you can clear the display and add more dynamic content here
}

`,
`
#define LED_PIN 13     // Pin where the LED is connected
#define BUTTON_PIN 2   // Pin where the push button is connected

void setup() {
  // Initialize the LED pin as an output:
  pinMode(LED_PIN, OUTPUT);

  // Initialize the BUTTON_PIN as an input with an internal pull-up resistor:
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  // Read the state of the push button
  int buttonState = digitalRead(BUTTON_PIN);

  // Check if the button is pressed
  if (buttonState == LOW) {  // Button pressed (since we are using INPUT_PULLUP)
    digitalWrite(LED_PIN, HIGH);  // Turn the LED on
  } else {
    digitalWrite(LED_PIN, LOW);   // Turn the LED off
  }
}

`,
`
#include <DHT.h>

// Define the DHT11 sensor type and the pin where it is connected
#define DHTPIN 7        // DHT11 data pin connected to pin 7
#define DHTTYPE DHT11   // DHT 11 sensor

DHT dht(DHTPIN, DHTTYPE);  // Initialize the DHT sensor

void setup() {
  // Start the serial communication for output
  Serial.begin(9600);

  // Initialize the DHT sensor
  dht.begin();
}

void loop() {
  // Wait a few seconds between measurements
  delay(2000);

  // Reading temperature and humidity from DHT11
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // In Celsius
  // If you want Fahrenheit, use dht.readTemperature(true);

  // Check if any read failed and exit the function early
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Print the results to the Serial Monitor
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" *C");
}

`,
`
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define BUTTON_PIN 2  // Push button pin
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  // Initialize the button pin
  pinMode(BUTTON_PIN, INPUT_PULLUP);  // Using internal pull-up resistor

  // Initialize the OLED display
  if (!display.begin(SSD1306_I2C_ADDRESS, OLED_RESET)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }

  display.display();  // Initialize the display
  delay(2000);        // Pause for 2 seconds
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);  // Read button state

  // Clear the display before updating
  display.clearDisplay();

  if (buttonState == LOW) {
    // Button pressed
    display.setTextSize(2);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(10, 30);
    display.print("Button Pressed");
  } else {
    // Button not pressed
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(10, 30);
    display.print("Press the Button");
  }

  display.display();  // Update the OLED display
  delay(100);         // Short delay to debounce the button
}

`



]
export {res,esp,ard}