import { FaCity, FaUsers } from 'react-icons/fa';

interface VenueInformationProps {
  venue: { name: string; city: string; capacity: number; };
}

export default function VenueInformation({ venue }: VenueInformationProps) {
  return (
    <div className="bg-[#2b3341] rounded-lg p-4 h-full">
      <h2 className="text-lg font-bold text-white mb-4">Venue Information</h2>
      <ul className="space-y-3 text-gray-300">
        <li className="flex items-center justify-between border-b border-gray-700 pb-2">
          <span className="flex items-center gap-2">Stadium</span>
          <span className="font-semibold text-white">{venue.name}</span>
        </li>
        <li className="flex items-center justify-between border-b border-gray-700 pb-2">
          <span className="flex items-center gap-2"><FaCity /> City</span>
          <span className="font-semibold text-white">{venue.city}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex items-center gap-2"><FaUsers /> Capacity</span>
          <span className="font-semibold text-white">{venue.capacity.toLocaleString()}</span>
        </li>
      </ul>
    </div>
  );
}