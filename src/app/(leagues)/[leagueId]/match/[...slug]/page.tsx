import { notFound } from 'next/navigation';

// Import your data fetching functions
import { fetchMatchDetailsById, getMatchHighlights } from '@/lib/api';

// Import the UI components needed for this page
// import MatchDetailHeader from '@/components/match/MatchDetailHeader'; // The top component with the score
// import MatchTimeline from '@/components/match/MatchEvent';         // Your component for the timeline
import MatchStatistics from '@/components/match/MatchStatistics';       // Your component for stats
import HeadToHead from '@/components/match/HeadToHead';           // Your component for H2H
import PredictionForm from '@/components/match/PredictionForm';     // The widget on the right
import MatchHighlights from '@/components/match/MatchHighlights';   // Our NEW highlights component

// The page receives params from the URL, including leagueId and the slug array
interface MatchPageProps {
  params: {
    leagueId: string;
    slug: string[]; // e.g., ['chelsea-vs-arsenal', '12345']
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  // The actual ID for the match is the last item in the 'slug' array
  const matchId = params.slug[params.slug.length - 1];

  if (!matchId) {
    // If for some reason there's no ID, show a 404 page
    notFound();
  }

  // Fetch match details and highlights in parallel for better performance
  const [matchDetails, matchHighlights] = await Promise.all([
    fetchMatchDetailsById(matchId),
    getMatchHighlights(matchId) // This calls our new function
  ]);

  // If the primary match data couldn't be fetched, it's a 404
  if (!matchDetails) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      {/* 1. The main scoreboard header component */}
      <MatchDetailHeader match={matchDetails} />

      {/* 2. The main grid layout for content below the scoreboard */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <MatchTimeline events={matchDetails.events || []} />

          {/* ✨ ADD THE NEW HIGHLIGHTS COMPONENT HERE ✨ */}
          {/* It will render right below the timeline, and only if highlights exist. */}
          <MatchHighlights highlights={matchHighlights} />
          
          <MatchStatistics stats={matchDetails.statistics || {}} />
          {/* You would add your Head-to-Head component here too */}
          {/* <HeadToHead h2hData={...} /> */}
        </div>
        
        {/* Right Sidebar Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <PredictionForm match={matchDetails} />
          {/* ... any other right sidebar widgets ... */}
        </div>

      </div>
    </div>
  );
}