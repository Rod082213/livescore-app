// src/app/challenge/page.tsx
import { cookies } from 'next/headers';
import { challengeData } from '@/data/challenge';
import { submitPredictions } from './actions';
import { CouponDisplay } from '@/components/features/challenge/CouponDisplay';

export default function ChallengePage() {
  const hasSubmitted = cookies().get('challenge_submitted')?.value === 'true';
  const isChallengeOver = new Date() > challengeData.endDate;

  // SCENARIO 1: Challenge is over. We assume the user won for this demo.
  // In a real app, you'd check their saved predictions against the actual results.
  if (isChallengeOver) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-2 text-center text-3xl font-bold text-green-600">Congratulations!</h1>
          <p className="mb-6 text-center text-gray-600">
            The challenge has ended, and you are a winner! Use the coupon below on our partner's site.
          </p>
          <CouponDisplay />
        </div>
      </main>
    );
  }

  // SCENARIO 2: Challenge is active, but the user has already submitted.
  if (hasSubmitted) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow-md">
          <h1 className="mb-2 text-center text-3xl font-bold">Thanks for Participating!</h1>
          <p className="text-gray-600">Your predictions have been submitted. Check back after the matches to see if you've won.</p>
        </div>
      </main>
    );
  }

  // SCENARIO 3: Challenge is active and user has not submitted yet.
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-bold">{challengeData.title}</h1>
        <p className="mb-8 text-center text-gray-600">{challengeData.description}</p>
        
        <form action={submitPredictions} className="space-y-6">
          {challengeData.matches.map((match) => (
            <div key={match.id} className="rounded-md border p-4">
              <div className="grid grid-cols-3 items-center gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  {/* <img src={match.homeLogo} alt={match.homeTeam} className="h-10 w-10"/> */}
                  <span className="font-semibold">{match.homeTeam}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="number"
                    name={`match-${match.id}-home`}
                    className="w-14 rounded-md border p-2 text-center"
                    required
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name={`match-${match.id}-away`}
                    className="w-14 rounded-md border p-2 text-center"
                    required
                    min="0"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                   {/* <img src={match.awayLogo} alt={match.awayTeam} className="h-10 w-10"/> */}
                  <span className="font-semibold">{match.awayTeam}</span>
                </div>
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Submit Predictions
          </button>
        </form>
      </div>
    </main>
  );
}