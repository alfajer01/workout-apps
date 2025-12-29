import { describe, it, expect } from 'vitest';
import { updateProfileSchema } from '../update-profile-schema';

describe('updateProfileSchema', () => {
    const validProfile = {
        name: 'John Doe',
        age: 25,
        gender: 'MALE',
        bodyWeight: 70,
        height: 175,
        fitnessGoal: 'MAINTAIN_WEIGHT',
        activityLevel: 'ACTIVE',
    };

    describe('valid inputs', () => {
        it('should accept valid profile for MAINTAIN_WEIGHT', () => {
            const result = updateProfileSchema.safeParse(validProfile);
            expect(result.success).toBe(true);
        });

        it('should accept LOSE_WEIGHT with lower targetWeight', () => {
            const result = updateProfileSchema.safeParse({
                ...validProfile,
                fitnessGoal: 'LOSE_WEIGHT',
                targetWeight: 65,
            });
            expect(result.success).toBe(true);
        });

        it('should accept GAIN_WEIGHT with higher targetWeight', () => {
            const result = updateProfileSchema.safeParse({
                ...validProfile,
                fitnessGoal: 'GAIN_WEIGHT',
                targetWeight: 80,
            });
            expect(result.success).toBe(true);
        });
    });

    describe('superRefine validation', () => {
        it('should require targetWeight for LOSE_WEIGHT goal', () => {
            const result = updateProfileSchema.safeParse({
                ...validProfile,
                fitnessGoal: 'LOSE_WEIGHT',
            });
            expect(result.success).toBe(false);
        });

        it('should require targetWeight for GAIN_WEIGHT goal', () => {
            const result = updateProfileSchema.safeParse({
                ...validProfile,
                fitnessGoal: 'GAIN_WEIGHT',
            });
            expect(result.success).toBe(false);
        });

        it('should reject LOSE_WEIGHT with targetWeight >= bodyWeight', () => {
            const result = updateProfileSchema.safeParse({
                ...validProfile,
                fitnessGoal: 'LOSE_WEIGHT',
                targetWeight: 75,
            });
            expect(result.success).toBe(false);
        });

        it('should reject GAIN_WEIGHT with targetWeight <= bodyWeight', () => {
            const result = updateProfileSchema.safeParse({
                ...validProfile,
                fitnessGoal: 'GAIN_WEIGHT',
                targetWeight: 65,
            });
            expect(result.success).toBe(false);
        });
    });

    describe('enum validation', () => {
        it('should accept valid gender values', () => {
            ['MALE', 'FEMALE'].forEach(gender => {
                const result = updateProfileSchema.safeParse({ ...validProfile, gender });
                expect(result.success).toBe(true);
            });
        });

        it('should accept valid activityLevel values', () => {
            const levels = ['NOT_VERY_ACTIVE', 'LIGHTLY_ACTIVE', 'ACTIVE', 'VERY_ACTIVE'];
            levels.forEach(level => {
                const result = updateProfileSchema.safeParse({ ...validProfile, activityLevel: level });
                expect(result.success).toBe(true);
            });
        });
    });
});
