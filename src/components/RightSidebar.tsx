// src/components/RightSidebar.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Standing } from "@/data/mockData";
import MiniStandingsTable from "./MiniStandingsTable";
import { getStandingsForLeague } from "@/app/actions";
import { ChallengeWidget } from "@/components/features/challenge/ChallengeWidget";
import { ChallengeModal } from "@/components/features/challenge/ChallengeModal";
import { createLeagueSlug } from "@/lib/utils"; // <-- IMPORT THE CORRECT FUNCTION

interface League {
  id: number;
  name: string;
  logo: string;
}

interface RightSidebarProps {
  initialTopLeagues?: League[];
  initialFeaturedMatch: any;
  hasSubmittedChallenge: boolean;
  isChallengeOver: boolean;
}

const RightSidebar = ({ 
  initialTopLeagues, 
  initialFeaturedMatch,
  hasSubmittedChallenge,
  isChallengeOver
}: RightSidebarProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedLeagueId, setExpandedLeagueId] = useState<number | null>(null);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const promotions = [
        { type: "New Release", title: "Unleash the Power of the Gods in 'Gates of Olympus'!", imgSrc: "/gate-olympus.jpg", alt: "Gates of Olympus" },
        { type: "Weekly Bonus", title: "Your Weekend Bonus is Here: Claim 50 Free Spins!", imgSrc: "/sweet-bonanza.jpg", alt: "Weekly bonus" },
        { type: "Pro Tip", title: "How to Maximize Your Wins on the Big Bass Bonanza.", imgSrc: "/big-bass.jpg", alt: "Big Bass Bonanza" }
    ];
    
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
        <>
            <aside className="hidden xl:block w-full lg:w-72 flex-shrink-0">
                <div className="space-y-4">
                    <div onClick={() => setIsModalOpen(true)}>
                      <ChallengeWidget />
                    </div>
                    
                    <div className="bg-[#2b3341] rounded-lg p-4">
                        <h2 className="text-md font-bold text-white mb-2">League Standings</h2>
                        <ul className="space-y-1">
                            {topLeagues.map(league => (
                                <li key={league.id} className="flex flex-col bg-gray-800/20 rounded-md">
                                    <div className="flex items-center justify-between p-2 group rounded-md">
                                        <Link 
                                          // --- THIS IS THE FIX ---
                                          // It now uses the consistent createLeagueSlug function.
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
                        <h3 className="text-lg font-bold text-white mb-2">About Us</h3>
                        <p className="text-sm text-gray-300 mb-4"><span className="text-blue-400 font-bold">Todaylivescores,</span> founded as a leading real-time sports media brand delivering live scores across football, cricket, tennis, basketball, and hockey, reaching thousands of users monthly in 200+ territories</p>
                    </div>
                    <div className="bg-[#2b3341] rounded-lg p-4">
                      <h2 className="text-md font-bold text-white mb-4">Game Promotions</h2>
                      <ul className="hidden lg:block space-y-4">
                          {promotions.map((promo, index) => (
                              <li key={index}>
                                 <a href="#" className="flex items-start gap-3 group">
                                      <Image src={promo.imgSrc} alt={promo.alt} width={80} height={60} className="rounded-md object-cover flex-shrink-0"/>
                                      <div>
                                          <p className="text-blue-400 text-xs font-semibold mb-1">{promo.type}</p>
                                          <p className="font-medium text-sm text-white group-hover:underline">{promo.title}</p>
                                      </div>
                                 </a>
                              </li>
                          ))}
                      </ul>
                    </div>
                </div>
            </aside>
            <ChallengeModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              hasSubmitted={hasSubmittedChallenge}
              isChallengeOver={isChallengeOver}
            />
        </>
    );
};

export default RightSidebar;