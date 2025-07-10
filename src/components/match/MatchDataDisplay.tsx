// src/components/match/MatchDataDisplay.tsx
"use client";

import MatchStatistics from './MatchStatistics';
import MatchTimeline from './MatchTimeline';
import { ListCollapse } from 'lucide-react';

// This component receives all the data and decides what to show.
const MatchDataDisplay = ({ events, statistics, status }: { events?: any[], statistics?: Record<string, any>, status: string }) => {
    
    // Priority 1: Check if there are timeline events.
    const hasEvents = events && events.length > 0;

    // Priority 2: Check if there are statistics.
    const hasStats = statistics && Object.keys(statistics).length > 0;

    // Render based on priority
    if (hasEvents) {
        return <MatchTimeline events={events} />;
    }
    
    if (hasStats) {
        return <MatchStatistics statistics={statistics} />;
    }

    // Fallback: If neither events nor stats are available, show a generic message.
    return (
        <div className="bg-[#2b3341] rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ListCollapse size={20} /> Match Details
            </h3>
            <div className="text-center text-gray-400 py-8">
                {status === 'UPCOMING'
                    ? 'Timeline and statistics will be available when the match starts.'
                    : 'No key events or statistics were recorded for this match.'
                }
            </div>
        </div>
    );
};

export default MatchDataDisplay;