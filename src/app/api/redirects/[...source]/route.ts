// app/api/redirects/[...source]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Redirect from '@/models/Redirect';

export async function GET(request, { params }) {
  // params.source will now be an array, e.g., ['news', 'from-purple-reign-to...']
  
  // We join the array segments with a '/' and add the leading slash
  // to reconstruct the original path exactly as it is in the database.
  const sourcePath = `/${params.source.join('/')}`;

  // Log this to your terminal. It's the most important debugging step.
  console.log(`API is searching for sourcePath: "${sourcePath}"`);

  await dbConnect();
  
  // Find the document where the 'source' field exactly matches the reconstructed path.
  const redirect = await Redirect.findOne({ source: sourcePath }).lean();

  if (redirect) {
    // If found, log it and return the destination.
    console.log(`✅ API Found Redirect:`, redirect);
    return NextResponse.json({ destination: redirect.destination });
  } else {
    // If not found, log that too.
    console.log(`❌ API Did Not Find Redirect.`);
    return new NextResponse('Redirect not found', { status: 404 });
  }
}