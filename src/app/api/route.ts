// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Basic validation
    const { title, slug, author, keywords, content } = body;
    if (!title || !slug || !author || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
        return NextResponse.json({ message: 'Slug already exists. Please use a unique one.' }, { status: 409 });
    }

    const newPost = new Post({
      title,
      slug,
      author,
      keywords: keywords || [],
      content
    });

    await newPost.save();

    return NextResponse.json({ message: 'Post created successfully', post: newPost }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}