import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const banners = await Banner.find({}).sort({ sortOrder: 1 });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const banner = await Banner.create(body);
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating banner' }, { status: 500 });
  }
}