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
    const { title, slug, author, description, featuredImageUrl, content, categories, tags } = body;

    // Validation for Editor.js content structure
    if (!title || title.trim() === '') return NextResponse.json({ message: 'Title is required.' }, { status: 400 });
    if (!slug || slug.trim() === '') return NextResponse.json({ message: 'Slug is required.' }, { status: 400 });
    if (!author || author.trim() === '') return NextResponse.json({ message: 'Author is required.' }, { status: 400 });
    if (!content || !content.blocks || !Array.isArray(content.blocks) || content.blocks.length === 0) {
      return NextResponse.json({ message: 'Content (with at least one block) is required.' }, { status: 400 });
    }
    
    const existingSlugPost = await Post.findOne({ slug, _id: { $ne: id } });
    if (existingSlugPost) {
      return NextResponse.json({ message: `Slug "${slug}" is already used by another post.` }, { status: 409 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title, slug, author, description: description || '',
        featuredImageUrl: featuredImageUrl || '',
        content: content, // Direct Editor.js OutputData object
        categories: categories || [], tags: tags || []
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post updated successfully', post: updatedPost }, { status: 200 });

  } catch (error) {
    console.error("API PUT Error:", error);
    if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json({ message: 'Validation Error', error: (error as Error).message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
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