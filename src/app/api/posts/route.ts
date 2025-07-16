import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, slug, author, featuredImageUrl, keywords, content } = body;

    // FIX: Stricter validation to prevent crashes from empty or invalid data.
    if (!title || !slug || !author || !content || !Array.isArray(content) || content.length === 0) {
      return NextResponse.json({ message: 'Title, slug, author, and content (with at least one block) are required.' }, { status: 400 });
    }

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json({ message: `Slug "${slug}" already exists. Please use a unique one.` }, { status: 409 });
    }

    // FIX: Create the post object explicitly to avoid extra properties.
    const newPost = new Post({
      title,
      slug,
      author,
      featuredImageUrl: featuredImageUrl || '',
      keywords: keywords || [],
      content
    });

    await newPost.save();
    return NextResponse.json({ message: 'Post created successfully', post: newPost }, { status: 201 });

  } catch (error) {
    console.error("API POST Error:", error);
    // FIX: Specifically catch Mongoose validation errors.
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ message: 'A validation error occurred. Please check all fields.', error: error.message }, { status: 400 });
    }
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
    console.error("API GET Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}