// src/components/BackButton.tsx (NEW FILE)

'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ text }: { text: string }) {
  const router = useRouter();

  const handleClick = () => {
    // 1. First, navigate back to the homepage
    router.push('/');

    // 2. Then, trigger a soft refresh of the server data for that page
    // This will re-run the `Home` component in `page.tsx` on the server
    // and provide fresh props to `DashboardWrapper`.
    router.refresh(); 
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
    >
      <ArrowLeft size={18} />
      Back to all Matches
    </button>
  );
}