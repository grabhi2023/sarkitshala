import { Respberry } from '@/models/resberymodel';
import { createExperimentHandler } from '@/lib/experimentApi';

export const GET = createExperimentHandler({ model: Respberry });