"use client";

import { useState } from "react";
import Image from "next/image";
// import AdCarousel from "./AdCarousel";
import { ChallengeWidget } from "@/components/features/challenge/ChallengeWidget";
import { ChallengeModal } from "@/components/features/challenge/ChallengeModal";



interface RightSidebarProps {
  initialFeaturedMatch: any; // This prop was in the original code but unused in the provided snippet.
  hasSubmittedChallenge: boolean;
  isChallengeOver: boolean;
}

const RightSidebar = ({ 
  initialFeaturedMatch,
  hasSubmittedChallenge,
  isChallengeOver
}: RightSidebarProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    

    return (
        <>
            <aside className="hidden xl:block w-full lg:w-72 flex-shrink-0">
                <div className="space-y-4">
                    
                    
                    <div onClick={() => setIsModalOpen(true)}>
                      <ChallengeWidget />
                    </div>
                     <div className="bg-[#2b3341] rounded-lg p-6 mt-4">
            <h3 className="text-lg font-bold text-white mb-2">All Teams</h3>
              <p className="text-sm text-gray-300 mb-4">Celebrate the best performers from<span className="text-blue-400 font-bold"> this week’s action!</span> Explore our Team of the Week for Premier league, champions league, La liga and more to see which players dominated the pitch with goals, assists, clean sheets, and match-winning moments. Updated after every gameweek!</p>
    
        </div>
                    
                    {/* LEAGUE STANDINGS SECTION HAS BEEN REMOVED */}

                    
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