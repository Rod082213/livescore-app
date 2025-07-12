// src/app/news/page.tsx

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Newsbar from "@/components/NewsSidebar";
import SportsNav from "@/components/SportsNav";
import {
  fetchAllNews,
  fetchTeamOfTheWeek,
  fetchLatestNews,
  fetchTopLeagues,
} from "@/lib/api";

export default async function NewsListingPage() {
  const [
    allNews, 
   
    topLeagues
  ] = await Promise.all([
    fetchAllNews(),
    fetchTeamOfTheWeek(),
    fetchLatestNews(),
    fetchTopLeagues()
  ]);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-6">
        <div className="lg:flex lg:gap-6">
         
          <main className="w-full lg:flex-1 lg:order-2 lg:min-w-0">
            <div className="bg-[#2b3341] p-4 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-6">All Sports News</h2>
                <div className="space-y-6">
                    {allNews.length > 0 ? (
                        allNews.map((article) => (
                            <Link key={article.id} href={`/news/${article.slug}`} className="block group bg-[#1d222d] p-4 rounded-lg hover:bg-[#343c4c] transition-colors">
                                <div className="flex flex-col md:flex-row items-start gap-4">
                                    <div className="w-full md:w-48 h-40 md:h-28 flex-shrink-0 relative rounded-md overflow-hidden">
                                        <Image
                                            src={article.imageUrl}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-blue-400 font-semibold uppercase mb-1">{article.category}</p>
                                        <h2 className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors mb-2">
                                            {article.title}
                                        </h2>
                                        <p className="text-sm text-gray-400 mb-2">{article.snippet}</p>
                                        <p className="text-xs text-gray-500">{article.date}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-400">No news found.</p>
                    )}
                </div>
            </div>
          </main>
          <aside className="hidden lg:block lg:w-72 lg:order-3 flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
            <Newsbar 
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