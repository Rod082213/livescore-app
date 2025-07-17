// src/components/Footer.tsx

import { FaGithub, FaTwitter, FaRegCopyright } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#1d222d] border-t border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-12">
        
        {/* Main grid for the footer content. We use 5 columns on medium screens and up. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8">
          
          {/* --- ABOUT US SECTION (Takes 2 of 5 columns on medium screens) --- */}
          <div className="sm:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">About Us</h2>
            
            {/* 
              This wrapper is the key to the flexible fade-out effect.
              - `relative`: Allows the absolute-positioned fade element to be placed inside it.
              - `h-full`: Makes this container stretch to the full height of the grid row.
              - `overflow-hidden`: Ensures no text peeks out from the sides.
            */}
            <div className="relative h-full">
              <p className="
                text-gray-400 
                text-sm          
                text-justify          // Justifies the text for a clean, block-like look
                leading-relaxed       // Increases line spacing for readability
                [hyphens:auto]        // Allows words to break cleanly
              ">
                Todaylivescores has grown into a powerhouse for real-time sports coverage since its launch. It delivers instantaneous live scores, fixtures, results, standings, and in-depth match data for football, cricket, tennis, basketball, and hockey across world-class leagues and tournaments. The platform engages thousands of users monthly across 20+ popular leagues worldwide, forming a central hub for sports fans. Through the Todaylivescores app and web, users experience a seamless interface with fast updates, notifications, updated content, and synergy across media and betting systems.
              </p>
              
              {/* This div creates the fade-out effect. It covers the bottom of the parent `div`. */}
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#1d222d] to-transparent pointer-events-none" />
            </div>
          </div>
          
          {/* --- OTHER SECTIONS (Each takes 1 of 5 columns) --- */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Company</h2>
            <ul className="space-y-3"> {/* Increased vertical spacing */}
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Legal</h2>
            <ul className="space-y-3"> {/* Increased vertical spacing */}
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Use</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors"><FaGithub size={24} /></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={24} /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm flex items-center justify-center">
          <FaRegCopyright className="mr-2"/>
          <span>{new Date().getFullYear()} TLiveScores. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;