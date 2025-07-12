// src/app/news/[slug]/page.tsx (COMPLETE AND FINAL)

import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import SportsNav from "@/components/SportsNav";
import RightSidebar from "@/components/RightSidebar";
import BackToNewsButton from "@/components/BackToNewsButton"; // <-- IMPORT THE NEW BUTTON
import {
  fetchNewsBySlug,
  fetchTeamOfTheWeek,
  fetchLatestNews,
  fetchTopLeagues,
} from "@/lib/api";

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const [
    article, 
    teamOfTheWeek, 
    latestNews, 
    topLeagues
  ] = await Promise.all([
    fetchNewsBySlug(params.slug),
    fetchTeamOfTheWeek(),
    fetchLatestNews(),
    fetchTopLeagues()
  ]);

  if (!article) {
    notFound();
  }

  const featuredMatch = null;

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />

      <div className="container mx-auto px-4 py-6">
        <div className="lg:flex lg:gap-6">
          <aside className="w-full lg:w-64 lg:order-1 flex-shrink-0 mb-6 lg:mb-0 lg:sticky lg:top-4 lg:self-start">
            <LeftSidebar 
              teamOfTheWeek={teamOfTheWeek} 
              latestNews={latestNews} 
            />
          </aside>
          <main className="w-full lg:flex-1 lg:order-2 lg:min-w-0">
            <article className="max-w-4xl mx-auto bg-[#2b3341] p-6 rounded-lg">
              
              {/* --- THIS IS THE CHANGE --- */}
              {/* Use the new BackToNewsButton component */}
              <BackToNewsButton text="Back to All News" />

              <header>
                <p className="text-sm text-blue-400 font-semibold uppercase">{article.category}</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-white my-4 leading-tight">{article.title}</h2>
                <p className="text-gray-400">Published on {article.date}</p>
              </header>
              <div className="relative w-full h-64 md:h-96 my-8 rounded-lg overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div 
                className="prose prose-invert prose-lg max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: article.content || "" }} 
              />
            </article>
          </main>
          <aside className="hidden lg:block lg:w-72 lg:order-3 flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
            <RightSidebar 
              initialTopLeagues={topLeagues} 
              initialFeaturedMatch={featuredMatch}
            />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}