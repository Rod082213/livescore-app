// src/components/features/challenge/ChallengeWidget.tsx
'use client';

import Link from 'next/link';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { challengeData } from '@/data/challenge';
import { ChevronRightIcon } from '@heroicons/react/24/solid'; // npm install @heroicons/react

export function ChallengeWidget() {
  const { days, hours, isOver } = useCountdown(challengeData.endDate);

  if (isOver) {
    return null; // Or show a "Challenge Over" message
  }

  return (
    <Link href="/challenge" className="block">
      <div className="flex items-center justify-between rounded-lg bg-blue-600 p-4 text-white shadow-lg transition-transform hover:scale-105">
        <div>
          <h2 className="font-bold text-lg">{challengeData.title}</h2>
          <p className="text-sm opacity-90">
            Time left: {days}d {hours}h
          </p>
        </div>
        <ChevronRightIcon className="h-6 w-6" />
      </div>
    </Link>
  );
}