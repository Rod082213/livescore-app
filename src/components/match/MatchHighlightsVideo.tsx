// src/components/match/MatchHighlightsVideo.tsx

import { Highlight } from '@/lib/types';
import { Film } from 'lucide-react';

export default function MatchHighlightsVideo({ highlights }: { highlights: Highlight[] }) {
  // Although the page component checks this, it's good practice to have a safeguard
  if (!highlights || highlights.length === 0) {
    return null;
  }

  // We will display the first highlight found
  const mainHighlight = highlights[0];

  return (
    <div className="my-6 bg-[#182230] rounded-lg overflow-hidden shadow-lg">
      <h2 className="text-xl font-bold p-4 flex items-center gap-3 text-white border-b border-gray-700">
        <Film className="text-blue-400" />
        Match Highlights
      </h2>
      <div className="aspect-video bg-black">
        <iframe
          src={mainHighlight.embedUrl}
          title={mainHighlight.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate" title={mainHighlight.title}>
          {mainHighlight.title}
        </h3>
      </div>
    </div>
  );
}