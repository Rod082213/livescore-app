// src/components/MatchRow.tsx
import { Match } from "@/data/mockData";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react"; // Re-import the Star icon
import { generateSlug } from "@/lib/utils"; 

const MatchRow = ({ match }: { match: Match }) => {
  const slug = generateSlug(match.homeTeam.name, match.awayTeam.name, match.id);

  // Determine the minimum odd to highlight the favorite
  let minOdd: number | null = null;
  if (match.odds) {
    minOdd = Math.min(match.odds.home, match.odds.draw, match.odds.away);
  }

  // Handle different time/status displays
  const renderTimeOrStatus = () => {
    if (match.status === 'LIVE') {
      return <p className="text-green-500 font-bold">{match.time}</p>;
    }
    if (match.status === 'FT') {
      return <p className="text-gray-400">FT</p>;
    }
    // For 'UPCOMING' or other statuses, show the kickoff time
    const timeString = match.time?.split(' ')[0]; // Assuming time might be "15:00 Upcoming"
    return <p>{timeString}</p>;
  };

  return (
    // The entire row is a clickable link and a self-contained card
    <Link 
      href={`/match/${slug}`} 
      className="flex items-center p-3 text-sm text-gray-300 bg-[#2b3341] rounded-lg hover:bg-[#343c4c] transition-colors"
    >
      {/* Time/Status Column */}
      <div className="w-14 text-center flex-shrink-0">
        {renderTimeOrStatus()}
      </div>
      
      {/* Teams Column */}
      <div className="flex-grow mx-4">
        <div className="flex items-center gap-3">
          <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={20} height={20} className="object-contain"/>
          <span className="font-semibold text-white truncate">{match.homeTeam.name}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={20} height={20} className="object-contain"/>
          <span className="font-semibold text-white truncate">{match.awayTeam.name}</span>
        </div>
      </div>

      {/* Odds Column */}
      <div className="flex justify-around items-center w-48 text-center font-semibold flex-shrink-0">
        {match.odds ? (
          <>
            <span className={`px-2 py-1 rounded-md transition-colors ${match.odds.home === minOdd ? 'bg-yellow-800/70 text-white' : 'text-gray-300'}`}>
              {match.odds.home.toFixed(2)}
            </span>
            <span className={`px-2 py-1 rounded-md transition-colors ${match.odds.draw === minOdd ? 'bg-yellow-800/70 text-white' : 'text-gray-300'}`}>
              {match.odds.draw.toFixed(2)}
            </span>
            <span className={`px-2 py-1 rounded-md transition-colors ${match.odds.away === minOdd ? 'bg-yellow-800/70 text-white' : 'text-gray-300'}`}>
              {match.odds.away.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-gray-500 text-xs w-full text-center">No Odds Available</span>
        )}
      </div>

      {/* Score/Placeholder Column */}
      <div className="flex flex-col items-center w-12 mx-2 text-gray-400 font-bold flex-shrink-0">
        {match.status !== 'UPCOMING' ? (
          <>
            <span>{match.score?.split('-')[0].trim()}</span>
            <span>{match.score?.split('-')[1].trim()}</span>
          </>
        ) : (
          <>
            <span>-</span>
            <span>-</span>
          </>
        )}
      </div>

      {/* Favorite Icon */}
      <div className="w-8 flex justify-center flex-shrink-0">
          <Star className="w-5 h-5 text-gray-500 hover:text-yellow-400"/>
      </div>
    </Link>
  );
};

export default MatchRow;