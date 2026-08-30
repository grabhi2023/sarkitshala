import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  commands: [String],
  code: String,
}, { _id: false });

const IotExperimentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  objective: { type: String, required: true },
  methodology: [{ type: String }],
  steps: [StepSchema],
  applications: [{ type: String }],
  futureResearchConcepts: [{ type: String }],
  slug: { type: String, required: true, unique: true }, // recommended for URL use
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const IotProtocol = mongoose.models.protocols || mongoose.model('protocols', IotExperimentSchema);

