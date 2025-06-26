// src/components/SportsNav.tsx

// FIX: Replaced non-existent icons with guaranteed-to-exist ones.
import { Shield, Dribbble, Trophy, Disc3, Gamepad2, Volleyball } from "lucide-react"; 

const sports = [
  { name: 'Football', icon: <Shield size={20}/>, count: 15 },
  { name: 'Basketball', icon: <Dribbble size={20}/>, count: 2 },
  { name: 'Tennis', icon: <Trophy size={20}/>, count: 40 },
  // CORRECTED: 'Hockey' is now 'Disc3' (puck icon)
  { name: 'Ice Hockey', icon: <Disc3 size={20}/>, count: 11 },
  { name: 'Esports', icon: <Gamepad2 size={20}/>, count: 6 },
  { name: 'Volleyball', icon: <Volleyball size={20}/>, count: 4 },
  
];

const SportsNav = () => {
  return (
    <nav className="bg-[#2b3341] sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-6 overflow-x-auto whitespace-nowrap h-12">
          {sports.map(sport => (
            <a href="#" key={sport.name} className="flex items-center gap-2 text-gray-300 hover:text-white font-medium text-sm transition-colors border-b-2 border-transparent hover:border-blue-500 py-3">
              {sport.icon}
              <span>{sport.name}</span>
              <span className="bg-gray-600 text-xs text-white px-1.5 py-0.5 rounded-full">{sport.count}</span>
            </a>
          ))}
          <a href="#" className="text-gray-300 hover:text-white font-medium text-sm">... More</a>
        </div>
      </div>
    </nav>
  );
};

export default SportsNav;