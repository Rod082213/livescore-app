// src/components/MatchStats.tsx
import { mockMatchStats } from '@/data/mockData';
import { BarChart2 } from 'lucide-react';

const MatchStats = () => {
  return (
    <div className="bg-[#2b3341] rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <BarChart2 size={20} /> Statistics
      </h3>
      <div className="space-y-4">
        {mockMatchStats.map((stat, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1 text-sm font-semibold text-white">
              <span>{stat.home}</span>
              <span className="text-gray-400">{stat.type}</span>
              <span>{stat.away}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2 flex">
              <div className="bg-blue-500 h-2 rounded-l-full" style={{ width: stat.home.toString() }}></div>
              <div className="bg-gray-400 h-2 rounded-r-full flex-grow"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MatchStats;