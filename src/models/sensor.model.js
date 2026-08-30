import mongoose from 'mongoose'

const SensorSchema = new mongoose.Schema({
  ExperimentId: String,
  title: String,
  slug: String,
  metaDescription: String,
  focusKeywords: [String],
  introduction: String,
  componentsRequired: [
    {
      name: String,
      quantity: mongoose.Schema.Types.Mixed, // supports both number and string like "As needed"
    },
  ],
  wiringConnections: [
    {
      sensorPin: String,
      esp32Pin: String,
      note: String,
      optional: String,
    },
  ],
  howItWorks: [String],
  arduinoCode: String,
  codeExplanation: [String],
  sensorSpecs: {
    Type: String,
    Range: String,
    Accuracy: String,
    Interface: String,
    Resolution: String,
    Voltage: String,
  },
  calibrationTips: [String],
  offsetCode: String,
  applications: [String],
  faqs: [
    {
      question: String,
      answer: String,
    },
  ],
  conclusion: String,
});



export const iotsensor = mongoose.models.iotsensor || mongoose.model('iotsensor',SensorSchema)