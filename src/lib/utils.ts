// src/lib/utils.ts

// Keep your existing function for match slugs
export function generateSlug(homeTeam: string, awayTeam: string, id: number): string {
    const cleanedHome = homeTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const cleanedAway = awayTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `${cleanedHome}-vs-${cleanedAway}-${id}`;
}

// Keep your existing function for news slugs
export function generateNewsSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ & /g, '-and-')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- ADD THIS NEW FUNCTION ---
// This is the function that your teams-list page is looking for.
// It takes a single string (like a team name) and turns it into a URL-friendly slug.
export const createSlug = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/&/g, 'and')      // Replace & with 'and'
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w\-]+/g, '')  // Remove all non-word chars except hyphen
    .replace(/\-\-+/g, '-')    // Replace multiple hyphens with a single one
    .replace(/^-+/, '')        // Trim hyphen from start
    .replace(/-+$/, '');       // Trim hyphen from end
};