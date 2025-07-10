// src/components/features/challenge/CouponDisplay.tsx
'use client';

import { useState } from 'react';
import { challengeData } from '@/data/challenge';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

export function CouponDisplay() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(challengeData.reward.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="mt-6 text-center">
      <p className="text-lg">Your Coupon Code:</p>
      <div className="my-4 inline-flex items-center gap-4 rounded-lg border-2 border-dashed border-green-500 bg-green-50 p-4">
        <span className="text-2xl font-bold tracking-widest text-gray-800">
          {challengeData.reward.couponCode}
        </span>
        <button onClick={handleCopy} className="text-gray-500 hover:text-green-600">
          {copied ? (
            <CheckIcon className="h-6 w-6 text-green-600" />
          ) : (
            <ClipboardDocumentIcon className="h-6 w-6" />
          )}
        </button>
      </div>
      <div className="mt-6">
        <a
          href={challengeData.reward.ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition hover:bg-green-700"
        >
          {challengeData.reward.ctaText}
        </a>
      </div>
    </div>
  );
}