'use server';

import prisma from '@/lib/prisma';
import { addWorkoutSchema } from '@/lib/schemas/add-workout-schema';
import getUserData from '../auth/profile';
import { getCurrentDateTimeLocal } from '@/lib/utils';
import { generateText } from 'ai';
import { getModel } from '@/lib/ai/model';
import DietService from '../diet/DietService';

export async function addWorkout(data: {
  title: string;
  startTime: String;
  endTime?: String;
  exercises: {
    name: string;
    order: number;
    sets: { reps: number; weight: number; order: number }[];
  }[];
}) {
  try {
    const parsed = addWorkoutSchema.safeParse(data);

    if (!parsed.success) {
      return { success: false, status: 400, message: parsed.error };
    }

    const { title, startTime, endTime, exercises } = parsed.data;

    const user = await getUserData();

    if (!user) {
      return { success: false, status: 401, message: 'Unauthorized' };
    }

    const { text } = await generateText({
      model: getModel(),
      system: 'You are a calories estimation engine. Return ONLY a single integer with no words.',
      prompt: `
        Based ONLY on the data below, estimate the total calories burned for the full workout session.
        
        Workout:
        ${JSON.stringify({ title, startTime, endTime, exercises })}
      `,
    });

    const caloriesBurned = parseInt(text) || 0;

    console.log(caloriesBurned);
    await prisma.workout.create({
      data: {
        userId: user.id,
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime || getCurrentDateTimeLocal()),
        totalCaloriesBurned: caloriesBurned,
        exercises: {
          create: exercises.map(exercise => ({
            name: exercise.name,
            order: exercise.order,
            sets: {
              create: exercise.sets.map(set => ({
                reps: set.reps,
                weight: set.weight,
                order: set.order,
              })),
            },
          })),
        },
      },
    });

    const workoutDate = new Date(startTime);
    const normalizedDate = new Date(
      Date.UTC(
        workoutDate.getUTCFullYear(),
        workoutDate.getUTCMonth(),
        workoutDate.getUTCDate()
      )
    );
    const dietService = new DietService();
    // Pastikan daily log hari terkait ada, lalu tambah kalori keluar dan hitung ulang net.
    const log = await dietService.getDailyLog(user.id, normalizedDate);
    await prisma.dailyLog.update({
      where: { id: log.id },
      data: { caloriesOut: { increment: caloriesBurned } },
    });
    await dietService.recalculateCalories(user.id, normalizedDate);

    return {
      success: true,
      status: 200,
      message: 'Workout plan created successfully',
    };
  } catch (error) {
    console.error(error);
    return { success: false, status: 500, message: 'Internal server error' };
  }
}
