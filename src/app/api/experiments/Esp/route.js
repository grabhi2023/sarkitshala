import { Esp } from '@/models/espmodel';
import { createExperimentHandler } from '@/lib/experimentApi';

export const GET = createExperimentHandler({ model: Esp });