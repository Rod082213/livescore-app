// src/components/match/MatchHighlights.tsx
import { Highlight } from "@/lib/types";
import { FilmIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

/**
 * A reusable helper component to render the video player.
 * This avoids duplicating the iframe code.
 */
const VideoPlayer = ({ video }: { video: Highlight }) => (
  <div>
    <h3 className="text-md font-medium mb-2 text-gray-200 truncate" title={video.title}>
      {video.title}
    </h3>
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
      <iframe
        src={video.embedUrl}
        title={video.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  </div>
);

// --- MODIFIED PROPS ---
// Added an optional `liveStream` prop.
interface MatchHighlightsProps {
  highlights?: Highlight[];
  liveStream?: Highlight;
}

export default function MatchHighlights({ highlights, liveStream }: MatchHighlightsProps) {
  const firstHighlight = highlights?.[0];

  // --- MODIFIED LOGIC ---
  // The component now determines what to display with a clear priority:
  // 1. Live Stream (if available)
  // 2. The first Highlight (if available)
  // 3. A fallback message
  
  let title: string;
  let icon: React.ReactNode;
  let content: React.ReactNode;

  if (liveStream) {
    // If a live stream exists, display it.
    title = "Live Stream";
    // Use a different icon and color for visual distinction.
    icon = <PlayCircleIcon className="h-6 w-6 text-red-500" />;
    content = <VideoPlayer video={liveStream} />;

  } else if (firstHighlight) {
    // If no live stream, but highlights exist, display the first one.
    title = "Match Highlights";
    icon = <FilmIcon className="h-6 w-6 text-blue-400" />;
    content = <VideoPlayer video={firstHighlight} />;

  } else {
    // If neither exists, show a generic message.
    title = "Match Media";
    icon = <FilmIcon className="h-6 w-6 text-gray-500" />;
    content = (
      <div className="flex justify-center items-center h-24">
        <p className="text-gray-400">No stream or highlights are available for this match.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#182230] p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-white">
        {icon}
        {title}
      </h2>
      {content}
    </div>
  );
}