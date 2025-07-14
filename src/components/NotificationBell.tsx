// src/components/NotificationBell.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { NewsArticleSummary } from '@/lib/types';
import { fetchNewsList } from '@/lib/news-api';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState<NewsArticleSummary[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to check for new news
    const checkForNewNews = async () => {
      try {
        const latestNews = await fetchNewsList();
        if (latestNews && latestNews.length > 0) {
          setNews(latestNews.slice(0, 5)); // Keep the top 5 for the dropdown

          // Check if there's news the user hasn't seen
          const lastSeenArticleId = localStorage.getItem('lastSeenArticleId');
          const latestArticleId = latestNews[0].id || latestNews[0]._id;

          if (latestArticleId !== lastSeenArticleId) {
            setHasNew(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch news for notification bell:", error);
      }
    };

    // Check immediately on mount, then poll every 60 seconds
    checkForNewNews();
    const interval = setInterval(checkForNewNews, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Effect to close dropdown when clicking outside
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
    // When the user opens the dropdown, mark the latest news as "seen"
    if (news.length > 0) {
      const latestArticleId = news[0].id || news[0]._id;
      localStorage.setItem('lastSeenArticleId', latestArticleId);
      setHasNew(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleBellClick} className="relative p-2 text-gray-300 hover:text-white">
        <Bell size={24} />
        {hasNew && (
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#2b3341] rounded-lg shadow-lg border border-gray-700 z-50">
          <div className="p-3 border-b border-gray-700">
            <h3 className="font-semibold text-white">Latest News</h3>
          </div>
          <ul className="py-1 max-h-96 overflow-y-auto">
            {news.length > 0 ? (
              news.map(article => (
                <li key={article.id || article._id}>
                  <Link 
                    href={`/news/${article.slug}`} 
                    className="flex items-start gap-3 p-3 hover:bg-gray-700/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative w-16 h-12 flex-shrink-0">
                      <Image 
                        src={article.image_url} 
                        alt={article.title} 
                        fill 
                        sizes="64px" 
                        className="rounded-md object-cover" 
                      />
                    </div>
                    <p className="text-sm font-medium text-white leading-tight">
                      {article.title}
                    </p>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-sm text-gray-400">No news available.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;