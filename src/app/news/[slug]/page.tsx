// src/app/news/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from 'next';
// Data fetching functions
import { fetchNewsBySlug, fetchNewsList } from "@/lib/news-api";
import { fetchTeamOfTheWeek, fetchTopLeagues } from "@/lib/api";
// Component Imports
import ArticleBody from "@/components/ArticleBody";
import BackToNewsButton from "@/components/BackToNewsButton";
import Header from "@/components/Header";
import SportsNav from "@/components/SportsNav";
import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

type Props = { params: { slug: string } };

// This metadata function is correct.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ... (no changes needed here)
}

// This page component is correct.
export default async function NewsArticlePage({ params }: Props) {
  // --- FETCH ALL NECESSARY DATA IN PARALLEL ---
  const [
    article,
    allNews,
    teamOfTheWeek,
    topLeagues,
  ] = await Promise.all([
    fetchNewsBySlug(params.slug),
    fetchNewsList(),
    fetchTeamOfTheWeek(),
    fetchTopLeagues(),
  ]);

  if (!article) {
    notFound();
  }

  // --- THIS LINE IS CORRECT ---
  // It takes the first 4 articles from the list.
  const latestNewsForSidebar = allNews.slice(0,5);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">

          {/* --- LEFT SIDEBAR (Column 1) --- */}
          <aside className="w-full lg:w-64 lg:order-1 flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
            <LeftSidebar 
              teamOfTheWeek={teamOfTheWeek} 
              latestNews={latestNewsForSidebar} // This correctly receives the 4 articles
            />
          </aside>
          
          {/* --- MAIN ARTICLE CONTENT (Column 2) --- */}
          <main className="w-full lg:flex-1 lg:order-2 lg:min-w-0">
            <article className="bg-[#2b3341] p-4 sm:p-6 rounded-lg">
              <BackToNewsButton text="Back to All News" />
              <ArticleBody article={article} />
            </article>
          </main>
          
          {/* --- RIGHT SIDEBAR (Column 3) --- */}
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