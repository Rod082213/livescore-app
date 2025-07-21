// src/app/match/[slug]/page.tsx

import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import MatchHeader from '@/components/match/MatchHeader';
import MatchTimeline from '@/components/match/MatchTimeline';
import MatchStatistics from '@/components/match/MatchStatistics';
import HeadToHead from '@/components/match/HeadToHead';
import MatchPrediction from '@/components/match/PredictionForm'; // Or your renamed component
import WelcomeOffer from '@/components/match/WelcomeOffer';
import MatchDescription from '@/components/match/MatchDescription';
import MatchLineups from '@/components/match/MatchLineups';
import MatchHighlightsVideo from '@/components/match/MatchHighlightsVideo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchMatchDetailsById, getMatchHighlights, fetchMatchLineups } from '@/lib/api'; 
import { Highlight, Match } from '@/lib/types';
import { format, subMonths } from 'date-fns';

// --- (Your generateFakeApiH2hData function would be here if you're using it) ---

export default async function MatchDetailPage({ params }: { params: { slug: string } }) {
  
  const { slug } = params;
  const slugParts = slug.split('-');
  const matchId = slugParts[slugParts.length - 1];

  if (!matchId || isNaN(parseInt(matchId))) { /* ... error handling ... */ }

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

  // ... (your h2hDataToDisplay logic here) ...

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <main className="container mx-auto px-4 py-6">
        <BackButton />
        <MatchHeader match={matchDetails} />
        
        {isFinished && highlights.length > 0 && (
          <MatchHighlightsVideo highlights={highlights} />
        )}
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MatchTimeline events={matchDetails.events} />
            <MatchLineups lineups={lineups} />
            <MatchStatistics statistics={matchDetails.statistics} />
            <HeadToHead 
              h2hData={matchDetails.h2h} // or h2hDataToDisplay
              teams={{ home: matchDetails.homeTeam, away: matchDetails.awayTeam }} 
            />
          </div>

          {/* --- THIS IS THE CORRECTED SECTION --- */}
          <div className="lg:col-span-1 space-y-6 lg:sticky top-6 h-fit">
            <MatchPrediction 
              form={matchDetails.form}
              teams={{ home: matchDetails.homeTeam, away: matchDetails.awayTeam }} 
              status={matchDetails.status}
              score={matchDetails.score}
            />
            {/* 
              NOTE: The MatchDescription component seems to have been replaced by the prediction component. 
              If you have multiple widgets, they will all stack vertically without scrolling.
              For example:
            */}
            <MatchDescription />
            <WelcomeOffer />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}