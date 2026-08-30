import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/databaseConnect';
import { Esp } from '@/models/espmodel';

export async function GET(request) {
  try {
    
    await dbConnect();


    const url = new URL(request.url);
      console.log(url)
    const exId = url.searchParams.get('exId'); 
    console.log(exId)
   
    if (exId) {
      const experiment = await Esp.findOne({ slug: exId });

      if (!experiment) {
        return NextResponse.json({ message: 'Experiment not found' }, { status: 404 });
      }

      
      return NextResponse.json(experiment, { status: 200 });
    }

   
    const experiments = await Esp.find(); 

   
    if (experiments.length === 0) {
      return NextResponse.json({ message: 'No experiments found' }, { status: 404 });
    }

    
    return NextResponse.json(experiments, { status: 200 });

  } catch (error) {
    
    console.error('Server error:', error.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
