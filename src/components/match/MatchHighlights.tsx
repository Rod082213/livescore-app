// src/components/match/MatchHighlights.tsx
import { Highlight } from "@/lib/types";
import { FilmIcon } from '@heroicons/react/24/outline';

interface MatchHighlightsProps {
  highlights: Highlight[];
}

export default function MatchHighlights({ highlights }: MatchHighlightsProps) {
  const hasHighlights = highlights && highlights.length > 0;

  return (
    // The main container is now always rendered
    <div className="bg-[#182230] p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-white">
        <FilmIcon className="h-6 w-6 text-blue-400" />
        Match Highlights
      </h2>
      
      {/* --- THIS IS THE LOGIC CHANGE --- */}
      {/* We use a conditional (ternary) operator to decide what to show inside the box */}
      {hasHighlights ? (
        // If there ARE highlights, map over them and display them
        <div className="space-y-6">
          {highlights.map((highlight) => (
            <div key={highlight.id}>
              <h3 className="text-md font-medium mb-2 text-gray-200">{highlight.title}</h3>
              <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden bg-black">
                <iframe
                  src={highlight.embedUrl}
                  title={highlight.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // If there are NO highlights, display a message
        <div className="flex justify-center items-center h-24">
          <p className="text-gray-400">No highlights were recorded for this match.</p>
        </div>
      )}
    </div>
  );
}