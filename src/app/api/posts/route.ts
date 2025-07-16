import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, slug, author, description, featuredImageUrl, content, categories, tags } = body;

    // Validation for Editor.js content structure
    if (!title || title.trim() === '') return NextResponse.json({ message: 'Title is required.' }, { status: 400 });
    if (!slug || slug.trim() === '') return NextResponse.json({ message: 'Slug is required.' }, { status: 400 });
    if (!author || author.trim() === '') return NextResponse.json({ message: 'Author is required.' }, { status: 400 });
    if (!content || !content.blocks || !Array.isArray(content.blocks) || content.blocks.length === 0) {
      return NextResponse.json({ message: 'Content cannot be empty. Please add at least one block using Editor.js.' }, { status: 400 });
    }

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json({ message: `Slug "${slug}" already exists. Please use a unique one.` }, { status: 409 });
    }

    const newPost = new Post({
      title,
      slug,
      author,
      description: description || '',
      featuredImageUrl: featuredImageUrl || '',
      content: content, // Direct Editor.js OutputData object
      categories: categories || [],
      tags: tags || []
    });

    await newPost.save();
    return NextResponse.json({ message: 'Post created successfully', post: newPost }, { status: 201 });

  } catch (error) {
    console.error("API POST Error:", error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error: Please ensure all fields are correctly filled.', error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("API GET Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown internal error occurred.";
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}