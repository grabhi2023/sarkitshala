import { NextResponse } from 'next/server';
import { Arduino } from '@/models/arduinomodels';
import dbConnect from '@/lib/databaseConnect';

export async function GET() {
  try {
    await dbConnect();

    const arduinodata = await Arduino.find(
      {},
      { _id: 0, ExperimentName: 1, ExperimentId: 1, slug: 1, image1: 1, poster: 1, plot: 1 }
    ).lean();

    return NextResponse.json(
      { arduinodata },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (error) {
    console.error('Arduino list error:', error.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}