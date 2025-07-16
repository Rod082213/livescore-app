// src/components/match/PlayerMarker.tsx
import { Player } from '@/lib/types';

interface PlayerMarkerProps {
  player: Player;
  line: Player[]; // The array of all players on the same line (e.g., all 'D' players)
  teamType: 'home' | 'away'; // Is this the home or away team?
  color: 'home' | 'away';
}

const PlayerMarker = ({ player, line, teamType, color }: PlayerMarkerProps) => {
  // --- NEW, CENTERED POSITIONING LOGIC ---

  // 1. Determine Vertical Position (Y-axis) based on Player Role & Team Type
  let yPosition;
  const isHome = teamType === 'home';

  switch (player.pos) {
    case 'G':
      yPosition = isHome ? 92 : 8; // GK at bottom for home, top for away
      break;
    case 'D':
      yPosition = isHome ? 75 : 25; // Defenders
      break;
    case 'M':
      yPosition = 50; // Midfielders always in the center
      break;
    case 'F':
      yPosition = isHome ? 25 : 75; // Forwards
      break;
    default:
      yPosition = 50;
  }

  // 2. Determine Horizontal Position (X-axis) by centering the line of players
  const playersInLine = line.length;
  const playerIndex = line.findIndex(p => p.id === player.id);
  
  // Calculate the total width the players will occupy and the starting point
  const totalWidth = 80; // Use 80% of the pitch width to leave space on the sides
  const startX = (100 - totalWidth) / 2; // Start at 10%
  
  let xPosition;
  if (playersInLine === 1) {
    xPosition = 50; // A single player is always dead center
  } else {
    // Distribute players evenly across the allocated width
    const gap = totalWidth / (playersInLine - 1);
    xPosition = startX + (playerIndex * gap);
  }

  // Player marker styling
  const colors = {
    home: 'bg-orange-500 border-orange-300',
    away: 'bg-blue-500 border-blue-300',
  };

  return (
    <div
      className="absolute flex items-center justify-center w-8 h-8 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{
        top: `${yPosition}%`,
        left: `${xPosition}%`,
        transition: 'top 0.3s ease, left 0.3s ease',
      }}
      title={player.name}
    >
      <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm border-2 ${colors[color]}`}>
        {player.number}
      </div>
      <div className="absolute bottom-full mb-2 w-max bg-black bg-opacity-80 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {player.name}
      </div>
    </div>
  );
};

export default PlayerMarker;