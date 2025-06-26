// src/components/MiniStandingsTable.tsx
import { Standing } from "@/data/mockData";
import Image from "next/image";

const MiniStandingsTable = ({ standings }: { standings: Standing[] }) => {
  if (!standings || standings.length === 0) {
    return <div className="p-4 text-xs text-center text-gray-400">Standings unavailable for this league.</div>;
  }
  return (
    <div className="p-2 border-t border-gray-700">
      <table className="w-full text-xs text-left">
        <thead className="text-gray-400">
          <tr>
            <th className="px-1 py-1 font-normal">#</th>
            <th className="px-1 py-1 font-normal" colSpan={2}>Team</th>
            <th className="px-1 py-1 text-center font-normal">P</th>
            <th className="px-1 py-1 text-center font-normal">W</th>
            <th className="px-1 py-1 text-center font-normal">D</th>
            <th className="px-1 py-1 text-center font-normal">L</th>
            <th className="px-1 py-1 text-center font-normal">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.slice(0, 10).map(row => (
            <tr key={row.rank} className="hover:bg-gray-700/50">
              <td className={`px-1 py-1.5 text-center font-bold ${row.rank <= 4 ? 'text-blue-400' : 'text-white'}`}>
                {row.rank}
              </td>
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

export default MiniStandingsTable;