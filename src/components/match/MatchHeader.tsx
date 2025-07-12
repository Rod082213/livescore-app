// src/components/match/MatchHeader.tsx
import Image from 'next/image';
import { Shield, Calendar, Clock, MapPin } from 'lucide-react';

const MatchHeader = ({ match }: { match: any }) => {
  return (
    // 1. The main container is already 'relative' and 'overflow-hidden', which is perfect.
    // 'relative' is needed for the background image positioning.
    // 'overflow-hidden' ensures the image corners are clipped by the rounded border.
    <div className="bg-[#242a35] rounded-lg relative overflow-hidden text-white">
      
      {/* 2. Add the background Image component here */}
       <Image
        src="/stadium-bg.jpg" // Make sure this image is in your /public folder
        alt="Stadium background"
        layout="fill"
        objectFit="cover"
        quality={100} // Lower quality is fine for a background image
        className="absolute inset-10 " // This positions it behind the content and makes it transparent
      />

      {/* 3. The foreground content needs to be 'relative' to sit on top of the absolute background */}
      <div className="relative p-8 flex flex-col items-center">
       
        {/* Teams and Score */}
        <div className="flex items-center justify-around w-full max-w-3xl mb-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={96} height={96} />
            <h2 className="text-2xl font-bold">{match.homeTeam.name}</h2>
          </div>
          <div className="text-6xl font-bold">{match.score}</div>
          <div className="flex flex-col items-center gap-4 text-center">
            <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={96} height={96} />
            <h2 className="text-2xl font-bold">{match.awayTeam.name}</h2>
          </div>
        </div>
        
        {/* Match Metadata */}
        <div className="flex items-center justify-center gap-6 text-gray-300 text-sm border-t border-white/10 pt-4 w-full">
          <span className="flex items-center gap-2"><Shield size={16}/> {match.leagueName}</span>
          <span className="flex items-center gap-2"><Calendar size={16}/> {match.date}</span>
          <span className="flex items-center gap-2"><Clock size={16}/> {match.time}</span>
          <span className="flex items-center gap-2"><MapPin size={16}/> {match.venue}</span>
        </div>
      </div>
      
      {/* Status Bar (sits on top because it's after the background image in the DOM) */}
      <div className="relative bg-blue-600 text-center py-2 font-semibold">
        {match.status} - {match.time}
      </div>
    </div>
  );
};

export default MatchHeader;