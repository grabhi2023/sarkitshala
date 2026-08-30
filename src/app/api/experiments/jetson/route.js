import { NextResponse } from 'next/server';
import dbConnect from '@/lib/databaseConnect';
import { jetsons } from '@/models/jetsonmodels';

export async function GET(request) {
    try {
        await dbConnect();

       
        const experiments = await jetsons.find({}).lean();

        if (experiments.length === 0) {
            return NextResponse.json({ message: 'No experiments found' }, { status: 404 });
        }

        return NextResponse.json(experiments, { status: 200 });

    } catch (error) {
        console.error('Server error:', error.message);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
