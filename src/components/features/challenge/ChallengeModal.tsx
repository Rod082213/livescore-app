// src/components/features/challenge/ChallengeModal.tsx
'use client';

import { FormEvent, useEffect } from 'react';
import { challengeData } from '@/data/challenge';
import { submitPredictions } from '@/app/challenge/actions';
import { CouponDisplay } from './CouponDisplay';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasSubmitted: boolean;
  isChallengeOver: boolean;
}

export function ChallengeModal({ isOpen, onClose, hasSubmitted, isChallengeOver }: ChallengeModalProps) {
  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Handle form submission and close the modal
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await submitPredictions(formData);
    onClose(); // Close modal after submission
  };

  if (!isOpen) {
    return null;
  }
  
  // Modal Content Logic
  let content;
  if (isChallengeOver) {
    // SCENARIO 1: Challenge is over (assume win for demo)
    content = (
      <>
        <h1 className="mb-2 text-center text-3xl font-bold text-green-600">Congratulations!</h1>
        <p className="mb-6 text-center text-gray-600">The challenge has ended, and you are a winner!</p>
        <CouponDisplay />
      </>
    );
  } else if (hasSubmitted) {
    // SCENARIO 2: Already submitted
    content = (
       <>
        <h1 className="mb-2 text-center text-3xl font-bold">Thanks for Participating!</h1>
        <p className="text-gray-600">Your predictions have been submitted. Check back after the matches to see if you've won.</p>
       </>
    );
  } else {
    // SCENARIO 3: Prediction Form
    content = (
       <>
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-300">Weekly Challenge</h1>
        <p className="mb-8 text-center text-gray-500">Correctly predict the scores for all three matches below to win a prize!</p>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {challengeData.matches.map((match) => (
            <div key={match.id} className="grid grid-cols-5 items-center gap-2 rounded-md border border-gray-200 p-4">
              <span className="col-span-2 text-right font-semibold text-gray-400">{match.homeTeam}</span>
              <div className="col-span-1 flex items-center justify-center gap-1">
                <input type="number" name={`match-${match.id}-home`} className="w-12 rounded border border-gray-300 p-2 text-center" required min="0" />
                <span className="text-gray-300">-</span>
                <input type="number" name={`match-${match.id}-away`} className="w-12 rounded border border-gray-300 p-2 text-center" required min="0" />
              </div>
              <span className="col-span-2 text-left font-semibold text-gray-400">{match.awayTeam}</span>
            </div>
          ))}
          <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700">
            Submit Predictions
          </button>
        </form>
       </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XMarkIcon className="h-6 w-6" />
        </button>
        {content}
      </div>
    </div>
  );
}