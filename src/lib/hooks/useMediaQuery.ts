// src/lib/hooks/useMediaQuery.ts
'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook to safely check for a media query match in a Next.js app.
 * Handles server-side rendering by returning a default value.
 * @param query The media query string (e.g., '(max-width: 767px)')
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure this code runs only on the client
    const media = window.matchMedia(query);
    
    // Update state if the media query match status changes
    const handleChange = () => {
      setMatches(media.matches);
    };

    // Set the initial state
    handleChange();

    // Listen for changes
    media.addEventListener('change', handleChange);

    // Cleanup listener on component unmount
    return () => media.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};