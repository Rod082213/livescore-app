// src/app/challenge/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { challengeData } from '@/data/challenge';

export async function submitPredictions(formData: FormData) {
  // In a real app, you would:
  // 1. Validate the user input (e.g., using Zod).
  // 2. Authenticate the user.
  // 3. Save the predictions to your database against the user's ID.

  const predictions: { [key: string]: string } = {};
  for (const match of challengeData.matches) {
    const homeScore = formData.get(`match-${match.id}-home`);
    const awayScore = formData.get(`match-${match.id}-away`);
    predictions[`match_${match.id}`] = `${homeScore}-${awayScore}`;
  }

  console.log('Received predictions:', predictions);
  
  // For this demo, we'll set a cookie to simulate that the user has submitted.
  // The cookie will expire when the challenge ends.
  cookies().set('challenge_submitted', 'true', {
    expires: challengeData.endDate,
    httpOnly: true,
  });

  // Revalidate the challenge page to update the UI
  revalidatePath('/challenge');
}