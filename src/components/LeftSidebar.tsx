'use client';

import Image from "next/image";
import Link from "next/link";
import { Player, NewsArticleSummary } from "@/lib/types"; // Assuming types are in /lib/types
import { Carousel } from "./Carousel"; // Your custom Carousel component
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"; // Your custom hook

// A small, robust helper function for formatting dates
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Date unavailable';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

interface LeftSidebarProps {
  teamOfTheWeek: Player[];
  latestNews: NewsArticleSummary[];
}

/**
 * A responsive sidebar that displays a carousel on mobile and a 
 * full vertical list of 5 items on desktop.
 */
const LeftSidebar = ({ teamOfTheWeek, latestNews }: LeftSidebarProps) => {
  // This hook determines if the screen is mobile or desktop.
  // The 'lg' breakpoint (1024px) is a good switch point.
  const isMobile = useMediaQuery('(max-width: 1023px)');

  // Slicing logic is handled here to ensure it never displays more than 5
  const teamForDisplay = Array.isArray(teamOfTheWeek) ? teamOfTheWeek.slice(0, 5) : [];
  const newsForDisplay = Array.isArray(latestNews) ? latestNews.slice(0, 5) : [];

  return (
    <aside className="space-y-6">
      
      {/* --- TEAM OF THE WEEK WIDGET --- */}
      <div className="bg-[#2b3341] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
          Team of the Week
        </h3>
        {teamForDisplay.length > 0 ? (
          isMobile ? (
            // --- MOBILE VIEW: RENDER CAROUSEL ---
            <Carousel options={{ loop: true }}>
              {teamForDisplay.map((player) => (
                <div key={player.id || player.name} className="flex items-center justify-between gap-3 flex-[0_0_100%]">
                  <div className="flex items-center gap-3">
                    <Image src={player.logo} alt={`${player.name} logo`} width={32} height={32} className="rounded-full bg-gray-600 object-cover"/>
                    <span className="font-medium text-sm text-white">{player.name}</span>
                  </div>
                  <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-md">{parseFloat(player.rating).toFixed(1)}</span>
                </div>
              ))}
            </Carousel>
          ) : (
            // --- DESKTOP VIEW: RENDER VERTICAL LIST ---
            <ul className="space-y-4">
              {teamForDisplay.map((player) => (
                <li key={player.id || player.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Image src={player.logo} alt={`${player.name} logo`} width={32} height={32} className="rounded-full bg-gray-600 object-cover"/>
                    <span className="font-medium text-sm text-white">{player.name}</span>
                  </div>
                  <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-md">{parseFloat(player.rating).toFixed(1)}</span>
                </li>
              ))}
            </ul>
          )
        ) : (
          <p className="text-center text-gray-400 py-8 text-sm">Team of the Week data is unavailable.</p>
        )}
      </div>

      {/* --- LATEST NEWS WIDGET --- */}
      <div className="bg-[#2b3341] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
          Latest News
        </h3>
        {newsForDisplay.length > 0 ? (
          isMobile ? (
            // --- MOBILE VIEW: RENDER CAROUSEL ---
            <Carousel options={{ loop: true }}>
              {newsForDisplay.map((article) => (
                <Link href={`/news/${article.slug}`} className="flex items-start gap-3 group flex-[0_0_100%]" key={article.id || article.slug}>
                  <div className="relative w-24 h-16 flex-shrink-0">
                    <Image src={article.image_url || '/placeholder-image.jpg'} alt={article.title} fill sizes="100px" className="rounded-md object-cover"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-teal-400 text-xs font-semibold mb-1 uppercase">{article.keywords?.split(',')[0] || 'News'}</p>
                    <p className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors leading-tight">{article.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{formatDate(article.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </Carousel>
          ) : (
            // --- DESKTOP VIEW: RENDER VERTICAL LIST ---
            <ul className="space-y-4">
              {newsForDisplay.map((article) => (
                <li key={article.id || article.slug}>
                  <Link href={`/news/${article.slug}`} className="flex items-start gap-3 group">
                    <div className="relative w-24 h-16 flex-shrink-0">
                      <Image src={article.image_url || '/placeholder-image.jpg'} alt={article.title} fill sizes="100px" className="rounded-md object-cover"/>
                    </div>
                    <div className="flex-1">
                      <p className="text-teal-400 text-xs font-semibold mb-1 uppercase">{article.keywords?.split(',')[0] || 'News'}</p>
                      <p className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors leading-tight">{article.title}</p>
                      <p className="text-gray-400 text-xs mt-1">{formatDate(article.publishedAt)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : (
          <p className="text-center text-gray-400 py-8 text-sm">No recent news available.</p>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;