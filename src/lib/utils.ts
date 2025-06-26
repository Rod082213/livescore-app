// src/lib/utils.ts

export function generateSlug(homeTeam: string, awayTeam: string, id: number): string {
    const cleanedHome = homeTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const cleanedAway = awayTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    // Append the ID to ensure the URL is always unique
    return `${cleanedHome}-vs-${cleanedAway}-${id}`;
}