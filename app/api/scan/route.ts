import { NextResponse } from 'next/server';
import { createScan } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL provided.' }, { status: 400 });
    }

    const scanId = await createScan(url);

    return NextResponse.json({ scanId }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating scan:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
