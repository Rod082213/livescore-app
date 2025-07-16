import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Tag from '@/models/Tag';

// A map to get the correct Mongoose model based on the URL parameter
const models: { [key: string]: any } = {
  categories: Category,
  tags: Tag,
};

// Reusable GET handler
export async function GET(
  request: Request,
  { params }: { params: { model: string } }
) {
  const modelName = params.model;
  const Model = models[modelName];

  if (!Model) {
    return NextResponse.json({ message: 'Invalid model type' }, { status: 400 });
  }

  try {
    await dbConnect();
    const items = await Model.find({}).sort({ name: 1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Reusable POST handler
export async function POST(
  request: Request,
  { params }: { params: { model: string } }
) {
  const modelName = params.model;
  const Model = models[modelName];

  if (!Model) {
    return NextResponse.json({ message: 'Invalid model type' }, { status: 400 });
  }

  try {
    await dbConnect();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const existingItem = await Model.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingItem) {
      // Return the existing item so the frontend can use it
      return NextResponse.json(existingItem, { status: 200 });
    }

    const newItem = new Model({ name });
    await newItem.save();
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}