// src/components/BackToNewsButton.tsx (NEW FILE)

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackToNewsButton({ text }: { text: string }) {
  return (
    // This is a simple, direct link to the main news listing page.
    <Link
      href="/teams-list"
      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
    >
      <ArrowLeft size={18} />
      {text}
    </Link>
  );
}