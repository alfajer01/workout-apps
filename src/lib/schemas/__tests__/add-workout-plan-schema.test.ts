import { describe, it, expect } from 'vitest';
import { addWorkoutPlanSchema } from '../add-workout-plan-schema';

describe('addWorkoutPlanSchema', () => {
    const validPlan = {
        title: 'Chest Day',
        exercises: [
            { name: 'Bench Press', totalSets: 4 },
        ],
    };

    describe('valid inputs', () => {
        it('should accept valid workout plan', () => {
            const result = addWorkoutPlanSchema.safeParse(validPlan);
            expect(result.success).toBe(true);
        });

        it('should accept multiple exercises', () => {
            const result = addWorkoutPlanSchema.safeParse({
                ...validPlan,
                exercises: [
                    { name: 'Bench Press', totalSets: 4 },
                    { name: 'Incline Press', totalSets: 3 },
                ],
            });
            expect(result.success).toBe(true);
        });
    });

    describe('invalid inputs', () => {
        it('should reject title shorter than 3 characters', () => {
            const result = addWorkoutPlanSchema.safeParse({ ...validPlan, title: 'Ab' });
            expect(result.success).toBe(false);
        });

        it('should reject empty exercises array', () => {
            const result = addWorkoutPlanSchema.safeParse({ ...validPlan, exercises: [] });
            expect(result.success).toBe(false);
        });

        it('should reject exercise name shorter than 3 characters', () => {
            const result = addWorkoutPlanSchema.safeParse({
                ...validPlan,
                exercises: [{ name: 'Ab', totalSets: 3 }],
            });
            expect(result.success).toBe(false);
        });

        it('should reject totalSets less than 1', () => {
            const result = addWorkoutPlanSchema.safeParse({
                ...validPlan,
                exercises: [{ name: 'Bench Press', totalSets: 0 }],
            });
            expect(result.success).toBe(false);
        });
    });
});
