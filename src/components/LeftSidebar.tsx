'use client'; 

import Image from "next/image";
import Link from "next/link";
import { Player } from "@/data/mockData";
import { NewsArticleSummary } from "@/lib/types";
import ClientOnly from "./ClientOnly";
import { Carousel } from "./Carousel"; 
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Helper function for safe date formatting
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Date unavailable';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface LeftSidebarProps {
  teamOfTheWeek: Player[];
  latestNews: NewsArticleSummary[];
}

const LeftSidebar = ({ teamOfTheWeek, latestNews }: LeftSidebarProps) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <div className="space-y-6">
      
      {/* --- TEAM OF THE WEEK WIDGET --- */}
      {/* --- THIS IS THE FIX: Added `h-fit` here --- */}
      <div className="bg-[#2b3341] rounded-lg p-4 h-fit">
        <h2 className="text-md font-bold text-white mb-3">Team of the Week</h2>
        {teamOfTheWeek?.length > 0 ? (
          <Carousel active={isMobile}>
            {teamOfTheWeek.slice(0, 5).map((player) => (
              <div key={player.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {player.logo ? <Image src={player.logo} alt={player.name} width={32} height={32} className="rounded-full bg-gray-600 object-cover"/> : <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">{player.name.charAt(0)}</div>}
                  <span className="font-medium text-sm text-white">{player.name}</span>
                </div>
                <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-md">{player.rating}</span>
              </div>
            ))}
          </Carousel>
        ) : <div className="text-center text-gray-400 py-10 text-sm">Player data is currently unavailable.</div>}
      </div>

      {/* --- LATEST NEWS WIDGET --- */}
      {/* --- THIS IS THE FIX: Added `h-fit` here --- */}
      <div className="bg-[#2b3341] rounded-lg p-4 h-fit">
        <h2 className="text-md font-bold text-white mb-4">Latest News</h2>
        {latestNews?.length > 0 ? (
          <Carousel active={isMobile}>
            {latestNews.slice(0, 5).map((article) => (
              <Link href={`/news/${article.slug}`} className="flex items-start gap-3 group" key={article.id || article._id}>
                <div className="relative w-20 h-16 flex-shrink-0">
                  <Image src={article.image_url} alt={article.title} fill sizes="80px" className="rounded-md object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-teal-400 text-xs font-semibold mb-1 uppercase">{article.keywords?.split(',')[0] || 'News'}</p>
                  <p className="font-medium text-sm text-white group-hover:underline leading-tight">{article.title}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    <ClientOnly>{formatDate(article.publishedAt)}</ClientOnly>
                  </p>
                </div>
              </Link>
            ))}
          </Carousel>
        ) : (
          <div className="text-center text-gray-400 py-10 text-sm">No recent news available.</div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;