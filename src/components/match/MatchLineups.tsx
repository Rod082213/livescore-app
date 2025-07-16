// src/components/match/MatchLineups.tsx
import { MatchLineupData, Player } from '@/lib/types';
import FootballPitch from './FootballPitch';
import { UsersIcon } from 'lucide-react';

interface MatchLineupsProps {
  lineups: MatchLineupData | null;
}

const SubstitutesList = ({ players }: { players: Player[] }) => (
  // Use a slightly darker background for contrast
  <div className="bg-[#182230] p-4 rounded-b-lg">
    <h4 className="font-bold mb-3 flex items-center gap-2">
      <UsersIcon size={18} /> Backups
    </h4>
    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-300">
      {players.map((player) => (
        <div key={player.id} className="flex items-center">
          <span className="w-8 font-semibold text-gray-400">{player.number}</span>
          <span>{player.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const MatchLineups = ({ lineups }: MatchLineupsProps) => {
  if (!lineups) {
    return (
      <div className="bg-[#2b3341] p-4 rounded-lg text-center text-gray-400">
        Lineup data not yet available for this match.
      </div>
    );
  }

 return (
    <div className="bg-transparent">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Lineups</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Home Team */}
        <div className="flex-1">
          {/* Pass teamType="home" */}
          <FootballPitch lineup={lineups.home} teamType="home" color="home" />
          <SubstitutesList players={lineups.home.substitutes} />
        </div>
        {/* Away Team */}
        <div className="flex-1">
          {/* Pass teamType="away" */}
          <FootballPitch lineup={lineups.away} teamType="away" color="away" />
          <SubstitutesList players={lineups.away.substitutes} />
        </div>
      </div>
    </div>
  );
};

export default MatchLineups;