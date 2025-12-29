import { describe, it, expect } from 'vitest';
import { addWorkoutSchema } from '../add-workout-schema';

describe('addWorkoutSchema', () => {
    const validWorkout = {
        title: 'Morning Workout',
        startTime: '2024-01-15T08:00',
        exercises: [
            {
                name: 'Squats',
                order: 1,
                sets: [{ reps: 10, weight: 60, order: 1 }],
            },
        ],
    };

    describe('valid inputs', () => {
        it('should accept valid workout', () => {
            const result = addWorkoutSchema.safeParse(validWorkout);
            expect(result.success).toBe(true);
        });

        it('should accept workout with optional endTime', () => {
            const result = addWorkoutSchema.safeParse({
                ...validWorkout,
                endTime: '2024-01-15T09:00',
            });
            expect(result.success).toBe(true);
        });
    });

    describe('invalid inputs', () => {
        it('should reject title shorter than 3 characters', () => {
            const result = addWorkoutSchema.safeParse({ ...validWorkout, title: 'Ab' });
            expect(result.success).toBe(false);
        });

        it('should reject empty startTime', () => {
            const result = addWorkoutSchema.safeParse({ ...validWorkout, startTime: '' });
            expect(result.success).toBe(false);
        });

        it('should reject empty exercises array', () => {
            const result = addWorkoutSchema.safeParse({ ...validWorkout, exercises: [] });
            expect(result.success).toBe(false);
        });

        it('should reject set with reps less than 1', () => {
            const result = addWorkoutSchema.safeParse({
                ...validWorkout,
                exercises: [{
                    name: 'Squats',
                    order: 1,
                    sets: [{ reps: 0, weight: 60, order: 1 }],
                }],
            });
            expect(result.success).toBe(false);
        });

        it('should reject negative weight', () => {
            const result = addWorkoutSchema.safeParse({
                ...validWorkout,
                exercises: [{
                    name: 'Squats',
                    order: 1,
                    sets: [{ reps: 10, weight: -5, order: 1 }],
                }],
            });
            expect(result.success).toBe(false);
        });
    });
});
