// src/components/Header.tsx

'use client';

import { useState, useRef, ReactNode, useEffect } from 'react';
import { Search, Star, HelpCircle, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onSearchToggle: () => void;
  children: ReactNode;
}

const Header = ({ onSearchToggle, children }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header ref={headerRef} className="bg-[#1d222d] border-b border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.0002 2C11.0002 2 11.0002 8.5 14.5002 12C18.0002 15.5 11.5002 22 11.5002 22" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.0001 2C13.0001 2 13.0001 8.5 9.50006 12C6.00006 15.5 12.5 22 12.5 22" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <a href='/'><h1 className="text-xl font-bold text-white">TLiveScores</h1></a>
          </div>

          <div className="hidden md:block flex-grow max-w-lg mx-8">
            {children}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Star className="text-gray-300 w-6 h-6 hover:text-white cursor-pointer" />
              <HelpCircle className="text-gray-300 w-6 h-6 hover:text-white cursor-pointer" />
              <Settings className="text-gray-300 w-6 h-6 hover:text-white cursor-pointer" />
            </div>
            <button className="hidden md:block bg-white text-gray-900 font-semibold px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors">
              SIGN IN
            </button>
            <div className="md:hidden flex items-center gap-2">
                <button onClick={onSearchToggle} className="p-2 text-gray-300 hover:text-white">
                    <Search size={24} />
                </button>
                <button onClick={toggleMenu} className="p-2 text-gray-300 hover:text-white">
                    {isMenuOpen ? <X size={24}/> : <Menu size={24} />}
                </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 w-full bg-[#2b3341] shadow-lg z-30"
          >
            <div className="flex flex-col p-4 space-y-4">
              <button className="flex items-center gap-3 text-gray-200 hover:bg-gray-700 p-2 rounded-md">
                  <Star className="w-5 h-5" />
                  <span>Favorites</span>
              </button>
              <button className="flex items-center gap-3 text-gray-200 hover:bg-gray-700 p-2 rounded-md">
                  <HelpCircle className="w-5 h-5" />
                  <span>Help</span>
              </button>
              <button className="flex items-center gap-3 text-gray-200 hover:bg-gray-700 p-2 rounded-md">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
              </button>
              <button className="w-full bg-white text-gray-900 font-semibold py-2 rounded-full text-sm hover:bg-gray-200 transition-colors">
                SIGN IN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;