// src/components/match/MatchHeader.tsx

import Image from 'next/image';
import { Shield, Calendar, Clock, MapPin } from 'lucide-react';

// It's a good practice to use a specific type instead of 'any' if you have one defined.
const MatchHeader = ({ match }: { match: any }) => {
  if (!match) return null; // Prevent errors if match is not loaded

  // A helper to safely display the score, which can be a string or an object
  const renderScore = () => {
    if (typeof match.score === 'string') return match.score;
    if (match.score && typeof match.score.home !== 'undefined') {
      return `${match.score.home} - ${match.score.away}`;
    }
    return '-'; // Fallback
  };

  return (
    <div className="bg-[#242a35] rounded-lg relative overflow-hidden text-white shadow-xl">
      
      {/* Background Image - Corrected to fill the container and be transparent */}
       <Image
        src="/stadium-bg.jpg" // Make sure this image is in your /public folder
        alt="Stadium background"
        layout="fill"
 
        quality={100}
        // Using inset-0 to fill the container and opacity-10 for a subtle effect
        className="absolute inset-0 opacity-10"
      />

      {/* Foreground content sits on top of the background */}
      <div className="relative p-6 md:p-8 flex flex-col items-center">
       
        {/* --- THIS IS THE NEW H1 TAG YOU REQUESTED --- */}
        {/* It is now the main title of the page for SEO purposes. */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </h1>

        {/* Teams and Score (Existing code is unchanged as requested) */}
        <div className="flex items-center justify-around w-full max-w-3xl mb-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={96} height={96} />
            <h2 className="text-2xl font-bold">{match.homeTeam.name}</h2>
          </div>
          <div className="text-6xl font-bold">{renderScore()}</div>
          <div className="flex flex-col items-center gap-4 text-center">
            <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={96} height={96} />
            <h2 className="text-2xl font-bold">{match.awayTeam.name}</h2>
          </div>
        </div>
        
        {/* Match Metadata (Existing code is unchanged) */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-300 text-sm border-t border-white/10 pt-4 w-full">
          <span className="flex items-center gap-2"><Shield size={16}/> {match.leagueName}</span>
          <span className="flex items-center gap-2"><Calendar size={16}/> {match.date}</span>
          <span className="flex items-center gap-2"><Clock size={16}/> {match.time}</span>
          {match.venue && ( // Conditionally render venue only if it exists
            <span className="flex items-center gap-2"><MapPin size={16}/> {match.venue}</span>
          )}
        </div>
      </div>
      
      {/* Status Bar (Existing code is unchanged) */}
      <div className="relative bg-blue-600 text-center py-2 font-semibold">
        {match.status}
      </div>
    </div>
  );
};

export default MatchHeader;