import { Respberry } from '@/models/resberymodel';
import { createExperimentHandler } from '@/lib/experimentApi';

export const GET = createExperimentHandler({
  model: Respberry,
  single: { title: 1, description: 1, metaDescription: 1, image1: 1, _id: 0 },
  list: { slug: 1, title: 1, _id: 0 },
});