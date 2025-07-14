// src/components/BackButton.tsx (NEW FILE)

'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BackButton({ text }: { text: string }) {
  const router = useRouter();


  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
    >
      <ArrowLeft size={18} />
      Back to All Matches
    </Link>
  );
}