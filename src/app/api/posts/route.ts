import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, slug, author, description, keywords, featuredImageUrl, content, categories, tags } = body;

    if (!title || !slug || !author || !content) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json({ message: `Slug "${slug}" already exists.` }, { status: 409 });
    }

    const newPost = await Post.create({
      title,
      slug,
      author,
      description,
      keywords: keywords || [],
      featuredImageUrl,
      content,
      categories,
      tags
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating post', error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching posts', error: (error as Error).message }, { status: 500 });
    }
}