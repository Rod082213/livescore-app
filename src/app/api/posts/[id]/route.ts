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
    const { title, slug, author, content } = body;

    if (!title || !slug || !author || !content || !Array.isArray(content) || content.length === 0) {
      return NextResponse.json({ message: 'Title, slug, author, and content are required.' }, { status: 400 });
    }
    
    const updatedPost = await Post.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedPost) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post updated successfully', post: updatedPost }, { status: 200 });

  } catch (error) {
    console.error("API PUT Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
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
      return NextResponse.json({ message: 'Post not found or was already deleted.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully.' }, { status: 200 });

  } catch (error) {
    console.error("API DELETE Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}