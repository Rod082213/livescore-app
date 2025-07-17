"use client";

import { useState, useEffect } from 'react';
import { DailyPageData, Match, Highlight } from '@/lib/types';
import { format } from 'date-fns';
import { Loader2, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

// Fetches the data for a specific date from the API.
async function getDailyDataForDate(date: Date): Promise<DailyPageData> {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const response = await fetch(`/api/daily-matches-and-highlights?date=${formattedDate}`);
  if (!response.ok) {
    // Return a default empty structure in case of an error
    return { liveWithStreams: [], upcomingMatches: [], finishedWithHighlights: [] };
  }
  return response.json();
}

// A reusable card component to display a video highlight.
const VideoCard = ({ video, match }: { video: Highlight, match?: Match }) => (
  <div key={video.id} className="bg-[#182230] rounded-lg overflow-hidden shadow-lg">
      <div className="aspect-video bg-black">
        <iframe
          src={video.embedUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen className="w-full h-full"
        ></iframe>
      </div>
      <div className="p-4">
        {match && <p className="text-sm text-gray-400">{match.homeTeam.name} vs {match.awayTeam.name}</p>}
        <h3 className="font-semibold text-white truncate" title={video.title}>
          {video.title}
        </h3>
      </div>
  </div>
);

export default function HighlightsClientPage({ initialData, initialDate }: { initialData: DailyPageData, initialDate: Date }) {
  const [pageData, setPageData] = useState<DailyPageData>(initialData);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to fetch new data when the selected date changes.
  useEffect(() => {
    const loadDataForNewDate = async () => {
      setIsLoading(true);
      const newData = await getDailyDataForDate(selectedDate);
      setPageData(newData);
      setIsLoading(false);
    };

    const isInitialDate = format(initialDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    if (!isInitialDate) {
        loadDataForNewDate();
    } else {
        // If the user navigates back to the initial date, restore server-fetched data.
        setPageData(initialData);
    }
  }, [selectedDate, initialDate]);

  // A helper component for section titles.
  const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white pb-2">
            {icon} {title}
        </h2>
        {children}
    </div>
  );
  
  return (
    <div>
      <div className="mb-8">
          <div className="flex items-center gap-2 bg-[#2b3341] p-2 rounded-md max-w-xs">
            <CalendarIcon className="h-5 w-5 text-gray-400"/>
            <input 
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="bg-transparent text-white w-full focus:outline-none"
              style={{colorScheme: 'dark'}}
            />
          </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : (
        <>
          <Section title="Finished Highlights" icon={<CheckCircle className="text-green-500"/>}>
            {pageData.finishedWithHighlights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageData.finishedWithHighlights.map(({ match, highlight }) => (
                  <VideoCard key={highlight.id} video={highlight} match={match} />
                ))}
              </div>
            ) : <p className="text-gray-400">No highlights available for finished matches on this day.</p>}
          </Section>
        </>
      )}

      <div className="bg-[#2b3341] rounded-lg p-6 mt-4">
          <h3 className="text-lg font-bold text-white mb-2">About Highlights</h3>
          <p className="text-sm text-justify text-gray-300 mb-4">
              <span className="text-blue-400 font-bold">TodayLivescore Highlights</span> is your go-to destination for reliving the best moments in sports. Whether you missed the match or just want to see that stunning goal again, we’ve got you covered with fast, reliable, and high-quality highlights. From last-minute winners to jaw-dropping saves and top goal scorers, our platform brings you closer to the action—anytime, anywhere.
              <br/><br/>
              We cover the biggest tournaments and leagues in the world, including the Premier League, La Liga, Serie A, UEFA Champions League, and The Super League. We also give you front-row access to top local events like the Basketball National League (BNL) and the South African Open (Tennis)—because we know how important local sports are to fans here in South Africa. Looking for today's live score highlights in South Africa? Want to catch up on yesterday’s match results or the latest football highlights South Africa fans are buzzing about? It’s all here.
              <br/><br/>
              On TodayLivescore, you can do more than just check live scores. Explore full league tables, upcoming fixtures, recent results, and most importantly—watch highlights of the biggest matches. Every clip is carefully curated to feature key moments, top performers, and the plays that changed the game. Our platform will make it easy for you as a player to stay connected with your favorite sports through highlights that truly bring the game to life.
          </p>
      </div>
    </div>
  );
}