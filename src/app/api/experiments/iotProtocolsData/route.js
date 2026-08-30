import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/databaseConnect';
import { IotProtocol } from '@/models/iotProtocols.model';
export async function GET(request) {
  try {
   
    await dbConnect();
      const url = new URL(request.url);
    
    const exId = url.searchParams.get('exId'); 
    console.log(exId)
 if (exId) {
  console.log("Looking for experiment with slug:", exId);
  const experiment = await IotProtocol.findOne({ slug: exId });
  return NextResponse.json(experiment, { status: 200 });
} else {
  console.log("No exId provided, returning all experiments");
  const experiments = await IotProtocol.find();
  return NextResponse.json(experiments, { status: 200 });
}




  } catch (error) {
    
    console.error('Server error:', error.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }

}