// src/components/MiniStandings.tsx
import { Standing } from "@/data/mockData";
import Image from "next/image";

const MiniStandings = ({ standings }: { standings: Standing[] }) => {
  // Defensive check: If standings data is not a valid array or is empty, show a message.
  if (!Array.isArray(standings) || standings.length === 0) {
    return <div className="px-2 py-4 text-xs text-center text-gray-400">Standings data not available.</div>;
  }

  return (
    <div className="px-2 pt-2 pb-1 bg-gray-900/50 rounded-b-md">
      <table className="w-full text-xs">
        <thead className="text-gray-400">
          <tr>
            <th className="px-1 py-1 text-left font-normal">#</th>
            <th className="px-1 py-1 text-left font-normal" colSpan={2}>Team</th>
            <th className="px-1 py-1 text-center font-normal">P</th>
            <th className="px-1 py-1 text-center font-normal">W</th>
            <th className="px-1 py-1 text-center font-normal">D</th>
            <th className="px-1 py-1 text-center font-normal">L</th>
            <th className="px-1 py-1 text-center font-normal">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.slice(0, 10).map((row) => ( // Show top 10 teams in the accordion
            <tr key={row.rank} className="border-t border-gray-700/50">
              <td className={`px-1 py-1.5 text-center font-bold ${row.rank <= 4 ? 'text-blue-400' : 'text-white'}`}>{row.rank}</td>
              <td className="px-1 py-1.5">
                <Image src={row.team.logo} alt={row.team.name} width={16} height={16} />
              </td>
              <td className="px-1 py-1.5 text-white font-medium truncate">{row.team.name}</td>
              <td className="px-1 py-1.5 text-center text-gray-300">{row.played}</td>
              <td className="px-1 py-1.5 text-center text-gray-300">{row.win}</td>
              <td className="px-1 py-1.5 text-center text-gray-300">{row.draw}</td>
              <td className="px-1 py-1.5 text-center text-gray-300">{row.loss}</td>
              <td className="px-1 py-1.5 text-center text-white font-bold">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MiniStandings;