"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Loader2, ChevronRight } from "lucide-react";
import { Standing } from "@/data/mockData";
import MiniStandingsTable from "./MiniStandingsTable";
import { getStandingsForLeague } from "@/app/actions";
import AdCarousel from "./AdCarousel"; // 1. Import the new AdCarousel component

interface League {
  id: number;
  name: string;
  logo: string;
}

interface RightSidebarProps {
  initialTopLeagues: League[];
  initialFeaturedMatch: any;
}

// 2. Define the list of images for the carousel
const adImages = [
    "/promotional-one.png",
    "/promotional-two.png",
    
];


const RightSidebar = ({ initialTopLeagues, initialFeaturedMatch }: RightSidebarProps) => {
    const [featuredMatch, setFeaturedMatch] = useState<any>(initialFeaturedMatch);
    const [topLeagues, setTopLeagues] = useState<League[]>(initialTopLeagues);
    
    const [expandedLeagueId, setExpandedLeagueId] = useState<number | null>(null);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
                <div className="bg-blue-600 text-white rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <div>
                        <p className="font-bold">Weekly Challenge</p>
                        <p className="text-sm text-blue-200">Time left: 5d 20h</p>
                    </div>
                    <ChevronRight size={24} />
                </div>
                
                {/* Accordion Standings Menu */}
                <div className="bg-[#2b3341] rounded-lg p-4">
                    <h3 className="text-md font-bold text-white mb-2">League Standings</h3>
                    <ul className="space-y-1">
                        {topLeagues.map(league => (
                            <li key={league.id} className="flex flex-col bg-gray-800/20 rounded-md">
                                <div onClick={() => handleLeagueClick(league.id)} className="flex items-center justify-between p-2 hover:bg-gray-700/50 group cursor-pointer rounded-md">
                                    <div className="flex items-center gap-3">
                                        <Image src={league.logo} alt={league.name} width={24} height={24} className="h-6 w-6 object-contain"/>
                                        <span className="text-gray-300 font-medium text-sm group-hover:text-white">{league.name}</span>
                                    </div>
                                    {expandedLeagueId === league.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                </div>
                                {expandedLeagueId === league.id && (
                                    <div>
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

                {/* ===== START: REPLACED STATIC IMAGE WITH CAROUSEL ===== */}
                <AdCarousel images={adImages} />
                {/* ===== END: REPLACED STATIC IMAGE WITH CAROUSEL ===== */}

            </div>
        </aside>
    );
};

export default RightSidebar;