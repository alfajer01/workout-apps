import { describe, it, expect } from 'vitest';
import { addFoodSchema, addMealSchema } from '../diet';

describe('addFoodSchema', () => {
    const validFood = {
        name: 'Chicken Breast',
        calories: 165,
    };

    describe('valid inputs', () => {
        it('should accept valid food', () => {
            const result = addFoodSchema.safeParse(validFood);
            expect(result.success).toBe(true);
        });

        it('should accept food with optional macros', () => {
            const result = addFoodSchema.safeParse({
                ...validFood,
                protein: 31,
                fat: 3.6,
                carbs: 0,
            });
            expect(result.success).toBe(true);
        });

        it('should default macros to 0', () => {
            const result = addFoodSchema.safeParse(validFood);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.protein).toBe(0);
                expect(result.data.fat).toBe(0);
                expect(result.data.carbs).toBe(0);
            }
        });
    });

    describe('invalid inputs', () => {
        it('should reject name shorter than 2 characters', () => {
            const result = addFoodSchema.safeParse({ ...validFood, name: 'A' });
            expect(result.success).toBe(false);
        });

        it('should reject non-positive calories', () => {
            const result = addFoodSchema.safeParse({ ...validFood, calories: 0 });
            expect(result.success).toBe(false);
        });

        it('should reject negative calories', () => {
            const result = addFoodSchema.safeParse({ ...validFood, calories: -100 });
            expect(result.success).toBe(false);
        });
    });
});

describe('addMealSchema', () => {
    const validMeal = {
        mealType: 'BREAKFAST',
        items: [{ foodId: 1, portion: 1 }],
    };

    describe('valid inputs', () => {
        it('should accept valid meal', () => {
            const result = addMealSchema.safeParse(validMeal);
            expect(result.success).toBe(true);
        });

        it('should accept all meal types', () => {
            const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
            mealTypes.forEach(type => {
                const result = addMealSchema.safeParse({ ...validMeal, mealType: type });
                expect(result.success).toBe(true);
            });
        });

        it('should accept multiple items', () => {
            const result = addMealSchema.safeParse({
                ...validMeal,
                items: [
                    { foodId: 1, portion: 1 },
                    { foodId: 2, portion: 0.5 },
                ],
            });
            expect(result.success).toBe(true);
        });
    });

    describe('invalid inputs', () => {
        it('should reject invalid meal type', () => {
            const result = addMealSchema.safeParse({ ...validMeal, mealType: 'BRUNCH' });
            expect(result.success).toBe(false);
        });

        it('should reject empty items array', () => {
            const result = addMealSchema.safeParse({ ...validMeal, items: [] });
            expect(result.success).toBe(false);
        });

        it('should reject non-positive portion', () => {
            const result = addMealSchema.safeParse({
                ...validMeal,
                items: [{ foodId: 1, portion: 0 }],
            });
            expect(result.success).toBe(false);
        });
    });
});
