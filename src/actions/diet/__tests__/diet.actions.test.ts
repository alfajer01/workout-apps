import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

vi.mock('@/lib/auth', () => ({
    getSession: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

vi.mock('../DietService', () => ({
    default: class {
        addMeal = () => Promise.resolve();
        updateMeal = () => Promise.resolve();
        deleteMeal = () => Promise.resolve();
        updateGoal = () => Promise.resolve();
        recalculateCalories = () => Promise.resolve();
    },
}));

vi.mock('../FoodService', () => ({
    default: class {
        addCustomFood = () => Promise.resolve({ id: 1 });
        updateFood = () => Promise.resolve({ id: 1 });
        deleteFood = () => Promise.resolve();
    },
}));

vi.mock('../ProgressService', () => ({
    default: class {
        addWeightLog = () => Promise.resolve();
    },
}));

import { getSession } from '@/lib/auth';
import {
    addFoodAction,
    addMealAction,
    deleteFoodAction,
    deleteMealAction,
} from '../diet.actions';

describe('Diet Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addFoodAction', () => {
        it('should return 500 when user is not authenticated', async () => {
            (getSession as Mock).mockResolvedValue(null);

            const result = await addFoodAction({
                name: 'Chicken',
                calories: 165,
            } as any);

            expect(result.success).toBe(false);
            expect(result.status).toBe(500);
        });

        it('should return 400 for invalid input (name too short)', async () => {
            (getSession as Mock).mockResolvedValue({ id: '1' });

            const result = await addFoodAction({
                name: 'A',
                calories: 165,
            } as any);

            expect(result.success).toBe(false);
            expect(result.status).toBe(400);
            if (!result.success && result.errors) {
                console.log('Validation errors:', result.errors);
            }
        });

        it('should return 201 on successful food creation', async () => {
            (getSession as Mock).mockResolvedValue({ id: '1' });

            const result = await addFoodAction({
                name: 'Chicken Breast',
                calories: 165,
                protein: 31,
            } as any);

            expect(result.success).toBe(true);
            expect(result.status).toBe(201);
            expect(result.message).toBe('Food added successfully');
        });
    });

    describe('addMealAction', () => {
        it('should return 400 for empty items array', async () => {
            (getSession as Mock).mockResolvedValue({ id: '1' });

            const result = await addMealAction({
                mealType: 'BREAKFAST',
                items: [],
            });

            expect(result.success).toBe(false);
            expect(result.status).toBe(400);
            if (!result.success && result.errors) {
                console.log('Validation errors:', result.errors);
            }
        });

        it('should return 200 on successful meal addition', async () => {
            (getSession as Mock).mockResolvedValue({ id: '1' });

            const result = await addMealAction({
                mealType: 'BREAKFAST',
                items: [{ foodId: 1, portion: 1 }],
            });

            expect(result.success).toBe(true);
            expect(result.status).toBe(200);
            expect(result.message).toBe('Meal logged successfully');
        });
    });

    describe('deleteFoodAction', () => {
        it('should return 200 on successful food deletion', async () => {
            (getSession as Mock).mockResolvedValue({ id: '1' });

            const result = await deleteFoodAction({ id: 1 });

            expect(result.success).toBe(true);
            expect(result.status).toBe(200);
            expect(result.message).toBe('Food deleted successfully');
        });
    });

    describe('deleteMealAction', () => {
        it('should return 200 on successful meal deletion', async () => {
            (getSession as Mock).mockResolvedValue({ id: '1' });

            const result = await deleteMealAction({ mealId: 1 });

            expect(result.success).toBe(true);
            expect(result.status).toBe(200);
            expect(result.message).toBe('Meal deleted successfully');
        });
    });
});
