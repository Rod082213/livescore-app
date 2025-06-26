// src/components/match/HeadToHead.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Swords, Goal, Replace, FileText, Loader2 } from 'lucide-react';
import { getEventsForFixture } from '@/app/actions'; // Import the new Server Action

// --- Reusable Event Icon Component ---
const EventIcon = ({ event }: { event: any }) => {
    let icon;
    let colorClass;

    switch (event.type) {
        case 'Goal':
            icon = <Goal size={18} />;
            colorClass = 'border-green-500 text-green-500';
            break;
        case 'Card':
            icon = <div className={`w-3 h-4 rounded-sm ${event.detail.includes('Yellow') ? 'bg-yellow-400' : 'bg-red-500'}`} />;
            colorClass = `border-transparent`;
            break;
        case 'subst':
            icon = <Replace size={18} />;
            colorClass = 'border-blue-400 text-blue-400';
            break;
        default:
            icon = <FileText size={18} />;
            colorClass = 'border-gray-500 text-gray-500';
    }
    return (
        <div className={`relative bg-[#2b3341] w-12 h-12 rounded-full border-2 flex items-center justify-center ${colorClass}`}>
            {icon}
            <span className="absolute -bottom-1 text-xs font-semibold text-white bg-[#2b3341] px-1">{event.time.elapsed}'</span>
        </div>
    );
};

// --- Reusable Event Card Component ---
const EventCard = ({ event, teamLogo }: { event: any, teamLogo: string }) => (
    <div className="bg-[#343c4c] p-3 rounded-lg w-full flex items-center gap-3">
        <Image src={teamLogo} alt={event.team.name} width={24} height={24} className="object-contain" />
        <div>
            <p className="font-bold text-white">{event.player.name}</p>
            <p className="text-xs text-gray-400">{event.detail}</p>
        </div>
    </div>
);

// --- The Detailed Timeline for a selected encounter ---
const EncounterTimeline = ({ events, encounter }: { events: any[], encounter: any }) => {
    if (events.length === 0) {
        return <div className="text-center text-gray-400 py-6">No key events were recorded for this match.</div>;
    }
    return (
        <div className="relative pt-4 pb-2 px-4">
            {/* The central spine line */}
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-700/50" />
            
            <div className="space-y-4">
                {events.map((event, index) => {
                    const isHomeEvent = event.team.id === encounter.teams.home.id;
                    return (
                        <div key={index} className="relative flex items-center justify-between">
                            {/* Left Side (Home) */}
                            <div className="w-5/12">
                                {isHomeEvent && <EventCard event={event} teamLogo={encounter.teams.home.logo} />}
                            </div>

                            {/* Center Icon on the Spine */}
                            <div className="z-10">
                                <EventIcon event={event} />
                            </div>

                            {/* Right Side (Away) */}
                            <div className="w-5/12">
                                {!isHomeEvent && <EventCard event={event} teamLogo={encounter.teams.away.logo} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- The Main HeadToHead Component ---
const HeadToHead = ({ h2hData, teams }: { h2hData?: any[], teams: { home: any, away: any } }) => {
    const [selectedFixtureId, setSelectedFixtureId] = useState<number | null>(null);
    const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleEncounterClick = async (fixtureId: number) => {
        if (selectedFixtureId === fixtureId) {
            setSelectedFixtureId(null); // Toggle off if clicking the same one
            return;
        }

        setIsLoading(true);
        setSelectedFixtureId(fixtureId);
        const events = await getEventsForFixture(fixtureId.toString());
        setTimelineEvents(events);
        setIsLoading(false);
    };

    const stats = { homeWins: 0, awayWins: 0, draws: 0 };
    if (h2hData) {
        h2hData.forEach(match => {
            if(match.teams.home.id === teams.home.id && match.teams.home.winner) stats.homeWins++;
            else if(match.teams.away.id === teams.home.id && match.teams.away.winner) stats.homeWins++;
            else if(match.teams.home.id === teams.away.id && match.teams.home.winner) stats.awayWins++;
            else if(match.teams.away.id === teams.away.id && match.teams.away.winner) stats.awayWins++;
            else stats.draws++;
        });
    }

    return (
        <div className="bg-[#2b3341] rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Swords size={20} /> Head-to-Head</h3>
            <div className="flex justify-between items-center bg-gray-800/30 p-4 rounded-md mb-6 text-center">
                <div className="w-1/3"><p className="font-semibold text-white">{stats.homeWins} Wins</p><p className="text-xs text-gray-400">{teams.home.name}</p></div>
                <div className="w-1/3 border-x border-gray-600"><p className="text-gray-300 font-bold">{stats.draws} Draws</p></div>
                <div className="w-1/3"><p className="font-semibold text-white">{stats.awayWins} Wins</p><p className="text-xs text-gray-400">{teams.away.name}</p></div>
            </div>

            <h4 className="font-semibold text-white mb-3">Recent Encounters</h4>
            <ul className="space-y-2">
                {h2hData && h2hData.length > 0 ? (
                    h2hData.map((encounter: any) => (
                        <li key={encounter.fixture.id}>
                            <button onClick={() => handleEncounterClick(encounter.fixture.id)} className="w-full flex items-center bg-gray-800/30 p-3 rounded-md hover:bg-gray-800/60 transition-colors">
                                <div className="w-20 text-xs text-gray-400 text-center">{format(new Date(encounter.fixture.date), 'dd MMM yyyy')}</div>
                                <div className="flex-grow flex items-center justify-center text-sm font-semibold text-white">
                                    <span className="text-right w-2/5 truncate">{encounter.teams.home.name}</span>
                                    <span className="mx-4 px-2 py-1 bg-gray-900 rounded">{encounter.goals.home} - {encounter.goals.away}</span>
                                    <span className="text-left w-2/5 truncate">{encounter.teams.away.name}</span>
                                </div>
                                <div className="w-40 text-xs text-gray-400 text-right truncate">{encounter.league.name}</div>
                            </button>

                            {/* Conditionally render the timeline below the clicked item */}
                            {selectedFixtureId === encounter.fixture.id && (
                                <div className="bg-gray-900/50 rounded-b-md">
                                    {isLoading 
                                        ? <div className="flex justify-center items-center py-10"><Loader2 className="w-8 h-8 animate-spin text-blue-400"/></div>
                                        : <EncounterTimeline events={timelineEvents} encounter={encounter} />
                                    }
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-sm py-4">No recent encounters found.</p>
                )}
            </ul>
        </div>
    );
};

export default HeadToHead;