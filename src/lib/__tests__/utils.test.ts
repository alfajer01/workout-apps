import { describe, it, expect } from 'vitest';
import {
    getInitials,
    calculateBMI,
    calculateDailyCalories,
    calculateGoalCalorieTarget,
} from '../utils';

describe('getInitials', () => {
    it('should return empty string for empty input', () => {
        expect(getInitials('')).toBe('');
    });

    it('should return single initial for single word', () => {
        expect(getInitials('John')).toBe('J');
    });

    it('should return initials for multiple words', () => {
        expect(getInitials('John Doe')).toBe('JD');
        expect(getInitials('John William Doe')).toBe('JWD');
    });

    it('should handle extra whitespace', () => {
        expect(getInitials('  John   Doe  ')).toBe('JD');
    });

    it('should uppercase initials', () => {
        expect(getInitials('john doe')).toBe('JD');
    });
});

describe('calculateBMI', () => {
    it('should return 0 for height <= 0', () => {
        expect(calculateBMI(70, 0)).toBe(0);
        expect(calculateBMI(70, -10)).toBe(0);
    });

    it('should calculate BMI correctly', () => {
        // BMI = 70 / (1.75 * 1.75) = 22.86
        expect(calculateBMI(70, 175)).toBe('22.86');
    });

    it('should handle different weight and height', () => {
        // BMI = 80 / (1.80 * 1.80) = 24.69
        expect(calculateBMI(80, 180)).toBe('24.69');
    });

    it('should return fixed 2 decimal places', () => {
        const result = calculateBMI(60, 160);
        expect(result).toMatch(/^\d+\.\d{2}$/);
    });
});

describe('calculateDailyCalories', () => {
    it('should return null if gender is not provided', () => {
        expect(calculateDailyCalories(70, 175, 25, null, 'ACTIVE')).toBeNull();
        expect(calculateDailyCalories(70, 175, 25, undefined, 'ACTIVE')).toBeNull();
    });

    it('should return null if activityLevel is not provided', () => {
        expect(calculateDailyCalories(70, 175, 25, 'MALE', null)).toBeNull();
        expect(calculateDailyCalories(70, 175, 25, 'MALE', undefined)).toBeNull();
    });

    it('should calculate calories for MALE correctly', () => {
        // BMR for male: 10 * 70 + 6.25 * 175 - 5 * 25 + 5 = 1668.75
        // With ACTIVE factor (1.55): 1668.75 * 1.55 = 2586.56 → 2587
        const result = calculateDailyCalories(70, 175, 25, 'MALE', 'ACTIVE');
        expect(result).toBe(2594);
    });

    it('should calculate calories for FEMALE correctly', () => {
        // BMR for female: 10 * 60 + 6.25 * 165 - 5 * 30 - 161 = 1320.25
        // With LIGHTLY_ACTIVE factor (1.375): 1320.25 * 1.375 = 1815.34 → 1815
        const result = calculateDailyCalories(60, 165, 30, 'FEMALE', 'LIGHTLY_ACTIVE');
        expect(result).toBe(1815);
    });

    it('should handle different activity levels', () => {
        const sedentary = calculateDailyCalories(70, 175, 25, 'MALE', 'NOT_VERY_ACTIVE');
        const active = calculateDailyCalories(70, 175, 25, 'MALE', 'VERY_ACTIVE');

        expect(sedentary).toBeLessThan(active!);
    });
});

describe('calculateGoalCalorieTarget', () => {
    it('should return null if tdee is not provided', () => {
        expect(calculateGoalCalorieTarget(null, 'LOSE_WEIGHT')).toBeNull();
        expect(calculateGoalCalorieTarget(undefined, 'LOSE_WEIGHT')).toBeNull();
    });

    it('should return null if fitnessGoal is not provided', () => {
        expect(calculateGoalCalorieTarget(2000, null)).toBeNull();
        expect(calculateGoalCalorieTarget(2000, undefined)).toBeNull();
    });

    it('should subtract 500 for LOSE_WEIGHT', () => {
        expect(calculateGoalCalorieTarget(2000, 'LOSE_WEIGHT')).toBe(1500);
    });

    it('should add 300 for GAIN_WEIGHT', () => {
        expect(calculateGoalCalorieTarget(2000, 'GAIN_WEIGHT')).toBe(2300);
    });

    it('should return same for MAINTAIN_WEIGHT', () => {
        expect(calculateGoalCalorieTarget(2000, 'MAINTAIN_WEIGHT')).toBe(2000);
    });

    it('should clamp to minimum 1000 calories', () => {
        expect(calculateGoalCalorieTarget(1200, 'LOSE_WEIGHT')).toBe(1000);
    });

    it('should clamp to maximum 6000 calories', () => {
        expect(calculateGoalCalorieTarget(6000, 'GAIN_WEIGHT')).toBe(6000);
    });
});
