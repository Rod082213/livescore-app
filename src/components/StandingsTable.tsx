// src/components/StandingsTable.tsx
import { Standing } from '@/data/mockData'; // Import the type
import Image from 'next/image';

const FormResult = ({ result }: { result: 'W' | 'D' | 'L' }) => { /* ... remains the same ... */ }

// Make it accept props
const StandingsTable = ({ standings }: { standings: Standing[] }) => {
  if (standings.length === 0) {
    return (
      <div className="bg-[#2b3341] rounded-lg p-4 text-center text-gray-400">
        Standings for this league are not available at the moment.
      </div>
    );
  }

  return (
    <div className="bg-[#2b3341] rounded-lg">
      <div className="p-4 border-b border-gray-700"><h2 className="text-lg font-bold text-white">Standings</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          {/* ... thead remains the same ... */}
          <tbody>
            {standings.map((row: Standing) => (
              <tr key={row.rank} className="border-t border-gray-700">
                {/* ... td elements remain the same, using 'row' data ... */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StandingsTable;