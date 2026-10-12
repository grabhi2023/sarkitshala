import { NextResponse } from 'next/server';
import dbConnect from '@/lib/databaseConnect';

const SLUG_PATTERN = /^[\w.-]{1,200}$/;
const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

const respond = (body, status = 200, headers = {}) => NextResponse.json(body, { status, headers });

export function createExperimentHandler({ model, single = null, list = null }) {
  return async function GET(request) {
    try {
      const exId = new URL(request.url).searchParams.get('exId');
      await dbConnect();

      if (exId) {
        const slug = exId.trim();
        if (!SLUG_PATTERN.test(slug)) return respond({ message: 'Invalid experiment id' }, 400);

        const experiment = await model.findOne({ slug }, single).lean();
        if (!experiment) return respond({ message: 'Experiment not found' }, 404);

        return respond(experiment, 200, CACHE_HEADERS);
      }

      const experiments = await model.find({}, list).lean();
      return respond(experiments, 200, CACHE_HEADERS);
    } catch (error) {
      console.error('Experiment API error:', error.message);
      return respond({ message: 'Server error' }, 500);
    }
  };
}