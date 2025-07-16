// src/app/(leagues)/layout.tsx

import RightSidebar from "@/components/RightSidebar";
import { getLatestHighlightVideo } from "@/lib/video-api";
// You will also need a function to get your top leagues
import { getTopLeagues } from "@/lib/league-api"; // Assumes you create this file/function

export default async function LeaguesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch all necessary data for the sidebar in parallel on the server
  const [videoData, topLeagues] = await Promise.all([
    getLatestHighlightVideo(),
    getTopLeagues(), // You'll need to implement this function
  ]);

  return (
    <div className="flex max-w-7xl mx-auto gap-8 px-4">
      {/* Main content area for the pages (e.g., league details, team details) */}
      <main className="flex-1 py-6">
        {children}
      </main>
      
      {/* Sidebar, which receives all its data as props */}
      <div className="py-6">
        <RightSidebar 
          initialTopLeagues={topLeagues} 
          videoData={videoData} 
        />
      </div>
    </div>
  );
}