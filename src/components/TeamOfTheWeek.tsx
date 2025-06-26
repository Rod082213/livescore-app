// src/components/TeamOfTheWeek.tsx
import { Player } from '@/data/mockData';
import Image from 'next/image';

const PlayerMarker = ({ player }: { player: Player }) => (
  <div className="absolute flex flex-col items-center text-center w-20" style={player.position}>
    <div className="relative">
      <Image src={player.logo} alt={player.name} width={40} height={40} className="rounded-full bg-gray-600 border-2 border-blue-500 object-cover" />
      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-gray-800">
        {player.rating}
      </span>
    </div>
    <p className="text-xs text-white font-semibold mt-1 bg-black/50 px-1 rounded truncate">{player.name}</p>
  </div>
);

const TeamOfTheWeek = ({ players }: { players: Player[] }) => {
  // Defensive check to ensure we have data before rendering
  if (!Array.isArray(players) || players.length === 0) {
    return (
        <div className="bg-[#2b3341] rounded-lg p-4">
            <h2 className="text-lg font-bold text-white mb-4">Top Players</h2>
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Player data not available.
            </div>
        </div>
    );
  }

  return (
    <div className="bg-[#2b3341] rounded-lg p-4">
      <h2 className="text-lg font-bold text-white mb-4">Top Players</h2>
      <div 
        className="relative w-full aspect-[4/3] bg-cover bg-center rounded-md"
        style={{backgroundImage: "url('/football-pitch.svg')"}}
      >
        {players.map(player => <PlayerMarker key={player.name} player={player} />)}
      </div>
    </div>
  );
};

export default TeamOfTheWeek;