import Link from 'next/link';
// Assuming you have these components/types
// import { MatchStatus } from './MatchStatus'; 

// Define a type for your match data
interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Match {
  fixture: {
    id: number;
    status: { short: string; };
  };
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  league: {
    name: string;
    logo: string;
  };
}

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const { fixture, teams, goals, league } = match;

  return (
    <div className="bg-[#1d222d] rounded-lg p-4 mb-2 text-white hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <div className="flex items-center gap-2">
          <img src={league.logo} alt={league.name} className="w-4 h-4" />
          <span>{league.name}</span>
        </div>
        {/* <MatchStatus status={fixture.status} /> */}
      </div>

      <Link href={`/match/${fixture.id}`} className="block">
        <div className="flex items-center justify-between">
          
          {/* --- HOME TEAM --- */}
          {/* THE LINK HAS BEEN UPDATED HERE */}
          <Link 
            href={`/teams/${teams.home.id}`} 
            className="flex-1 flex items-center gap-3 w-1/3 hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={teams.home.logo} alt={teams.home.name} className="w-6 h-6" />
            <span className="font-semibold">{teams.home.name}</span>
          </Link>
          
          {/* --- SCORE --- */}
          <div className="text-center font-bold text-lg">
            <span>{goals.home ?? '-'}</span>
            <span className="mx-2">:</span>
            <span>{goals.away ?? '-'}</span>
          </div>
          
          {/* --- AWAY TEAM --- */}
          {/* THE LINK HAS BEEN UPDATED HERE */}
          <Link 
            href={`/teams/${teams.away.id}`} 
            className="flex-1 flex items-center gap-3 justify-end w-1/3 hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-semibold text-right">{teams.away.name}</span>
            <img src={teams.away.logo} alt={teams.away.name} className="w-6 h-6" />
          </Link>

        </div>
      </Link>
    </div>
  );
};

export default MatchCard;