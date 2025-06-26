// src/components/LeftSidebar.tsx
import Image from "next/image";
import { Player } from "@/data/mockData";

interface LeftSidebarProps {
  teamOfTheWeek: Player[];
}

const LeftSidebar = ({ teamOfTheWeek }: LeftSidebarProps) => {
    return (
        // The aside itself no longer needs any special positioning classes
        <aside className="w-full">
            {/* --- Team of the Week Section --- */}
            <div className="bg-[#2b3341] rounded-lg p-4">
                <h3 className="text-md font-bold text-white mb-3">Team of the Week</h3>
                {teamOfTheWeek && teamOfTheWeek.length > 0 ? (
                    <ul className="space-y-3">
                        {teamOfTheWeek.slice(0, 5).map((player) => (
                            <li key={player.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {player.logo ? (
                                        <Image 
                                            src={player.logo} 
                                            alt={player.name} 
                                            width={32} 
                                            height={32} 
                                            className="rounded-full bg-gray-600 object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                                            {player.name.charAt(0)}
                                        </div>
                                    )}
                                    <span className="font-medium text-sm text-white">{player.name}</span>
                                </div>
                                <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-md">
                                    {player.rating}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-400 py-10 text-sm">
                        Player data is currently unavailable.
                    </div>
                )}
            </div>
            
            {/* ===== REMOVED THE STICKY WRAPPER FROM AROUND THESE ITEMS ===== */}
            
            {/* --- Advertisement Box --- */}
            <div className="relative rounded-lg h-100 overflow-hidden mt-4">
                <Image
                    src="/ad-banner.png"
                    alt="Advertisement"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </div>

            {/* --- SLOT GAME PROMOTIONS SECTION --- */}
            <div className="bg-[#2b3341] rounded-lg p-4 mt-4">
                <h3 className="text-md font-bold text-white mb-4">Game Promotions</h3>
                <ul className="space-y-4">
                    {/* Promotion 1 */}
                    <li>
                       <a href="#" className="flex items-start gap-3 group">
                            <Image
                                src="/gate-olympus.jpg"
                                alt="Gates of Olympus slot game"
                                width={80}
                                height={60}
                                className="rounded-md object-cover flex-shrink-0"
                            />
                            <div>
                                <p className="text-blue-400 text-xs font-semibold mb-1">New Release</p>
                                <p className="font-medium text-sm text-white group-hover:underline">
                                    Unleash the Power of the Gods in 'Gates of Olympus'!
                                </p>
                            </div>
                       </a>
                    </li>
                    {/* Other promotions... */}
                    <li>
                       <a href="#" className="flex items-start gap-3 group">
                            <Image
                                src="/sweet-bonanza.jpg"
                                alt="Weekly bonus spins"
                                width={80}
                                height={60}
                                className="rounded-md object-cover flex-shrink-0"
                            />
                            <div>
                                <p className="text-blue-400 text-xs font-semibold mb-1">Weekly Bonus</p>
                                <p className="font-medium text-sm text-white group-hover:underline">
                                    Your Weekend Bonus is Here: Claim 50 Free Spins!
                                </p>
                            </div>
                       </a>
                    </li>
                    <li>
                       <a href="#" className="flex items-start gap-3 group">
                            <Image
                                src="/big-bass.jpg"
                                alt="Big Bass Bonanza game"
                                width={80}
                                height={60}
                                className="rounded-md object-cover flex-shrink-0"
                            />
                            <div>
                                <p className="text-blue-400 text-xs font-semibold mb-1">Pro Tip</p>
                                <p className="font-medium text-sm text-white group-hover:underline">
                                    How to Maximize Your Wins on the Big Bass Bonanza.
                                </p>
                            </div>
                       </a>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default LeftSidebar;