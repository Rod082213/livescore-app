// src/app/news/page.tsx

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import ClientOnly from '@/components/ClientOnly';
import SportsNav from "@/components/SportsNav";
import PaginationControls from '@/components/PaginationControls';

import { fetchNewsList } from "@/lib/news-api";
import { fetchTeamOfTheWeek, fetchTopLeagues } from "@/lib/api";
import { NewsArticleSummary } from '@/lib/types';

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Date not available';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


export default async function NewsListingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [
    allNews,
    teamOfTheWeek,
    topLeagues,
  ] = await Promise.all([
    fetchNewsList(),
    fetchTeamOfTheWeek(),
    fetchTopLeagues(),
  ]);

  const latestNewsForSidebar = allNews.slice(0, 5);

  const page = searchParams['page'] ?? '1';
  const perPage = 6;
  const start = (Number(page) - 1) * perPage;
  const end = start + perPage;
  const paginatedArticles = allNews.slice(start, end);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      
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
            {paginatedArticles && paginatedArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedArticles.map((article) => (
                    // --- THIS IS THE FIX ---
                    // Use a reliable key. Try `article.id` first, and if it's
                    // missing, fall back to the unique `article.slug`.
                    <NewsArticleCard key={article.id || article.slug} article={article} />
                  ))}
                </div>
                
                <PaginationControls
                  hasNextPage={end < allNews.length}
                  hasPrevPage={start > 0}
                  totalArticles={allNews.length}
                  perPage={perPage}
                />
              </>
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

const NewsArticleCard = ({ article }: { article: NewsArticleSummary }) => (
  <Link href={`/news/${article.slug}`} className="block group">
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
        <p className="text-gray-400 text-sm mb-4 flex-grow">{article.summary}</p>
        <p className="text-xs text-gray-500 mt-auto pt-3 border-t border-gray-700/50">
          <ClientOnly>
            {formatDate(article.publishedAt)}
          </ClientOnly>
        </p>
      </div>
    </div>
  </Link>
);


export const metadata: Metadata = {
  title: 'Latest News | World Sports',
  description: 'Stay up to date with the latest sports news, analysis, and updates from around the world.',
};