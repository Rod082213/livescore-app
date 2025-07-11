'use client'; // This is essential for all the interactive logic

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { NewsArticleDetail, Heading } from '@/lib/types';
import ClientOnly from './ClientOnly'; // Your hydration-fix component
import "../css/news.css"; // Your CSS file

interface ArticleBodyProps {
  article: NewsArticleDetail;
}

export default function ArticleBody({ article }: ArticleBodyProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Effect to extract headings from the rendered HTML
  useEffect(() => {
    if (!contentRef.current) return;
    const headingElements = contentRef.current.querySelectorAll('h1, h2, h3');
    const extracted: Heading[] = [];
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

  // Function for smooth scrolling
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
    // The wrapper for the side-by-side layout
    <div className="content-and-toc-wrapper">
      
      {/* Main Article Content */}
      <main className="main-article-content">
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
      </main>

      {/* Table of Contents Sidebar */}
      {headings.length > 0 && (
        <aside className="toc-container">
          <h3>Table of Contents</h3>
          <ul>
            {headings.map((heading) => (
              <li key={heading.id} className={`toc-level-${heading.level}`}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(heading.id);
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}