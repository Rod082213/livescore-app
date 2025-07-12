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

    const promotions = [
        { type: "New Release", title: "Unleash the Power of the Gods in 'Gates of Olympus'!", imgSrc: "/gate-olympus.jpg", alt: "Gates of Olympus" },
        { type: "Weekly Bonus", title: "Your Weekend Bonus is Here: Claim 50 Free Spins!", imgSrc: "/sweet-bonanza.jpg", alt: "Weekly bonus" },
        { type: "Pro Tip", title: "How to Maximize Your Wins on the Big Bass Bonanza.", imgSrc: "/big-bass.jpg", alt: "Big Bass Bonanza" }
    ];

    return (
        <>
            <aside className="hidden xl:block w-full lg:w-72 flex-shrink-0">
                <div className="space-y-4">
                    
                    
                    <div onClick={() => setIsModalOpen(true)}>
                      <ChallengeWidget />
                    </div>
                     <div className="bg-[#2b3341] rounded-lg p-6 mt-4">
            <h3 className="text-lg font-bold text-white mb-2">Latest News</h3>
              <p className="text-sm text-gray-300 mb-4">Never miss a moment with<span className="text-blue-400 font-bold"> today's live scores.</span> From breaking transfer news to injury updates, game highlights, and tactical insights, our Latest News section keeps you ahead of the curve. Check in daily for real-time sports coverage.</p>
    
        </div>
                    
                    {/* LEAGUE STANDINGS SECTION HAS BEEN REMOVED */}

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