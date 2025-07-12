'use client';

// No longer need useState, useEffect, useRef, or Heading type for the TOC
import Image from "next/image";
import { NewsArticleDetail } from '@/lib/types';
import ClientOnly from './ClientOnly';
import "../css/news.css";

interface ArticleDisplayProps {
  article: NewsArticleDetail;
}

// The robust formatDate function remains useful
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Date not available';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date format';
  return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function ArticleDisplay({ article }: ArticleDisplayProps) {
  // All state, refs, and effects for the TOC have been removed.

  return (
    // The wrapper class is no longer needed if there is no TOC
    <div> 
      <main>
        <header>
          <h1 className="text-3xl lg:text-4xl font-bold text-white my-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-sm text-blue-400 font-semibold uppercase">
            {article.category?.join(', ')}
          </p>
          <p className="text-gray-400">
            Published on
            <ClientOnly>
              <span> {formatDate(article.pubDate)}</span>
            </ClientOnly>
          </p>
        </header>

        <div className="relative w-full h-64 md:h-96 my-8 rounded-lg overflow-hidden">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* The ref is no longer needed on this div */}
        <div
          className="prose prose-invert prose-lg max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: article.full_article || "" }}
        />
      </main>

      {/* The entire TOC <aside> block has been removed. */}
    </div>
  );
}