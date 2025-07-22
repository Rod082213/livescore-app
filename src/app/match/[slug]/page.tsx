// src/app/match/[slug]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import MatchHeader from '@/components/match/MatchHeader';
import MatchTimeline from '@/components/match/MatchTimeline';
import MatchStatistics from '@/components/match/MatchStatistics';
import HeadToHead from '@/components/match/HeadToHead';
import MatchPrediction from '@/components/match/PredictionForm';
import WelcomeOffer from '@/components/match/WelcomeOffer';
import MatchDescription from '@/components/match/MatchDescription';
import MatchLineups from '@/components/match/MatchLineups';
import MatchHighlightsVideo from '@/components/match/MatchHighlightsVideo';
import { fetchMatchDetailsById, getMatchHighlights, fetchMatchLineups } from '@/lib/api';
import { Highlight } from '@/lib/types';
import { format } from 'date-fns';

// --- DYNAMIC METADATA GENERATION (WITH ADDITIONS) ---

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const slugParts = slug.split('-');
  const matchId = slugParts[slugParts.length - 1];

  if (!matchId || isNaN(parseInt(matchId))) {
    return { title: 'Match Not Found' };
  }

  const match = await fetchMatchDetailsById(matchId);

  if (!match) {
    return {
      title: 'Match Not Found',
      robots: { index: false, follow: false },
    };
  }

  const { homeTeam, awayTeam, status, score, league } = match;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://todaylivescores.com';
  const canonicalUrl = `${siteUrl}/match/${slug}`;
  
  let metaTitle = `${homeTeam.name} vs ${awayTeam.name} - Match Preview`;
  let metaDescription = `Get ready for the ${league.name} match between ${homeTeam.name} and ${awayTeam.name}. Check H2H stats, form, and predictions.`;
  // ADDED: Dynamic keywords based on match status with a limit of 3
  let dynamicKeyword = 'match preview';

  switch (status) {
    case 'LIVE':
    case 'HT':
      metaTitle = `LIVE: ${homeTeam.name} vs ${awayTeam.name} (${score.home}-${score.away}) | ${league.name} Score`;
      metaDescription = `Follow live score updates, stats, and key events for the ${homeTeam.name} vs ${awayTeam.name} match. Current score: ${score.home}-${score.away}.`;
      dynamicKeyword = 'live score';
      break;
    case 'FT':
      metaTitle = `Result: ${homeTeam.name} ${score.home} - ${score.away} ${awayTeam.name} | Highlights & Stats`;
      metaDescription = `See the final result, full stats, and watch video highlights for the ${league.name} match between ${homeTeam.name} and ${awayTeam.name}. Final score: ${score.home}-${score.away}.`;
      dynamicKeyword = 'match highlights';
      break;
  }
  
  const publishedDate = match.timestamp && !isNaN(match.timestamp)
    ? new Date(match.timestamp * 1000)
    : new Date();
  
  return {
    title: metaTitle,
    description: metaDescription,
    
    // ADDED: Keywords array with a limit of 3
    keywords: [`${homeTeam.name} vs ${awayTeam.name}`, dynamicKeyword, league.name],

    // ADDED: Author for brand consistency
    authors: [{ name: 'TodayLiveScores' }],

    // ADDED: Publisher for brand consistency
    publisher: 'TodayLiveScores',
    
    // Canonical and Robots tags
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },

    // Open Graph and Twitter tags for social sharing
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'TodayLiveScores',
      images: [
        {
          url: '/social-card-match.png', 
          width: 1200,
          height: 630,
          alt: `Match details for ${homeTeam.name} vs ${awayTeam.name}`,
        },
      ],
      type: 'article',
      publishedTime: publishedDate.toISOString(),
      // ADDED: Author for social sharing consistency
      authors: ['TodayLiveScores'],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ['/social-card-match.png'],
    },
  };
}


// --- THE PAGE COMPONENT ---

export default async function MatchDetailPage({ params }: { params: { slug: string } }) {
  
  const { slug } = params;
  const slugParts = slug.split('-');
  const matchId = slugParts[slugParts.length - 1];

  if (!matchId || isNaN(parseInt(matchId))) {
    notFound();
  }

  const [matchDetails, lineups] = await Promise.all([
    fetchMatchDetailsById(matchId),
    fetchMatchLineups(matchId),
  ]);

  if (!matchDetails) {
    notFound();
  }

  const isFinished = matchDetails.status === 'FT';
  let highlights: Highlight[] = [];

  if (isFinished) {
    highlights = await getMatchHighlights(matchDetails);
  }

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <main className="container mx-auto px-4 py-6">
        <BackButton />
        <MatchHeader match={matchDetails} />
        
      
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              {isFinished && highlights.length > 0 && (
          <MatchHighlightsVideo highlights={highlights} />
        )}
            <MatchTimeline events={matchDetails.events} />
            <MatchLineups lineups={lineups} />
            <MatchStatistics statistics={matchDetails.statistics} />
            <HeadToHead 
              h2hData={matchDetails.h2h}
              teams={{ home: matchDetails.homeTeam, away: matchDetails.awayTeam }} 
            />
          </div>

          <div className="lg:col-span-1 space-y-6 lg:sticky top-6 h-fit">
            <MatchPrediction 
              form={matchDetails.form}
              teams={{ home: matchDetails.homeTeam, away: matchDetails.awayTeam }} 
              status={matchDetails.status}
              score={matchDetails.score}
            />
            <MatchDescription />
            <WelcomeOffer />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}