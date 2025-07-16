import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tag from '@/models/Tag';

// Fetches all tags
export async function GET() {
  try {
    await dbConnect();
    const tags = await Tag.find({}).sort({ name: 1 });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("API GET Tags Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Creates a new tag
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
    
    // Check for duplicates in a case-insensitive way
    const existingTag = await Tag.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingTag) {
      return NextResponse.json({ message: 'Tag already exists' }, { status: 409 });
    }

    const newTag = new Tag({ name });
    await newTag.save();
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("API POST Tag Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}