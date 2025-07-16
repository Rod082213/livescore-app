import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import BackToBlogs from '@/components/BackToBlogs';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { IPost, IContentBlock, ICategory, ITag } from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

// --- Data Fetching Function ---
async function getPost(slug: string): Promise<IPost | null> {
  await dbConnect();
  const post = await Post.findOne({ slug })
      .populate('categories', 'name')
      .populate('tags', 'name')
      .lean();
  return JSON.parse(JSON.stringify(post));
}

// --- UI Sub-Components ---

const TableOfContents = ({ content }: { content: IContentBlock[] }) => {
  const headings = content
    .filter(block => ['h1', 'h2', 'h3'].includes(block.type))
    .map(block => ({
      level: parseInt(block.type.replace('h', '')),
      text: block.value.text,
      slug: (block.value.text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    }));

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-3">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li key={index} style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}>
            <a href={`#${heading.slug}`} className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PostMeta = ({ categories, tags }: { categories: ICategory[], tags: ITag[] }) => (
  <div className="space-y-6">
    {categories && categories.length > 0 && (
      <div>
        <h3 className="text-md font-semibold text-gray-400 mb-2 uppercase tracking-wider">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Link key={cat._id.toString()} href={`/blog/category/${cat.name.toLowerCase()}`} className="bg-blue-900/50 text-blue-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-900 transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    )}
    {tags && tags.length > 0 && (
      <div>
        <h3 className="text-md font-semibold text-gray-400 mb-2 uppercase tracking-wider">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link key={tag._id.toString()} href={`/blog/tag/${tag.name.toLowerCase()}`} className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-600 transition-colors">
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    )}
  </div>
);

const PostRenderer = ({ content }: { content: IContentBlock[] }) => {
  if (!content || !Array.isArray(content)) return null;

  return (
    <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400">
      {content.map((block) => {
        const id = ['h1', 'h2', 'h3'].includes(block.type) 
          ? (block.value.text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') 
          : block.id;
          
        switch (block.type) {
          case 'h1': return <h1 key={block.id} id={id}>{block.value.text}</h1>;
          case 'h2': return <h2 key={block.id} id={id}>{block.value.text}</h2>;
          case 'h3': return <h3 key={block.id} id={id}>{block.value.text}</h3>;
          case 'p': return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.value.html }} />;
          case 'image': return (
            <figure key={block.id} className="my-6">
              <Image src={block.value.url} alt={block.value.caption || 'Blog image'} width={800} height={450} className="rounded-lg w-full h-auto object-cover" />
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


// --- Dynamic Metadata Function ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  
  const firstParagraph = post.content?.find((b: IContentBlock) => b.type === 'p');
  const description = firstParagraph 
    ? firstParagraph.value.html.replace(/<[^>]*>/g, '').slice(0, 160) 
    : 'Read this article.';

  return {
    title: `${post.title} | My Blog`,
    description: description,
    openGraph: {
        title: post.title,
        description: description,
        images: [post.featuredImageUrl || '/default-image.jpg'],
    },
  };
}


// --- Main Page Component ---
export default async function BlogPostPage({ params }: { params: { slug:string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const categories = post.categories as ICategory[];
  const tags = post.tags as ITag[];

  return (
    <div className="bg-[#1d222d] text-white min-h-screen">
       <Header />
       <SportsNav />
      <div className="container mx-auto px-4 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
                <TableOfContents content={post.content} />
            </div>
          </aside>

          <div className="lg:col-span-6">
            <BackToBlogs />
            <article>
              <header className="mb-8 border-b border-gray-700 pb-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">{post.title}</h1>
                <p className="mt-4 text-gray-400">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
              </header>
              {post.featuredImageUrl && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
                    <Image src={post.featuredImageUrl} alt={post.title} layout="fill" objectFit="cover" priority />
                </div>
              )}
              <PostRenderer content={post.content} />
            </article>
          </div>

          <aside className="lg:col-span-3 mt-12 lg:mt-0">
            <div className="sticky top-24">
                <PostMeta categories={categories} tags={tags} />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}