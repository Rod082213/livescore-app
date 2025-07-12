import { Standing } from '@/data/mockData';
import Image from 'next/image';

interface LeagueStandingsProps {
  standings: Standing[];
  teamId: number;
}

export default function LeagueStandings({ standings, teamId }: LeagueStandingsProps) {
  const teamStanding = standings.find(s => s.team.id === teamId);

  return (
    <div className="bg-[#2b3341] rounded-lg">
      <h2 className="text-lg font-bold text-white p-4 border-b border-gray-700">League Standings</h2>
      {teamStanding ? (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="p-3">#</th>
              <th className="p-3">TEAM</th>
              <th className="p-3 text-center">P</th>
              <th className="p-3 text-center">PTS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-800/50">
              <td className="p-3 font-bold">{teamStanding.rank}</td>
              <td className="p-3 flex items-center gap-2 font-semibold">
                <Image src={teamStanding.team.logo} alt={teamStanding.team.name} width={24} height={24} />
                {teamStanding.team.name}
              </td>
              <td className="p-3 text-center">{teamStanding.played}</td>
              <td className="p-3 text-center font-bold">{teamStanding.points}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="p-4 text-gray-400">No standings data available.</p>
      )}
    </div>
  );
}