// src/components/StandingsWidget.tsx
import { Standing } from "@/data/mockData";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface StandingsWidgetProps {
  league: { id: number; name: string; logo: string; } | null;
  standings: Standing[];
}

const StandingsWidget = ({ league, standings }: StandingsWidgetProps) => {
    if (!league || standings.length === 0) {
        // You can return a loading skeleton here in a real app
        return null;
    }

    return (
        <div className="bg-[#2b3341] rounded-lg flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Image src={league.logo} alt={league.name} width={20} height={20} />
                    <h3 className="text-sm font-bold text-white">{league.name}</h3>
                </div>
                <Star className="w-4 h-4 text-gray-500 hover:text-yellow-400 cursor-pointer"/>
            </div>

            {/* Table */}
            {/* UPDATED: Added a max-height and overflow-y-auto for scrollability */}
            <div className="p-2 flex-grow overflow-y-auto" style={{maxHeight: 'calc(100vh - 250px)'}}>
                <table className="w-full text-xs">
                    <thead className="text-gray-400 sticky top-0 bg-[#2b3341]">
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
                        {/* UPDATED: Removed the .slice(0, 6) limit to show all teams */}
                        {standings.map(row => (
                            <tr key={row.rank} className="hover:bg-gray-700/50 rounded-md">
                                <td className="px-1 py-1.5 text-center">{row.rank}</td>
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

            {/* Footer Link */}
            <Link href={`/league/${league.id}`} className="block text-center text-blue-400 text-sm py-2 border-t border-gray-700 hover:bg-gray-700/50 rounded-b-lg transition-colors flex-shrink-0">
                Show full page
            </Link>
        </div>
    );
};

export default StandingsWidget;