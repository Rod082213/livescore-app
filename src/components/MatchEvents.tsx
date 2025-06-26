// src/components/MatchEvents.tsx
import { mockMatchEvents, MatchEvent } from '@/data/mockData';
import Image from 'next/image';
import { Footprints, RectangleVertical, Square } from 'lucide-react'; // Using standard icons

const EventIcon = ({ type }: { type: MatchEvent['type'] }) => {
  if (type === 'goal') return <Footprints className="w-4 h-4 text-white" />;
  if (type === 'yellowcard') return <Square className="w-4 h-4 text-yellow-400 fill-current" />;
  if (type === 'redcard') return <Square className="w-4 h-4 text-red-500 fill-current" />;
  return <RectangleVertical className="w-4 h-4 text-gray-400" />;
};

const MatchEvents = () => {
  return (
    <div className="bg-[#2b3341] rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Match Events</h3>
      <div className="space-y-4">
        {mockMatchEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-4 text-sm">
            <div className="font-bold text-white">{event.minute}'</div>
            <div className="bg-gray-700/50 p-1.5 rounded-full"><EventIcon type={event.type} /></div>
            <Image src={event.teamLogo} alt="Team Logo" width={20} height={20} />
            <div>
              <p className="font-semibold text-white">{event.player}</p>
              <p className="text-gray-400">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MatchEvents;