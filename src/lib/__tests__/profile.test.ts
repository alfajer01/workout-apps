import { describe, it, expect } from 'vitest';
import { getProfileStatus, getFriendlyProfileFieldName, ProfileFields } from '../profile';
import { FitnessGoal, Gender, ActivityLevel } from '@prisma/client';

describe('getProfileStatus', () => {
    it('should return complete for fully filled profile', () => {
        const user: ProfileFields = {
            age: 25,
            gender: 'MALE' as Gender,
            bodyWeight: 70,
            height: 175,
            fitnessGoal: 'MAINTAIN_WEIGHT' as FitnessGoal,
            activityLevel: 'ACTIVE' as ActivityLevel,
            targetWeight: null,
        };

        const result = getProfileStatus(user);
        expect(result.isComplete).toBe(true);
        expect(result.missingFields).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
        const user = {
            age: null,
            gender: null,
            bodyWeight: null,
            height: null,
            fitnessGoal: null,
            activityLevel: null,
            targetWeight: null,
        } as unknown as ProfileFields;

        const result = getProfileStatus(user);
        expect(result.isComplete).toBe(false);
        expect(result.missingFields).toContain('age');
        expect(result.missingFields).toContain('gender');
        expect(result.missingFields).toContain('bodyWeight');
        expect(result.missingFields).toContain('height');
        expect(result.missingFields).toContain('fitnessGoal');
        expect(result.missingFields).toContain('activityLevel');
    });

    it('should require targetWeight for LOSE_WEIGHT goal', () => {
        const user: ProfileFields = {
            age: 25,
            gender: 'MALE' as Gender,
            bodyWeight: 80,
            height: 175,
            fitnessGoal: 'LOSE_WEIGHT' as FitnessGoal,
            activityLevel: 'ACTIVE' as ActivityLevel,
            targetWeight: null,
        };

        const result = getProfileStatus(user);
        expect(result.isComplete).toBe(false);
        expect(result.missingFields).toContain('targetWeight');
    });

    it('should require targetWeight for GAIN_WEIGHT goal', () => {
        const user: ProfileFields = {
            age: 25,
            gender: 'MALE' as Gender,
            bodyWeight: 60,
            height: 175,
            fitnessGoal: 'GAIN_WEIGHT' as FitnessGoal,
            activityLevel: 'ACTIVE' as ActivityLevel,
            targetWeight: null,
        };

        const result = getProfileStatus(user);
        expect(result.isComplete).toBe(false);
        expect(result.missingFields).toContain('targetWeight');
    });

    it('should not require targetWeight for MAINTAIN_WEIGHT goal', () => {
        const user: ProfileFields = {
            age: 25,
            gender: 'MALE' as Gender,
            bodyWeight: 70,
            height: 175,
            fitnessGoal: 'MAINTAIN_WEIGHT' as FitnessGoal,
            activityLevel: 'ACTIVE' as ActivityLevel,
            targetWeight: null,
        };

        const result = getProfileStatus(user);
        expect(result.isComplete).toBe(true);
        expect(result.missingFields).not.toContain('targetWeight');
    });

    it('should be complete with targetWeight for weight change goals', () => {
        const user: ProfileFields = {
            age: 25,
            gender: 'FEMALE' as Gender,
            bodyWeight: 65,
            height: 165,
            fitnessGoal: 'LOSE_WEIGHT' as FitnessGoal,
            activityLevel: 'LIGHTLY_ACTIVE' as ActivityLevel,
            targetWeight: 58,
        };

        const result = getProfileStatus(user);
        expect(result.isComplete).toBe(true);
        expect(result.missingFields).toHaveLength(0);
    });
});

describe('getFriendlyProfileFieldName', () => {
    it('should return friendly name for age', () => {
        expect(getFriendlyProfileFieldName('age')).toBe('Age');
    });

    it('should return friendly name for bodyWeight', () => {
        expect(getFriendlyProfileFieldName('bodyWeight')).toBe('Body weight');
    });

    it('should return friendly name for fitnessGoal', () => {
        expect(getFriendlyProfileFieldName('fitnessGoal')).toBe('Fitness goal');
    });

    it('should return friendly name for activityLevel', () => {
        expect(getFriendlyProfileFieldName('activityLevel')).toBe('Activity level');
    });

    it('should return friendly name for targetWeight', () => {
        expect(getFriendlyProfileFieldName('targetWeight')).toBe('Target weight');
    });
});
