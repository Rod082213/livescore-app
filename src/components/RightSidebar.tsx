"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Standing } from "@/data/mockData";
import MiniStandingsTable from "./MiniStandingsTable";
import { getStandingsForLeague } from "@/app/actions";
// import AdCarousel from "./AdCarousel";
import { ChallengeWidget } from "@/components/features/challenge/ChallengeWidget";
import { ChallengeModal } from "@/components/features/challenge/ChallengeModal";

interface League {
  id: number;
  name: string;
  logo: string;
}

interface RightSidebarProps {
  initialTopLeagues: League[];
  initialFeaturedMatch: any;
  hasSubmittedChallenge: boolean;
  isChallengeOver: boolean;
}

const adImages = [
    "/promotional-one.png",
    "/promotional-two.png",
];

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
    
    // --- THIS IS THE LINE THAT FIXES THE ERROR ---
    const [topLeagues, setTopLeagues] = useState<League[]>(initialTopLeagues);
    // ---------------------------------------------

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

                    {/* <AdCarousel images={adImages} /> */}
                    {/* --- Game Promotions Section --- */}
                                <div className="bg-[#2b3341] rounded-lg p-4">
                                    <h3 className="text-md font-bold text-white mb-4">Game Promotions</h3>
                                    
                                    {/* Mobile View */}
                                    <ul className="space-y-4 lg:hidden">
                                        {promotions.slice(0, 1).map((promo, index) => (
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
                                    {/* Desktop View */}
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