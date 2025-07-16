import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// Component Imports
import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import Footer from '@/components/Footer';
import BackToBlogs from '@/components/BackToBlogs';

// Database and Type Imports
import { IPost, ICategory, ITag, IContentBlock } from '@/models/Post'; // Using IContentBlock
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

// --- Data Fetching Function (Corrected) ---
async function getPost(slug: string): Promise<IPost | null> {
  await dbConnect();
  const post = await Post.findOne({ slug })
      .populate('categories', 'name')
      .populate('tags', 'name')
      .lean(); // .lean() provides a plain, fast JavaScript object
  return post as IPost | null;
}

// --- Dynamic Metadata Generation (Corrected) ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };

  // Access the blocks array correctly
  const firstParagraph = post.content?.blocks?.find((b: IContentBlock) => b.type === 'p');
  const description = firstParagraph 
    ? (firstParagraph.value.html ?? '').replace(/<[^>]*>/g, '').slice(0, 160) 
    : 'Read this article on TodayLiveScores.';
  
  return {
    title: `${post.title} | TodayLiveScores Blog`,
    description: description,
    openGraph: {
        title: post.title,
        description: description,
        images: [post.featuredImageUrl || '/default-og-image.jpg'],
    },
  };
}


// --- UI Sub-Components (Corrected and self-contained) ---

const TableOfContents = ({ contentBlocks }: { contentBlocks?: IContentBlock[] | null }) => {
  if (!contentBlocks || !Array.isArray(contentBlocks)) return null;

  // FIX: Only looks for h2 and h3 for a true Table of *Contents*
  const headings = contentBlocks
    .filter(block => ['h2', 'h3'].includes(block.type) && block.value?.text)
    .map(block => ({
      level: parseInt(block.type.replace('h', '')),
      text: block.value.text,
      slug: (block.value.text ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    }));

  if (headings.length === 0) return null; // Don't show if no sections

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-3">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li key={index} style={{ marginLeft: `${(heading.level - 2) * 1}rem` }}>
            <a href={`#${heading.slug}`} className="text-gray-300 hover:text-blue-400 transition-colors text-sm">{heading.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PostMeta = ({ categories, tags }: { categories?: ICategory[], tags?: ITag[] }) => {
  const hasCategories = categories && categories.length > 0;
  const hasTags = tags && tags.length > 0;

  // FIX: Shows a fallback instead of disappearing completely
  if (!hasCategories && !hasTags) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-400 text-center">No Categories or Tags</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasCategories && (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-md font-semibold text-white mb-3 uppercase tracking-wider">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Link key={cat._id.toString()} href={`/blog/category/${encodeURIComponent(cat.name.toLowerCase())}`} className="bg-blue-900/50 text-blue-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-900 transition-colors">{cat.name}</Link>
            ))}
          </div>
        </div>
      )}
      {hasTags && (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-md font-semibold text-white mb-3 uppercase tracking-wider">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link key={tag._id.toString()} href={`/blog/tag/${encodeURIComponent(tag.name.toLowerCase())}`} className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-600 transition-colors">#{tag.name}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PostRenderer = ({ contentBlocks }: { contentBlocks?: IContentBlock[] | null }) => {
  if (!contentBlocks || !Array.isArray(contentBlocks)) return null;

  return (
    <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400">
      {contentBlocks.map((block) => {
        const id = ['h2', 'h3'].includes(block.type) 
          ? (block.value.text ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') 
          : block.id;
        
        switch (block.type) {
          // FIX: 'h1' case removed to prevent duplicate titles
          case 'h2': return <h2 key={block.id} id={id} className="text-3xl font-bold mt-10">{block.value.text}</h2>;
          case 'h3': return <h3 key={block.id} id={id} className="text-2xl font-semibold mt-8">{block.value.text}</h3>;
          case 'p': return <div key={block.id} className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: block.value.html }} />;
          case 'image': return (
            <figure key={block.id} className="my-8">
              <Image src={block.value.url} alt={block.value.caption ?? 'Blog image'} width={800} height={450} className="rounded-lg w-full h-auto object-cover" />
              {block.value.caption && <figcaption className="text-center text-sm text-gray-400 mt-2">{block.value.caption}</figcaption>}
            </figure>
          );
          case 'ctaButton': return (
            <div key={block.id} className="my-8 text-center"><a href={block.value.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 px-8 rounded-lg no-underline transition-colors">{block.value.text}</a></div>
          );
          default: return null;
        }
      })}
    </div>
  );
};


// --- Main Page Component (The Final Assembly) ---
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // Safely get the categories and tags, providing an empty array as a fallback
  const categories = (post.categories as ICategory[]) || [];
  const tags = (post.tags as ITag[]) || [];

  return (
    <div className="bg-[#1d222d] text-white min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              {/* FIX: Pass the correct `blocks` array to the TOC */}
              <TableOfContents contentBlocks={post.content?.blocks} />
            </div>
          </aside>

          <main className="lg:col-span-6">
            <BackToBlogs />
            <article>
              <header className="mb-8 border-b border-gray-700 pb-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">{post.title}</h1>
                <p className="mt-4 text-gray-400">By {post.author || 'Anonymous'} on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </header>
              {post.featuredImageUrl && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
                  <Image src={post.featuredImageUrl} alt={post.title} fill className="object-cover" priority />
                </div>
              )}
              {/* FIX: Pass the correct `blocks` array to the renderer */}
              <PostRenderer contentBlocks={post.content?.blocks} />
            </article>
          </main>

          <aside className="lg:col-span-3 mt-12 lg:mt-0">
            <div className="sticky top-24">
              {/* This now renders correctly even if data is missing */}
              <PostMeta categories={categories} tags={tags} />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}