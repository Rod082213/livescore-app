// src/app/league/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';

// --- Import the required components and functions ---
import SimplifiedRightSidebar from '@/components/SimplifiedRightSidebar';
import LeftSidebar from '@/components/LeftSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import BackButton from "@/components/BackButton";

// Data fetching and utility imports
import { 
  fetchStandings, 
  fetchTopLeagues,
  fetchTeamOfTheWeek,
} from '@/lib/api';
import { fetchNewsList as fetchNewsListFromSource } from '@/lib/news-api'; // Aliased to avoid name conflict
import { createLeagueSlug } from '@/lib/utils';

type Props = { params: { slug: string } };

// Helper function to get the ID from a slug
const getLeagueIdFromSlug = (slug: string): string | null => {
    const parts = slug.split('-');
    const potentialId = parts[parts.length - 1];
    return /^\d+$/.test(potentialId) ? potentialId : null;
};

// --- generateMetadata function WITH CANONICAL AND ROBOTS TAGS ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const leagueId = getLeagueIdFromSlug(params.slug);
  if (!leagueId) {
    return { 
      title: 'Invalid League',
      robots: { index: false } // Don't index invalid pages
    };
  }
  
  const topLeagues = await fetchTopLeagues();
  const league = topLeagues.find(l => l.id.toString() === leagueId);
  if (!league) {
    return { 
      title: 'League Not Found',
      robots: { index: false } // Don't index non-existent leagues
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://todaylivescores.com';
  const canonicalUrl = `${siteUrl}/league/${params.slug}`;
  const title = `${league.name} - Standings, Table & Live Scores`;
  const description = `View the live football standings and table for the ${league.name}. See team rankings, points, games played, and recent form on TodayLiveScores.`;

  return { 
    title, 
    description,
    
    // ADDED: The canonical URL for this specific league page.
    alternates: {
      canonical: canonicalUrl,
    },

    // ADDED: Explicit instructions for search engine crawlers.
    robots: {
      index: true,
      follow: true,
    },

    // ADDED: Open Graph and Twitter tags for rich social sharing.
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'TodayLiveScores',
      images: [
        {
          url: league.logo, // Dynamically use the league's logo!
          alt: `${league.name} logo`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [league.logo],
    },
  };
}

// --- The main page component (no changes needed) ---
export default async function LeagueStandingsPage({ params }: Props) {
  const leagueId = getLeagueIdFromSlug(params.slug);
  if (!leagueId) notFound();

  // Fetch all necessary data in parallel
  const [standings, topLeagues, teamOfTheWeek, allNews] = await Promise.all([
      fetchStandings(leagueId),
      fetchTopLeagues(),
      fetchTeamOfTheWeek(),
      fetchNewsListFromSource()
  ]);
  
  const leagueInfo = topLeagues.find(l => l.id.toString() === leagueId);
  if (!leagueInfo) notFound();

  const latestNewsForSidebar = allNews.slice(0, 3);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="flex items-center gap-4 mb-6">
            <Image src={leagueInfo.logo} alt={leagueInfo.name} width={64} height={64} />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{leagueInfo.name}</h1>
              <p className="text-gray-400">League Standings</p>
            </div>
        </div>
        <div className="lg:flex lg:gap-8">
          
          <aside className="w-full lg:w-64 lg:order-1 flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
            <LeftSidebar 
              teamOfTheWeek={teamOfTheWeek} 
              latestNews={latestNewsForSidebar}
            />
          </aside>

          <main className="w-full lg:flex-1 lg:order-2 lg:min-w-0">
            <div className="bg-[#2b3341] rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                 <thead className="bg-gray-900/50">
                  <tr className="text-gray-300 uppercase tracking-wider">
                    <th className="p-3 text-center">#</th>
                    <th className="p-3">Team</th>
                    <th className="p-3 text-center">P</th>
                    <th className="p-3 text-center">W</th>
                    <th className="p-3 text-center">D</th>
                    <th className="p-3 text-center">L</th>
                    <th className="p-3 text-center">GD</th>
                    <th className="p-3 text-center font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s) => (
                    <tr key={s.team.id} className="border-t border-gray-700 hover:bg-gray-800/40">
                      <td className="p-3 text-center font-semibold">{s.rank}</td>
                      <td className="p-3 flex items-center gap-3 font-medium text-white">
                        <Image src={s.team.logo} alt={s.team.name} width={24} height={24} />
                        {s.team.name}
                      </td>
                      <td className="p-3 text-center">{s.played}</td>
                      <td className="p-3 text-center text-green-400">{s.win}</td>
                      <td className="p-3 text-center text-yellow-400">{s.draw}</td>
                      <td className="p-3 text-center text-red-400">{s.loss}</td>
                      <td className="p-3 text-center">{s.diff}</td>
                      <td className="p-3 text-center font-bold text-white">{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>

          <aside className="hidden lg:block lg:w-72 lg:order-3 flex-shrink-0 lg:sticky lg:top-8 lg:self-start">
            <SimplifiedRightSidebar 
              initialTopLeagues={topLeagues} 
            />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// --- generateStaticParams function is correct ---
export async function generateStaticParams() {
    const topLeagues = await fetchTopLeagues();
    if (!topLeagues || topLeagues.length === 0) return [];

    return topLeagues.map(league => ({
        slug: createLeagueSlug(league.name, league.id),
    }));
}