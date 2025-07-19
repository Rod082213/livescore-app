// src/lib/utils.ts

// --- 1. THE "MASTER" SLUG FUNCTION (Unchanged) ---
export const createSlug = (name: string): string => {
  if (!name) return '';
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')
  return name.toString().toLowerCase()
    .replace(p, c => b.charAt(a.indexOf(c)))
    .replace(/&/g, '-and-')      
    .replace(/\s+/g, '-')      
    .replace(/[^\w\-]+/g, '')  
    .replace(/\-\-+/g, '-')    
    .replace(/^-+/, '')        
    .replace(/-+$/, '');       
};

// --- 2. YOUR SLUG CREATION FUNCTIONS (Unchanged) ---
export const createTeamSlug = (name: string, id: number): string => {
  if (!name || !id) return '';
  const baseSlug = createSlug(name);
  return `${baseSlug}-${id}`;
};
export const createLeagueSlug = (name: string, id: number): string => {
    if (!name || !id) return '';
    const baseSlug = createSlug(name);
    return `${baseSlug}-${id}`;
};
export function generateSlug(homeTeam: string, awayTeam: string, id: number): string {
    const cleanedHome = createSlug(homeTeam);
    const cleanedAway = createSlug(awayTeam);
    return `${cleanedHome}-vs-${cleanedAway}-${id}`;
}
export function generateNewsSlug(title: string): string {
  return createSlug(title);
}

// --- 3. THE GENERIC ID EXTRACTION FUNCTION (Unchanged) ---
export const getIdFromSlug = (slug: string): string | null => {
    if (!slug) return null;
    const parts = slug.split('-');
    const potentialId = parts[parts.length - 1];
    return /^\d+$/.test(potentialId) ? potentialId : null;
};

// --- 4. NEW HELPER FUNCTION (Optional) ---
// Since your API provides the country code directly, you may not need this.
// But it's good practice to have it in case you work with other data sources.
const countryNameToCodeMap: { [key: string]: string } = {
  'England': 'GB', 'Spain': 'ES', 'Germany': 'DE', 'Italy': 'IT', 'France': 'FR',
  'Portugal': 'PT', 'Netherlands': 'NL', 'Brazil': 'BR', 'Argentina': 'AR',
  'USA': 'US',
};

export function convertCountryNameToCode(countryName: string): string {
  return countryNameToCodeMap[countryName] || 'XX'; // Return a default/unknown code
}