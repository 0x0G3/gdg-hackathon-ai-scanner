import { NextResponse } from 'next/server';
import { getScan } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const scan = await getScan(resolvedParams.id);

    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    return NextResponse.json({ scan }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching scan:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
