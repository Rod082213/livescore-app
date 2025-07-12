// src/components/LeftSidebar.tsx

import Image from "next/image";
import Link from "next/link";
import { Player } from "@/data/mockData";
// 1. --- THE FIX: IMPORT THE CORRECT TYPE ---
// We use the consistent NewsArticleSummary type from our types.ts file.
import { NewsArticleSummary } from "@/lib/types";
import ClientOnly from "./ClientOnly"; // Import for safe date formatting

interface LeftSidebarProps {
  teamOfTheWeek: Player[];
  // 2. The component now correctly expects an array of NewsArticleSummary
  latestNews: NewsArticleSummary[];
}

const LeftSidebar = ({ teamOfTheWeek, latestNews }: LeftSidebarProps) => {
    return (
        <div className="space-y-6">
            <div className="bg-[#2b3341] rounded-lg p-4">
                <h3 className="text-md font-bold text-white mb-3">Team of the Week</h3>
                {teamOfTheWeek && teamOfTheWeek.length > 0 ? (
                    <ul className="space-y-3">
                        {teamOfTheWeek.slice(0, 5).map((player) => (
                            <li key={player.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {player.logo ? (
                                        <Image src={player.logo} alt={player.name} width={32} height={32} className="rounded-full bg-gray-600 object-cover"/>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">{player.name.charAt(0)}</div>
                                    )}
                                    <span className="font-medium text-sm text-white">{player.name}</span>
                                </div>
                                <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-md">{player.rating}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-400 py-10 text-sm">Player data is currently unavailable.</div>
                )}
            </div>

            <div className="bg-[#2b3341] rounded-lg p-4">
                <h3 className="text-md font-bold text-white mb-4">Latest News</h3>
                {latestNews && latestNews.length > 0 ? (
                    <ul className="space-y-4">
                        {latestNews.map((article) => (
                            <li key={article.id}>
                               <Link href={`/news/${article.slug}`} className="flex items-start gap-3 group">
                                    {/* 3. USE THE CORRECT PROPERTY NAME: image_url */}
                                    <div className="relative w-20 h-16 flex-shrink-0">
                                        <Image 
                                            src={article.image_url} 
                                            alt={article.title} 
                                            fill
                                            sizes="80px"
                                            className="rounded-md object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        {/* 'keywords' is a string, so we can take the first one */}
                                        <p className="text-teal-400 text-xs font-semibold mb-1 uppercase">
                                            {article.keywords?.split(',')[0] || 'News'}
                                        </p>
                                        <p className="font-medium text-sm text-white group-hover:underline leading-tight">
                                            {article.title}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            {/* 4. FORMAT THE DATE SAFELY */}
                                            <ClientOnly>
                                                {new Date(article.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </ClientOnly>
                                        </p>
                                    </div>
                               </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-400 py-10 text-sm">No recent news available.</div>
                )}
            </div>
        </div>
    );
};

export default LeftSidebar;