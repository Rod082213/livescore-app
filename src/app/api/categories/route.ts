import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

// Fetches all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("API GET Categories Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Creates a new category
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    // Check for duplicates in a case-insensitive way
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return NextResponse.json({ message: 'Category already exists' }, { status: 409 });
    }

    const newCategory = new Category({ name });
    await newCategory.save();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("API POST Category Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}