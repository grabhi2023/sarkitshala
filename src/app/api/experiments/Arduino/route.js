import { Arduino } from '@/models/arduinomodels';
import { createExperimentHandler } from '@/lib/experimentApi';

export const GET = createExperimentHandler({ model: Arduino });