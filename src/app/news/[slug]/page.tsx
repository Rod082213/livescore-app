import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import Footer from '@/components/Footer';
import { IPost, IContentBlock, ITag, ICategory } from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import BlogPostLayout from '@/components/BlogPostLayout';

async function getPost(slug: string): Promise<IPost | null> {
  await dbConnect();
  const post = await Post.findOne({ slug }).populate('categories', 'name').populate('tags', 'name').lean();
  return post as IPost | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };

  const h1Block = post.content?.blocks?.find((b: IContentBlock) => b.type === 'header' && b.data.level === 1);
  const mainTitle = h1Block?.data.text || post.title || "Untitled Article";

  let safeDescription = post.description || '';
  if (!safeDescription) {
    const firstParagraph = post.content?.blocks?.find((b: IContentBlock) => b.type === 'paragraph');
    safeDescription = firstParagraph ? (firstParagraph.data.text ?? '').replace(/<[^>]*>/g, '').slice(0, 160) : 'Read this article on TodayLiveScores.';
  }

  let finalKeywords = '';
  if (post.keywords && Array.isArray(post.keywords) && post.keywords.length > 0) {
    finalKeywords = post.keywords.join(', ');
  } else {
    const stopWords = new Set(['a', 'an', 'the', 'in', 'on', 'for', 'and', 'with', 'to', 'is', 'of']);
    const cleanWords = mainTitle.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 1 && !stopWords.has(word));
    const keywordPhrases: string[] = [];
    if (cleanWords.length >= 2) for (let i = 0; i <= cleanWords.length - 2; i++) keywordPhrases.push(`${cleanWords[i]} ${cleanWords[i+1]}`);
    if (cleanWords.length >= 3) for (let i = 0; i <= cleanWords.length - 3; i++) keywordPhrases.push(`${cleanWords[i]} ${cleanWords[i+1]} ${cleanWords[i+2]}`);
    let generatedKeywords = Array.from(new Set(keywordPhrases)).slice(0, 4).join(', ');
    if (!generatedKeywords && post.tags && (post.tags as ITag[]).length > 0) {
      generatedKeywords = (post.tags as ITag[]).map(tag => tag.name).join(', ');
    }
    finalKeywords = generatedKeywords;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const authorName = post.author || 'TodayLiveScores Staff';

  return {
    title: `${mainTitle} | TodayLiveScores Blog`,
    description: safeDescription,
    keywords: finalKeywords || undefined,
    authors: [{ name: authorName }],
    publisher: 'TodayLiveScores',
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title: mainTitle,
      description: safeDescription,
      url: canonicalUrl,
      siteName: 'TodayLiveScores Blog',
      images: [{ url: post.featuredImageUrl || `${siteUrl}/default-og-image.jpg`, width: 1200, height: 630 }],
      locale: 'en_US',
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const fetchedPost = await getPost(params.slug);
  if (!fetchedPost) {
    notFound();
  }

  const plainPostObject = JSON.parse(JSON.stringify(fetchedPost));

  return (
    <div className="bg-[#1d222d] text-white min-h-screen">
      <Header />
      <SportsNav />
      <BlogPostLayout post={plainPostObject} />
      <Footer />
    </div>
  );
}