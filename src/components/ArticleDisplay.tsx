'use client';

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { NewsArticleDetail, Heading } from '@/lib/types';
import ClientOnly from './ClientOnly';
import "../css/news.css"; // Ensure this CSS file is imported for styling

interface ArticleDisplayProps {
  article: NewsArticleDetail;
}

export default function ArticleDisplay({ article }: ArticleDisplayProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // This effect extracts headings for the Table of Contents
  useEffect(() => {
    if (!contentRef.current) return;

    const headingElements = contentRef.current.querySelectorAll('h1, h2, h3');
    const extracted: Heading[] = [];

    // --- THIS IS THE CORRECTED forEach LOOP ---
    headingElements.forEach((h, index) => {
      const element = h as HTMLElement;
      element.id = element.id || `heading-${index}`;
      extracted.push({
        id: element.id,
        text: element.innerText,
        level: parseInt(element.tagName.substring(1)),
      });
    });

    setHeadings(extracted);
  }, [article.full_article]);

  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', `#${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    // This is the main return statement from your original file's logic
    <>
      <header>
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
      
      <div  
        ref={contentRef}
        className="prose prose-invert prose-lg max-w-none text-gray-300"
        dangerouslySetInnerHTML={{ __html: article.full_article || "" }} 
      />
    </>
  );
}