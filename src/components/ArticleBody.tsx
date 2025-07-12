'use client';

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { NewsArticleDetail, Heading } from '@/lib/types';
import ClientOnly from './ClientOnly';
import "../css/news.css";

// Helper function to create clean IDs from heading text.
const generateSlug = (text: string): string => {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

interface ArticleBodyProps {
  article: NewsArticleDetail;
}

export default function ArticleBody({ article }: ArticleBodyProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentElement = contentContainerRef.current;
    if (!contentElement) return;

    // This observer will now be disconnected once its job is done.
    const observer = new MutationObserver((mutations, obs) => {
      const headingElements = contentElement.querySelectorAll('h1, h2, h3');

      // If we found no headings, it might be an empty render, so we wait.
      if (headingElements.length === 0) {
        return;
      }

      const extracted: Heading[] = [];
      const usedIds: { [key: string]: number } = {};

      headingElements.forEach((h) => {
        const element = h as HTMLElement;
        const text = element.innerText;
        let baseId = generateSlug(text) || "section";

        if (usedIds[baseId] !== undefined) {
          usedIds[baseId]++;
          element.id = `${baseId}-${usedIds[baseId]}`;
        } else {
          usedIds[baseId] = 0;
          element.id = baseId;
        }
        element.classList.add('scroll-target');
        extracted.push({ id: element.id, text, level: parseInt(element.tagName.substring(1)) });
      });

      setHeadings(extracted);

      // --- THE CRITICAL FIX ---
      // We have successfully found and processed the headings.
      // We MUST disconnect the observer now to prevent it from
      // firing again and causing a render loop.
      obs.disconnect();
    });

    observer.observe(contentElement, { childList: true, subtree: true });

    // This return function is called when the component unmounts.
    // It's good practice to ensure the observer is disconnected here too.
    return () => observer.disconnect();
  }, [article.full_article]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // The completed JSX for the return statement.
  return (
    <div className="content-and-toc-wrapper">
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
          <Image src={article.image_url} alt={article.title} fill className="object-cover" priority />
        </div>
        
        <div
          ref={contentContainerRef}
          className="prose prose-invert prose-lg max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: article.full_article || "" }}
        />
      </main>

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