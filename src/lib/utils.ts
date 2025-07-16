// src/lib/utils.ts

// --- 1. THE "MASTER" SLUG FUNCTION (NOW IMPROVED) ---
// This new version correctly handles accented and special characters.
export const createSlug = (name: string): string => {
  if (!name) return '';

  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return name.toString().toLowerCase()
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters first
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w\-]+/g, '')  // Remove all non-word chars except hyphen
    .replace(/\-\-+/g, '-')    // Replace multiple hyphens with a single one
    .replace(/^-+/, '')        // Trim hyphen from start
    .replace(/-+$/, '');       // Trim hyphen from end
};


// --- 2. YOUR SLUG CREATION FUNCTIONS (Unchanged) ---
// These functions will now automatically benefit from the improved createSlug function above.

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


// --- 3. THE GENERIC ID EXTRACTION FUNCTION (Unchanged) ---
// This function is correct and does not need changes.
export const getIdFromSlug = (slug: string): string | null => {
    if (!slug) return null;
    const parts = slug.split('-');
    const potentialId = parts[parts.length - 1];
    return /^\d+$/.test(potentialId) ? potentialId : null;
};