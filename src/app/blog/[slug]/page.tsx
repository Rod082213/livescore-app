import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { IPost, IContentBlock, ITag } from '@/models/Post';
import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import Footer from '@/components/Footer';
import BlogPostLayout from '@/components/BlogPostLayout'; // We will create this next

async function getPost(slug: string): Promise<IPost | null> {
  await dbConnect();
  const post = await Post.findOne({ slug }).populate('categories', 'name').populate('tags', 'name').lean();
  return post as IPost | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };

  const publicDomain = 'https://todaylivescores.com';
  const canonicalUrl = `${publicDomain}/blog/${post.slug}`;
  let imagePath = '/social-card-blog.png';
  if (post.featuredImageUrl) {
    try {
      imagePath = new URL(post.featuredImageUrl, publicDomain).pathname;
    } catch { /* Use default */ }
  }
  const imageUrl = `${publicDomain}${imagePath}`;
  const mainTitle = post.title || "Untitled Article";
  const firstParagraph = post.content?.blocks?.find((b: IContentBlock) => b.type === 'paragraph');
  const safeDescription = (post.description || firstParagraph?.data.text || 'Read this article').replace(/<[^>]*>/g, '').slice(0, 160);
  const authorName = post.author || 'TLiveScores Staff';
  
  return {
    title: `${mainTitle} | TLiveScores`,
    description: safeDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: mainTitle,
      description: safeDescription,
      url: canonicalUrl,
      siteName: 'TLiveScores',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: mainTitle }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: mainTitle,
      description: safeDescription,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#1d222d] text-white min-h-screen">
      <Header />
      <SportsNav />
      <BlogPostLayout post={JSON.parse(JSON.stringify(post))} />
      <Footer />
    </div>
  );
}