import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, slug, author, content } = body;

    if (!title || !slug || !author || !content) {
      return NextResponse.json({ message: 'Title, slug, author, and content are required.' }, { status: 400 });
    }

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json({ message: `Slug "${slug}" already exists.` }, { status: 409 });
    }

    const newPost = new Post(body); // body now includes the optional description
    await newPost.save();
    return NextResponse.json({ message: 'Post created successfully', post: newPost }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown internal error occurred.";
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}