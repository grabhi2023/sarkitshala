import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/databaseConnect';
import { Respberry } from '@/models/resberymodel';

export async function GET(request) {
    await dbConnect();
    
    const url = new URL(request.url);
    const exId = url.searchParams.get('exId');

    try {
        let experiments;

        
        if (exId) {
            experiments = await Respberry.findOne({ slug: exId });
            
            if (!experiments) {
                return NextResponse.json({ message: 'Experiment not found' }, { status: 404 });
            }
        } else {
           
            experiments = await Respberry.find();
        }

       
        return NextResponse.json(experiments);

    } catch (error) {
        console.error('Server error:', error.message);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
