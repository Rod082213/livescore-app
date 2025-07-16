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
import { fetchMatchDetailsById, getMatchHighlights } from '@/lib/api'; 
import MatchHighlights from '@/components/match/MatchHighlights';

// The props are destructured directly in the function signature
export default async function MatchDetailPage({ params }: { params: { slug: string } }) {
  
  // --- FIX for the Next.js warning ---
  // We extract the slug from the destructured params
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

  // Fetch match details from the football API
  const matchDetails = await fetchMatchDetailsById(matchId);

  if (!matchDetails) {
    return (
      <div className="bg-[#1d222d] text-gray-200 min-h-screen">
        <Header />
        <SportsNav />
        <main className="container mx-auto px-4 py-6 flex flex-col items-center justify-center text-center h-[50vh]">
            <h1 className="text-4xl font-bold">404 - Match Not Found</h1>
            <p className="mt-4 text-gray-400">Sorry, we couldn't find the details for this match (ID: {matchId}).</p>
            <BackButton />
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch highlights from the highlights API
  const matchHighlights = await getMatchHighlights(matchId, matchDetails.status);

  // Now we render the page with the real data
  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />

      <main className="container mx-auto px-4 py-6">
        <BackButton />
        <MatchHeader match={matchDetails} />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            <MatchTimeline events={matchDetails.events} status={matchDetails.status} />

            {/* This component correctly receives the (potentially empty) highlights array */}
            <MatchHighlights highlights={matchHighlights} />
            
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