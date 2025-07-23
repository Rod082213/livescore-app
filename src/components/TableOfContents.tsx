'use client';

import React from 'react';
import { IContentBlock } from '@/models/Post';

// Helper function to create URL-friendly slugs from heading text
const generateSlug = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const TableOfContents = ({ headings }: { headings: IContentBlock[] }) => {
  // This function handles the smooth scrolling when a link is clicked
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Modern way to scroll smoothly to an element
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // If there are no headings in the article, don't render anything
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-[#283040] rounded-lg border border-gray-700">
      <h3 className="font-bold text-white mb-4 text-lg">Table of Contents</h3>
      <ul className="space-y-2">
        {headings.map((heading, index) => {
          const id = generateSlug(heading.data.text);
          const isSubheading = heading.data.level > 2; // e.g., an h3 or h4
          
          // Indent subheadings for better visual hierarchy
          const marginLeft = `${(heading.data.level - 2) * 1}rem`;

          return (
            <li key={index} style={{ marginLeft }}>
              <a
                href={`#${id}`}
                onClick={(e) => handleScroll(e, id)}
                className={`transition-colors ${
                  isSubheading 
                    ? 'text-sm text-gray-300 hover:text-blue-400' 
                    : 'text-base text-gray-200 hover:text-blue-300'
                }`}
              >
                {heading.data.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableOfContents;