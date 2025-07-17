import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import mongoose from 'mongoose';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid Post ID format.' }, { status: 400 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    
    const { title, slug, author, description, keywords, featuredImageUrl, content, categories, tags } = body;

    if (!title || !slug || !author || !content) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    
    const existingSlugPost = await Post.findOne({ slug, _id: { $ne: id } });
    if (existingSlugPost) {
      return NextResponse.json({ message: `Slug "${slug}" is already used by another post.` }, { status: 409 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        author,
        description,
        keywords: keywords || [],
        featuredImageUrl,
        content,
        categories,
        tags
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post updated successfully', post: updatedPost }, { status: 200 });

  } catch (error: any) {
    console.error("API PUT Error:", error);
    return NextResponse.json({ message: 'Error updating post', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid Post ID format.' }, { status: 400 });
  }
  try {
    await dbConnect();
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting post', error: error.message }, { status: 500 });
  }
}