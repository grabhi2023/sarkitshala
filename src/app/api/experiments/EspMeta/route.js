import { Esp } from '@/models/espmodel';
import { createExperimentHandler } from '@/lib/experimentApi';

export const GET = createExperimentHandler({
  model: Esp,
  single: { title: 1, metaDescription: 1, image1: 1, _id: 0 },
  list: { slug: 1, title: 1, _id: 0 },
});