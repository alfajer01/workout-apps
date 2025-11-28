'use server';

import prisma from '@/lib/prisma';
import { requireCompleteProfile } from '@/actions/auth/profile';
import DietService from '@/actions/diet/DietService';

export async function getDashboardStats() {
  const user = await requireCompleteProfile();
  const dietService = new DietService();
  const today = new Date();

  // Ensure daily log exists and get diet stats
  const dailyLog = await dietService.getDailyLog(user.id, today);

  // Get workout stats for today
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const workoutsToday = await prisma.workout.count({
    where: {
      userId: user.id,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  // Calculate Streak (Simplified: consecutive days with workouts)
  // This is a potentially expensive operation, so we limit it or use a simplified approach
  // For now, let's just count workouts in the last 7 days as a "weekly activity" proxy or similar
  // Or try to calculate actual streak
  const recentWorkouts = await prisma.workout.findMany({
    where: {
      userId: user.id,
      startTime: {
        lte: endOfDay,
      },
    },
    orderBy: {
      startTime: 'desc',
    },
    select: {
      startTime: true,
    },
    take: 30, // Check last 30 workouts
  });

  let streak = 0;
  if (recentWorkouts.length > 0) {
    const todayStr = startOfDay.toDateString();
    let currentDate = new Date(startOfDay);
    
    // Check if there is a workout today
    const hasWorkoutToday = recentWorkouts.some(w => new Date(w.startTime).toDateString() === todayStr);
    if (hasWorkoutToday) {
        streak = 1;
        currentDate.setDate(currentDate.getDate() - 1); // Move to yesterday
    } else {
        // If no workout today, check yesterday to see if streak is still active (or broken today)
        // If we want "current active streak", it might be 0 if no workout today. 
        // But usually users want to see the streak they are building.
        // Let's assume streak includes yesterday.
         currentDate.setDate(currentDate.getDate() - 1); // Move to yesterday
    }

    // Iterate backwards
    while (true) {
        const dateStr = currentDate.toDateString();
        const hasWorkoutOnDate = recentWorkouts.some(w => new Date(w.startTime).toDateString() === dateStr);
        
        if (hasWorkoutOnDate) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            // If we didn't count today yet (streak=0) and yesterday has no workout, streak is 0.
            // If we counted today (streak=1) and yesterday has no workout, streak is 1.
            break;
        }
    }
  }

  // Next Scheduled Workout
  const nextWorkout = await prisma.workout.findFirst({
    where: {
      userId: user.id,
      startTime: {
        gt: new Date(),
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  let motivation = "Ready to crush your goals today? You're doing great! Keep up the momentum.";
  
  try {
    const { generateText } = await import('ai');
    const { getModel } = await import('@/lib/ai/model');
    
    const { text } = await generateText({
      model: getModel(),
      system: 'You are a fitness coach. Create a short, punchy, 1-sentence motivational welcome message for the user.',
      prompt: `
        User: ${user.name}
        Workouts today: ${workoutsToday}
        Streak: ${streak} days
        Calories burned today: ${Math.round(dailyLog.caloriesOut)}
        
        If they have a streak, mention it. If they worked out today, congratulate them. If not, encourage them to start.
      `,
    });
    
    if (text) motivation = text;
  } catch (error) {
    console.error("Failed to generate motivation:", error);
    // Fallback is already set
  }

  return {
    user,
    caloriesIn: Math.round(dailyLog.caloriesIn),
    caloriesBurned: Math.round(dailyLog.caloriesOut),
    netCalories: Math.round(dailyLog.netCalories),
    workoutsToday,
    streak,
    nextWorkout: nextWorkout ? nextWorkout.title : 'No scheduled workout',
    motivation,
  };
}
