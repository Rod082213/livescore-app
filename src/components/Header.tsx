// src/components/Header.tsx
import { Search, Star, HelpCircle, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#1d222d] border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.0002 2C11.0002 2 11.0002 8.5 14.5002 12C18.0002 15.5 11.5002 22 11.5002 22" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.0001 2C13.0001 2 13.0001 8.5 9.50006 12C6.00006 15.5 12.5 22 12.5 22" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-bold text-white">LiveStats</span>
          </div>

          {/* Center: Search Bar (hidden on mobile) */}
          <div className="hidden md:flex flex-grow max-w-lg mx-8 items-center bg-[#2b3341] rounded-full px-4">
            <Search className="text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search matches, competitions, teams, players..."
              className="w-full bg-transparent text-white placeholder-gray-400 py-2 px-3 focus:outline-none"
            />
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Star className="text-gray-300 w-6 h-6 hover:text-white cursor-pointer" />
              <HelpCircle className="text-gray-300 w-6 h-6 hover:text-white cursor-pointer" />
              <Settings className="text-gray-300 w-6 h-6 hover:text-white cursor-pointer" />
            </div>
            <button className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors">
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;