import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await request.json();
    const banner = await Banner.findByIdAndUpdate(params.id, body, { new: true });
    if (!banner) return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating banner' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const banner = await Banner.findByIdAndDelete(params.id);
    if (!banner) return NextResponse.json({ message: 'Banner not found' }, { status: 404 });
    return NextResponse.json({ message: 'Banner deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting banner' }, { status: 500 });
  }
}