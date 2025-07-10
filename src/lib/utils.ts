// src/lib/utils.ts

export function generateSlug(homeTeam: string, awayTeam: string, id: number): string {
    const cleanedHome = homeTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const cleanedAway = awayTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `${cleanedHome}-vs-${cleanedAway}-${id}`;
}

export function generateNewsSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ & /g, '-and-')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}