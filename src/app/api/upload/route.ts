// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Define the path for the uploads directory
    const uploadDir = join(process.cwd(), 'public/uploads');
    
    // --- THIS IS THE FIX ---
    // Ensure the upload directory exists, creating it if necessary.
    // The `recursive: true` option prevents errors if the directory already exists.
    await mkdir(uploadDir, { recursive: true });
    // -----------------------

    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
    const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;
    const path = join(uploadDir, uniqueFilename);
    
    await writeFile(path, buffer);
    
    const publicUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Error saving file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message: `Error saving file: ${errorMessage}` }, { status: 500 });
  }
}