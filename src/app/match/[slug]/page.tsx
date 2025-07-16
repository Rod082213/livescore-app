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
import Link from 'next/link';
import { notFound } from 'next/navigation';

// --- MODIFIED ---
// Import all necessary data-fetching functions and components
// We've added a new (hypothetical) function to get the live stream.
import { fetchMatchDetailsById, getMatchHighlights, fetchMatchLineups, getLiveStreamForMatch } from '@/lib/api'; 
import MatchHighlights from '@/components/match/MatchHighlights';
import MatchLineups from '@/components/match/MatchLineups';

// --- NEW ---
// Helper array to identify live match statuses. Adjust based on your API's status codes.
const LIVE_STATUSES = ['LIVE', 'IN_PLAY', '1H', 'HT', '2H', 'ET', 'PENALTIES'];

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

  let matchHighlights = [];
  let liveStream = null;

  const isLive = LIVE_STATUSES.includes(matchDetails.status.type);
  const isFinished = matchDetails.status.type === 'FINISHED';

  if (isLive) {
    // If the match is live, fetch the stream data.
    // NOTE: You need to create the `getLiveStreamForMatch` function in your `lib/api.ts`.
    liveStream = await getLiveStreamForMatch(matchId);
  } else if (isFinished) {
    // If the match is finished, fetch the highlights.
    matchHighlights = await getMatchHighlights(matchDetails);
  }
  // If the match is upcoming ('NOT_STARTED'), neither will be fetched.

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />

      <main className="container mx-auto px-4 py-6">
        <BackButton />
        <MatchHeader match={matchDetails} />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* --- MODIFIED COMPONENT --- */}
            {/* Pass BOTH liveStream and highlights to the component. */}
            {/* It will decide which one to display based on the logic we built. */}
            <MatchHighlights 
              highlights={matchHighlights} 
              liveStream={liveStream} 
            />
            
            <MatchTimeline events={matchDetails.events} status={matchDetails.status} />
            <MatchLineups lineups={lineups} />
            
            <MatchStatistics 
              statistics={matchDetails.statistics} 
              status={matchDetails.status} 
            />
            <HeadToHead 
              h2hData={matchDetails.h2h} 
              teams={{ home: matchDetails.homeTeam, away: matchDetails.awayTeam }} 
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
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