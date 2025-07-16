// src/components/match/FootballPitch.tsx
import Image from 'next/image';
import { Lineup, Player } from '@/lib/types';
import PlayerMarker from './PlayerMarker';

interface FootballPitchProps {
  lineup: Lineup;
  teamType: 'home' | 'away'; // Pass this down from the main component
  color: 'home' | 'away';
}

const FootballPitch = ({ lineup, teamType, color }: FootballPitchProps) => {
  // Group players by position ('G', 'D', 'M', 'F')
  const defenders = lineup.startXI.filter(p => p.pos === 'D');
  const midfielders = lineup.startXI.filter(p => p.pos === 'M');
  const forwards = lineup.startXI.filter(p => p.pos === 'F');
  const goalkeeper = lineup.startXI.filter(p => p.pos === 'G');

  return (
    <div className="flex-1 flex flex-col">
      {/* Team Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Image src={lineup.team.logo} alt={lineup.team.name} width={24} height={24} />
          <span className="font-semibold text-white">{lineup.team.name}</span>
        </div>
        <span className="text-gray-300 font-medium">{lineup.formation}</span>
      </div>

      {/* Pitch Area */}
      <div 
        className="relative w-full aspect-[7/10] overflow-hidden"
        style={{ 
          background: 'linear-gradient(to bottom, #057a3a, #04632f)',
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
        }}
      >
        {/* Pitch Markings */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-white opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[18%] w-[25%] border-2 border-white opacity-20 rounded-full"></div>
          {/* Goal box based on team type */}
          {teamType === 'home' ? (
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[18%] border-2 border-white opacity-20 rounded-t-xl border-b-0"></div>
          ) : (
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[18%] border-2 border-white opacity-20 rounded-b-xl border-t-0"></div>
          )}
        </div>

        {/* Render each line of players, passing the correct props */}
        {goalkeeper.map(player => <PlayerMarker key={player.id} player={player} line={goalkeeper} teamType={teamType} color={color} />)}
        {defenders.map(player => <PlayerMarker key={player.id} player={player} line={defenders} teamType={teamType} color={color} />)}
        {midfielders.map(player => <PlayerMarker key={player.id} player={player} line={midfielders} teamType={teamType} color={color} />)}
        {forwards.map(player => <PlayerMarker key={player.id} player={player} line={forwards} teamType={teamType} color={color} />)}
      </div>
    </div>
  );
};

export default FootballPitch;