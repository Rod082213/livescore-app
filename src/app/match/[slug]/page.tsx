// src/app/match/[slug]/page.tsx

import Header from '@/components/Header';
import SportsNav from '@/components/SportsNav';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import MatchHeader from '@/components/match/MatchHeader';
import MatchTimeline from '@/components/match/MatchTimeline';
import MatchStatistics from '@/components/match/MatchStatistics';
import HeadToHead from '@/components/match/HeadToHead';
import PredictionForm from '@/components/match/PredictionForm';
import WelcomeOffer from '@/components/match/WelcomeOffer';
import MatchDescription from '@/components/match/MatchDescription';
import MatchLineups from '@/components/match/MatchLineups';

import Link from 'next/link';
import { notFound } from 'next/navigation';

// --- CLEANED UP IMPORTS ---
import { fetchMatchDetailsById, getMatchHighlights, fetchMatchLineups } from '@/lib/api'; 
import { Highlight } from '@/lib/types';

// --- NEW COMPONENT IMPORT ---
import MatchHighlightsVideo from '@/components/match/MatchHighlightsVideo';

export default async function MatchDetailPage({ params }: { params: { slug: string } }) {
  
  const { slug } = params;
  const slugParts = slug.split('-');
  const matchId = slugParts[slugParts.length - 1];

  if (!matchId || isNaN(parseInt(matchId))) {
    return (
      <div className="bg-[#1d222d] text-gray-200 min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Invalid URL</h1>
          <p className="mt-4">The match ID could not be found in the URL.</p>
          <Link href="/" className="mt-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">Go Home</Link>
      </div>
    );
  }

  // Fetch primary data first
  const [matchDetails, lineups] = await Promise.all([
    fetchMatchDetailsById(matchId),
    fetchMatchLineups(matchId),
  ]);

  // If the primary match data doesn't exist, show a 404 page
  if (!matchDetails) {
    notFound();
  }

  // --- SIMPLIFIED DATA FETCHING LOGIC ---
  const isFinished = matchDetails.status === 'FT';
  let highlights: Highlight[] = [];

  // Only fetch highlights if the match is finished
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
        
        {/* --- CONDITIONAL HIGHLIGHTS DISPLAY --- */}
        {/* If the match is finished and we found highlights, display them here */}
       
        
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

          <div className="lg:col-span-1 space-y-6 lg:sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto">
  <PredictionForm 
    predictions={matchDetails.predictions} 
    form={matchDetails.form}
    teams={{ home: matchDetails.homeTeam, away: matchDetails.awayTeam }} 
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