// src/components/SportsNav.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Dribbble, Trophy, Newspaper, Users } from 'lucide-react';

interface SportsNavProps {
  liveMatchCount: number;
}

const SportsNav = ({ liveMatchCount }: SportsNavProps) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Football', href: '/', icon: <Shield size={18} />, count: liveMatchCount },
     { name: 'Teams', href: '/teams-list', icon: <Users size={18} /> },
      { name: 'Sport Highlights', href: '/highlights', icon: <Trophy size={18} /> },
    // { name: 'Basketball', href: '/basketball', icon: <Dribbble size={18} /> },
    // { name: 'Tennis', href: '/tennis', icon: <Trophy size={18} /> },
    { name: 'News', href: '/news', icon: <Newspaper size={18} /> },
   
    { name: 'Blogs', href: '/blog', icon: <Newspaper size={18} /> },
   
   
    // You can add more items here to test the scrolling
    // { name: 'Ice Hockey', href: '/hockey', icon: <div className="w-4 h-4" /> },
    // { name: 'Volleyball', href: '/volleyball', icon: <div className="w-4 h-4" /> },
    // { name: 'Esports', href: '/esports', icon: <div className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-[#1d222d] border-b border-gray-700 ">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-1 py-3 text-sm font-semibold relative transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.count && item.count > 0 && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SportsNav;