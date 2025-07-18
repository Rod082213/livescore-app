'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IPost, ICategory, ITag, IContentBlock } from '@/models/Post';
import BackToBlogs from '@/components/BackToBlogs';

const TableOfContents = ({ contentBlocks }: { contentBlocks?: IContentBlock[] | null }) => {
  if (!contentBlocks || !Array.isArray(contentBlocks)) return null;
  const headings = contentBlocks.filter(block => block.type === 'header' && block.data?.text && [1, 2, 3].includes(block.data.level)).map(block => ({ level: block.data.level, text: block.data.text, slug: (block.data.text ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') }));
  if (headings.length === 0) return (<div className="p-4 bg-gray-800 rounded-lg border border-gray-700"><h2 className="text-lg font-bold text-white mb-3">Table of Contents</h2><p className="text-sm text-gray-400">This article has no sections.</p></div>);
  
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', `#${slug}`);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-3">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li key={index} style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}>
            <a href={`#${heading.slug}`} onClick={(e) => handleScroll(e, heading.slug)} className="text-gray-300 hover:text-blue-400 transition-colors text-sm cursor-pointer" dangerouslySetInnerHTML={{ __html: heading.text }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const PostMeta = ({ categories, tags }: { categories?: ICategory[], tags?: ITag[] }) => {
  const hasCategories = categories && categories.length > 0;
  const hasTags = tags && tags.length > 0;
  if (!hasCategories && !hasTags) return <div className="p-4 bg-gray-800 rounded-lg border border-gray-700"><p className="text-sm text-gray-400 text-center">No Categories or Tags</p></div>;
  return (<div className="space-y-6">{hasCategories && (<div className="p-4 bg-gray-800 rounded-lg border border-gray-700"><h3 className="text-md font-semibold text-white mb-3 uppercase tracking-wider">Categories</h3><div className="flex flex-wrap gap-2">{categories.map(cat => (<Link key={cat._id.toString()} href={`/blog/category/${encodeURIComponent(cat.name.toLowerCase())}`} className="bg-blue-900/50 text-blue-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-900 transition-colors">{cat.name}</Link>))}</div></div>)}{hasTags && (<div className="p-4 bg-gray-800 rounded-lg border border-gray-700"><h3 className="text-md font-semibold text-white mb-3 uppercase tracking-wider">Tags</h3><div className="flex flex-wrap gap-2">{tags.map(tag => (<Link key={tag._id.toString()} href={`/blog/tag/${encodeURIComponent(tag.name.toLowerCase())}`} className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-600 transition-colors">#{tag.name}</Link>))}</div></div>)}</div>);
};

const ListItemRenderer = ({ item }: { item: { content: string, items: any[] } }) => {
  return <li><span dangerouslySetInnerHTML={{ __html: item.content }} />{item.items && item.items.length > 0 && (<ul className="list-disc pl-5 space-y-2 my-2">{item.items.map((subItem, index) => (<ListItemRenderer key={index} item={subItem} />))}</ul>)}</li>;
};

const PostRenderer = ({ contentBlocks }: { contentBlocks?: IContentBlock[] | null }) => {
  if (!contentBlocks || !Array.isArray(contentBlocks)) return null;
  return (
    <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400">
      {contentBlocks.map((block) => {
        const id = block.type === 'header' ? (block.data.text ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : block.id;
        switch (block.type) {
          case 'header':
            const { level, text } = block.data;
            if (!text || !level) return null;
            if (level === 1) return <h1 key={block.id} id={id} className="text-4xl font-bold" dangerouslySetInnerHTML={{ __html: text }} />;
            if (level === 2) return <h2 key={block.id} id={id} className="text-3xl font-bold mt-10" dangerouslySetInnerHTML={{ __html: text }} />;
            if (level === 3) return <h3 key={block.id} id={id} className="text-2xl font-semibold mt-8" dangerouslySetInnerHTML={{ __html: text }} />;
            return null;
          case 'paragraph':
            return <div key={block.id} className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: block.data.text }} />;
          case 'image':
            return <figure key={block.id} className="my-8"><Image src={block.data.file.url} alt={block.data.caption ?? 'Blog image'} width={800} height={450} className="rounded-lg w-full h-auto object-cover" /><figcaption className="text-center text-sm text-gray-400 mt-2">{block.data.caption}</figcaption></figure>;
          case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            const listStyle = block.data.style === 'ordered' ? 'list-decimal' : 'list-disc';
            return <ListTag key={block.id} className={`${listStyle} pl-5 space-y-2 my-4`}>{block.data.items.map((item: any, index: number) => (<ListItemRenderer key={index} item={item} />))}</ListTag>;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default function BlogPostLayout({ post }: { post: IPost }) {
  const categories = (post.categories as ICategory[]) || [];
  const tags = (post.tags as ITag[]) || [];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <TableOfContents contentBlocks={post.content?.blocks} />
          </div>
        </aside>
        <main className="lg:col-span-6">
          <BackToBlogs />
          <article>
            {post.featuredImageUrl && (
              <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
                <Image src={post.featuredImageUrl} alt={post.title} fill className="object-cover" priority />
              </div>
            )}
            <PostRenderer contentBlocks={post.content?.blocks} />
          </article>
        </main>
        <aside className="lg:col-span-3 mt-12 lg:mt-0">
          <div className="sticky top-24">
            <PostMeta categories={categories} tags={tags} />
          </div>
        </aside>
      </div>
    </div>
  );
}