import { NextResponse } from 'next/server';
import { searchExp } from '@/models/search.model';
import dbConnect from '@/lib/databaseConnect';

const MIN_LENGTH = 2;
const MAX_LENGTH = 80;
const RESULT_LIMIT = 6;
const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' };

export async function GET(request) {
  const raw = new URL(request.url).searchParams.get('Search') ?? '';
  const search = raw.trim().replace(/\s+/g, ' ');

  if (search.length < MIN_LENGTH) {
    return NextResponse.json({ error: `Enter at least ${MIN_LENGTH} characters.` }, { status: 400 });
  }
  if (search.length > MAX_LENGTH) {
    return NextResponse.json({ error: 'Search query is too long.' }, { status: 400 });
  }

  try {
    await dbConnect();

    const results = await searchExp.aggregate([
      {
        $search: {
          index: 'searchData',
          autocomplete: {
            query: search,
            path: 'ExperimentName',
            fuzzy: { maxEdits: 2, prefixLength: 1 },
          },
        },
      },
      { $limit: RESULT_LIMIT },
      {
        $project: {
          _id: 0,
          ExperimentName: 1,
          ExperimentId: 1,
          slug: 1,
          category: 1,
          image1: 1,
          poster: 1,
          plot: 1,
        },
      },
    ]);

    return NextResponse.json(results, { status: 200, headers: CACHE_HEADERS });
  } catch (error) {
    console.error('Search error:', error.message);
    return NextResponse.json({ error: 'An error occurred while searching.' }, { status: 500 });
  }
}