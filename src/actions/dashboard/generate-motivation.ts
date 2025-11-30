'use server';

import { getModel } from '@/lib/ai/model';
import { generateText } from 'ai';

interface MotivationInput {
  name: string;
  workoutsToday: number;
  streak: number;
  caloriesBurned: number;
}

export async function generateMotivationAction({
  name,
  workoutsToday,
  streak,
  caloriesBurned,
}: MotivationInput) {
  try {
    const model = getModel();
    const { text } = await generateText({
      model,
      prompt: `
        You are a fitness motivator. The user ${name} has:
        - Completed ${workoutsToday} workouts today.
        - A ${streak}-day workout streak.
        - Burned ${caloriesBurned} calories today.
        
        Generate a short, punchy, and personalized motivational sentence (max 20 words) for their dashboard hero section.
        If they haven't worked out, encourage them to start.
        If they have a streak, celebrate it.
        Keep it casual and friendly.
      `,
    });
    return text;
  } catch (error) {
    console.error('Failed to generate motivation:', error);
    return "Ready to crush your goals today? You're doing great! Keep up the momentum.";
  }
}
