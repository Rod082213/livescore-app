// src/components/MatchCard.tsx
import { Match } from '@/data/mockData';
import Image from 'next/image';

const StatusDisplay = ({ status, time }: { status: Match['status']; time?:string }) => {
    const isLive = status === 'LIVE' || status === 'HT';
    
    return (
        <div className="flex flex-col items-center justify-center w-20 text-center">
            {isLive ? (
                <div className="flex items-center gap-1.5 text-red-500">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-sm font-bold">{time}</span>
                </div>
            ) : (
                <span className="text-xs font-semibold text-gray-400">{status}</span>
            )}
        </div>
    );
};

const TeamDisplay = ({ name, logo }: { name: string; logo: string }) => (
    <div className="flex items-center gap-3 w-full">
        <Image 
            src={logo} 
            alt={`${name} logo`}
            width={24} 
            height={24}
            className="h-6 w-6 object-contain"
        />
        <span className="font-medium text-white text-sm md:text-base truncate">{name}</span>
    </div>
);

const MatchCard = ({ match }: { match: Match }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg flex items-center hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer">
      {/* Status Column */}
      <StatusDisplay status={match.status} time={match.time} />

      {/* Main Content Column */}
      <div className="flex-grow border-l border-r border-gray-700/50 px-4 py-3">
        <TeamDisplay name={match.homeTeam.name} logo={match.homeTeam.logo} />
        <div className="my-2"></div> {/* Spacer */}
        <TeamDisplay name={match.awayTeam.name} logo={match.awayTeam.logo} />
      </div>

      {/* Score Column */}
      <div className="flex flex-col items-center justify-center w-20 font-bold text-lg text-white">
        {match.status === 'UPCOMING' ? (
          <span className="text-sm text-gray-400">{match.time}</span>
        ) : (
            <>
                <span>{match.score.split('-')[0].trim()}</span>
                <span>{match.score.split('-')[1].trim()}</span>
            </>
        )}
      </div>
    </div>
  );
};

export default MatchCard;