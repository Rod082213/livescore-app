// src/components/RightSidebar.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Standing } from "@/data/mockData";
import MiniStandingsTable from "./MiniStandingsTable";
import { getStandingsForLeague } from "@/app/actions";
import { createLeagueSlug } from "@/lib/utils";

interface League {
  id: number;
  name: string;
  logo: string;
}

// Props related to the challenge have been removed
interface RightSidebarProps {
  initialTopLeagues?: League[];
}

const RightSidebarPredictions = ({ 
  initialTopLeagues,
}: RightSidebarProps) => {
    // State for the modal has been removed
    const [expandedLeagueId, setExpandedLeagueId] = useState<number | null>(null);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [isLoading, setIsLoading] = useState(false);

   
    
    const [topLeagues] = useState<League[]>(initialTopLeagues || []);

    const handleLeagueClick = async (leagueId: number) => {
        if (expandedLeagueId === leagueId) {
            setExpandedLeagueId(null);
        } else {
            setIsLoading(true);
            setExpandedLeagueId(leagueId);
            const newStandings = await getStandingsForLeague(leagueId.toString());
            setStandings(newStandings);
            setIsLoading(false);
        }
    };

    return (
        <aside className="hidden xl:block w-full lg:w-72 flex-shrink-0">
            <div className="space-y-4">
                
                {/* --- The ChallengeWidget component has been removed from here --- */}

                <div className="bg-[#2b3341] rounded-lg p-4">
                    <h2 className="text-md font-bold text-white mb-2">League Standings</h2>
                    <ul className="space-y-1">
                        {topLeagues.map(league => (
                            <li key={league.id} className="flex flex-col bg-gray-800/20 rounded-md">
                                <div className="flex items-center justify-between p-2 group rounded-md">
                                    <Link 
                                      href={`/league/${createLeagueSlug(league.name, league.id)}`}
                                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                    >
                                        <Image src={league.logo} alt={league.name} width={24} height={24} className="h-6 w-6 object-contain"/>
                                        <span className="text-gray-300 font-medium text-sm group-hover:text-white">{league.name}</span>
                                    </Link>
                                    
                                    <button 
                                      onClick={() => handleLeagueClick(league.id)}
                                      className="p-1"
                                      aria-label={`Expand standings for ${league.name}`}
                                    >
                                      {expandedLeagueId === league.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                    </button>
                                </div>
                                {expandedLeagueId === league.id && (
                                    <div className="px-2 pb-2">
                                        {isLoading ? (
                                            <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin"/></div>
                                        ) : (
                                            <MiniStandingsTable standings={standings} />
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="bg-[#2b3341] rounded-lg p-6 mt-4">
                    <h3 className="text-lg font-bold text-white mb-2">About Predictions</h3>
                    <p className="text-sm text-gray-300 mb-4"><span className="text-blue-400 font-bold">Todaylivescores Prediction</span> offers real-time sports score updates combined with data-driven insights and expert analysis to help users anticipate match outcomes. We integrate live score feeds, historical stats, team form, head to head data, and betting odds into our unified platform, enabling football fans and bettors to make more informed predictions. Available to web and mobile apps, we feature live alerts, correct score tips, under/over forecasts, and ongoing performance metrics—widely used for daily sports analysis and betting strategy.</p>
                </div>
               
            </div>
        </aside>
        // --- The ChallengeModal component has been removed from here ---
    );
};

export default RightSidebarPredictions;