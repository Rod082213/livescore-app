// src/components/match/MatchTimeline.tsx
"use client";

import { ListCollapse, Goal, Circle, Replace, FileText } from 'lucide-react';

const MatchTimeline = ({ events }: { events: any[] }) => {
  const getEventIcon = (type: string, detail: string) => {
    if (type === 'Goal') return <Goal size={16} className="text-green-400" />;
    if (type === 'Card') return <FileText size={16} className={detail.includes('Yellow') ? 'text-yellow-400' : 'text-red-500'} />;
    if (type === 'subst') return <Replace size={16} className="text-blue-400" />;
    return <Circle size={16} className="text-gray-500" />;
  };

  return (
    <div className="bg-[#2b3341] rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <ListCollapse size={20} /> Match Timeline
      </h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex items-center gap-4 text-sm">
            <div className="font-bold text-gray-400">{event.time.elapsed}'</div>
            <div className="flex items-center gap-2">
              {getEventIcon(event.type, event.detail)}
              <span className="font-semibold text-white">{event.player.name}</span>
              <span className="text-gray-400">({event.team.name})</span>
            </div>
            <div className="text-gray-300 ml-auto">{event.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchTimeline;