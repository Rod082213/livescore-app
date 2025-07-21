import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BannerLocation from '@/models/BannerLocation';

export async function GET() {
  try {
    await dbConnect();
    const locations = await BannerLocation.find({}).sort({ name: 1 });
    return NextResponse.json(locations);
  } catch (error) {
    console.error("API GET Banner Locations Error:", error);
    return NextResponse.json({ message: 'Error fetching banner locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
    const existingLocation = await BannerLocation.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingLocation) {
      return NextResponse.json(existingLocation, { status: 409 });
    }
    const newLocation = await BannerLocation.create({ name });
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error: any) {
    console.error("API POST Banner Location Error:", error);
    return NextResponse.json({ message: 'Error creating banner location', error: error.message }, { status: 500 });
  }
}