// src/lib/utils.ts

// --- 1. THE "MASTER" SLUG FUNCTION ---
// This is our single, robust function for converting any name into a clean slug.
// All other slug functions will use this for consistency.
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


// --- 2. YOUR SLUG CREATION FUNCTIONS (Unchanged) ---

// Function for team slugs (e.g., "manchester-united-33")
export const createTeamSlug = (name: string, id: number): string => {
  if (!name || !id) return '';
  const baseSlug = createSlug(name);
  return `${baseSlug}-${id}`;
};

// Function for league slugs (e.g., "premier-league-39")
export const createLeagueSlug = (name: string, id: number): string => {
    if (!name || !id) return '';
    const baseSlug = createSlug(name);
    return `${baseSlug}-${id}`;
};

// Function for match slugs, using createSlug for consistency.
export function generateSlug(homeTeam: string, awayTeam: string, id: number): string {
    const cleanedHome = createSlug(homeTeam);
    const cleanedAway = createSlug(awayTeam);
    return `${cleanedHome}-vs-${cleanedAway}-${id}`;
}

// Function for news slugs, also using createSlug.
export function generateNewsSlug(title: string): string {
  return createSlug(title);
}


// --- 3. THIS IS THE NEW FUNCTION THAT WAS MISSING ---
// This generic function extracts the numerical ID from the end of a slug.
// It will solve the 'getLeagueIdFromSlug is not defined' error on your dynamic pages.
export const getIdFromSlug = (slug: string): string | null => {
    if (!slug) return null;
    const parts = slug.split('-');
    const potentialId = parts[parts.length - 1];
    // Use a regular expression to confirm the last part is composed only of digits.
    return /^\d+$/.test(potentialId) ? potentialId : null;
};