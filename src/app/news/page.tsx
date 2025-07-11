// src/app/news/page.tsx

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// Import all necessary layout components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import ClientOnly from '@/components/ClientOnly';
import SportsNav from "@/components/SportsNav";

// --- THIS IS THE FIX ---
// Import functions from their dedicated API files.
import { fetchAllNews } from "@/lib/news-api";
import { fetchTeamOfTheWeek, fetchTopLeagues } from "@/lib/api";
import { NewsArticleSummary } from '@/lib/types';

/**
 * A reusable component for displaying a single news article card.
 */
const NewsArticleCard = ({ article }: { article: NewsArticleSummary }) => (
  <Link href={`/news/${article.slug}`} key={article.id} className="block group">
    <div className="bg-[#2b3341] rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
      <div className="relative w-full h-48">
        {article.image_url ? (
          <Image src={article.image_url} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gray-700/50 flex items-center justify-center"><span className="text-gray-400 text-sm">No Image</span></div>
        )}
      </div>
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{article.title}</h2>
        <p className="text-gray-400 text-sm mb-4 flex-grow">{article.description ? `${article.description.slice(0, 100)}...` : 'No summary available.'}</p>
        <p className="text-xs text-gray-500 mt-auto pt-3 border-t border-gray-700/50">
          <ClientOnly>
            {new Date(article.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </ClientOnly>
        </p>
      </div>
    </div>
  </Link>
);


/**
 * The main page component, now fetching from the correct API files.
 */
export default async function NewsListingPage() {
  const [
    allNews,
    teamOfTheWeek,
    topLeagues,
    
  ] = await Promise.all([
    fetchAllNews(),
    fetchTeamOfTheWeek(),
    fetchTopLeagues(),
   
  ]);

  const latestNewsForSidebar = allNews.slice(0, 5);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav/>
      
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          
          <aside className="w-full lg:w-64 lg:order-1 flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
            <LeftSidebar 
              teamOfTheWeek={teamOfTheWeek} 
              latestNews={latestNewsForSidebar} 
            />
          </aside>
          
          <main className="w-full lg:flex-1 lg:order-2 lg:min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
              Latest News
            </h1>
            {allNews && allNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allNews.map((article) => (
                  <NewsArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#2b3341] rounded-lg">
                <p className="text-gray-300 text-xl font-semibold">No News Articles Found</p>
                <p className="text-gray-500 text-md mt-2">Please check back later.</p>
              </div>
            )}
          </main>
          
          <aside className="hidden lg:block lg:w-72 lg:order-3 flex-shrink-0 lg:sticky lg:top-8 lg:self-start">
            <RightSidebar 
              initialTopLeagues={topLeagues} 
              initialFeaturedMatch={null}
            />
          </aside>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

/**
 * Metadata for better SEO.
 */
export const metadata: Metadata = {
  title: 'Latest News | World Sports',
  description: 'Stay up to date with the latest sports news, analysis, and updates from around the world.',
};