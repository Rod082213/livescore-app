// src/components/NotificationBell.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Loader2 } from 'lucide-react';
import { NewsArticleSummary } from '@/lib/types';
import { fetchNewsList } from '@/lib/news-api';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState<NewsArticleSummary[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkForNewNews = async () => {
      try {
        const latestNews = await fetchNewsList();
        if (latestNews && latestNews.length > 0) {
          setNews(latestNews.slice(0, 5)); 
          const lastSeenArticleId = localStorage.getItem('lastSeenArticleId');
          const latestArticleId = latestNews[0].id || latestNews[0]._id;
          if (latestArticleId && latestArticleId !== lastSeenArticleId) {
            setHasNew(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch news for notification bell:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkForNewNews();
    const interval = setInterval(checkForNewNews, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (hasNew && news.length > 0) {
      const latestArticleId = news[0].id || news[0]._id;
      localStorage.setItem('lastSeenArticleId', latestArticleId);
      setHasNew(false);
    }
  };

  return (
    // --- THIS IS THE FIX ---
    // By removing `md:static`, this div remains `relative` on all screen sizes.
    // This makes it the positioning anchor for the absolute-positioned dropdown menu.
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleBellClick} 
        className="relative p-2 text-gray-300 hover:text-white transition-colors"
        aria-label="View notifications"
      >
        <Bell size={24} />
        {hasNew && (
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        // Now, this dropdown's `md:right-0` aligns it to the right edge
        // of its immediate parent, which is exactly what we want.
        <div 
          className="
            fixed top-16 left-0 w-full bg-[#1d222d] border-b border-gray-700 z-50
            md:absolute md:top-full md:right-0 md:mt-2 md:w-96 md:rounded-lg md:border
          "
        >
          <div className="flex justify-between items-center p-3 border-b border-gray-700">
            <h3 className="font-semibold text-white">Latest News</h3>
            <Link href="/news" className="text-xs text-blue-400 hover:underline" onClick={() => setIsOpen(false)}>
              View All
            </Link>
          </div>
          <ul className="py-1 max-h-[70vh] md:max-h-96 overflow-y-auto">
            {isLoading ? (
              <li className="flex justify-center items-center p-10">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </li>
            ) : news.length > 0 ? (
              news.map(article => (
                <li key={article.id || article._id}>
                  <Link 
                    href={`/news/${article.slug}`} 
                    className="flex items-start gap-3 p-3 hover:bg-gray-700/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative w-16 h-12 flex-shrink-0">
                      {article.image_url ? (
                        <Image 
                          src={article.image_url} 
                          alt={article.title} 
                          fill 
                          sizes="64px" 
                          className="rounded-md object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 rounded-md"></div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-white leading-tight">
                      {article.title}
                    </p>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-sm text-gray-400">No recent news available.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;