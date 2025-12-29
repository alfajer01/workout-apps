import { describe, it, expect } from 'vitest';
import {
    resolveCalorieTarget,
    determineCalorieStatus,
    getStatusLabel,
    getStatusTone,
} from '../diet-insights';
import { DailyLog } from '@prisma/client';

// Helper to create mock DailyLog
function createMockDailyLog(overrides: Partial<DailyLog> = {}): DailyLog {
    return {
        id: 1,
        userId: 1,
        date: new Date(),
        caloriesIn: 0,
        caloriesOut: 0,
        netCalories: 0,
        dailyNeedCalories: null,
        goalCalorieTarget: null,
        manualCalorieTarget: null,
        currentWeight: null,
        targetWeight: null,
        lastRecalculatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

describe('resolveCalorieTarget', () => {
    it('should prioritize manualCalorieTarget first', () => {
        const log = createMockDailyLog({
            manualCalorieTarget: 1800,
            goalCalorieTarget: 2000,
            dailyNeedCalories: 2200,
        });

        expect(resolveCalorieTarget(log)).toBe(1800);
    });

    it('should use goalCalorieTarget if manual is null', () => {
        const log = createMockDailyLog({
            manualCalorieTarget: null,
            goalCalorieTarget: 2000,
            dailyNeedCalories: 2200,
        });

        expect(resolveCalorieTarget(log)).toBe(2000);
    });

    it('should use dailyNeedCalories if both manual and goal are null', () => {
        const log = createMockDailyLog({
            manualCalorieTarget: null,
            goalCalorieTarget: null,
            dailyNeedCalories: 2200,
        });

        expect(resolveCalorieTarget(log)).toBe(2200);
    });

    it('should return null if all targets are null', () => {
        const log = createMockDailyLog({
            manualCalorieTarget: null,
            goalCalorieTarget: null,
            dailyNeedCalories: null,
        });

        expect(resolveCalorieTarget(log)).toBeNull();
    });
});

describe('determineCalorieStatus', () => {
    it('should return NO_TARGET when no target exists', () => {
        const log = createMockDailyLog({
            netCalories: 1500,
            manualCalorieTarget: null,
            goalCalorieTarget: null,
            dailyNeedCalories: null,
        });

        expect(determineCalorieStatus(log)).toBe('NO_TARGET');
    });

    it('should return DEFICIT when netCalories < target', () => {
        const log = createMockDailyLog({
            netCalories: 1500,
            manualCalorieTarget: 2000,
        });

        expect(determineCalorieStatus(log)).toBe('DEFICIT');
    });

    it('should return SURPLUS when netCalories > target', () => {
        const log = createMockDailyLog({
            netCalories: 2500,
            manualCalorieTarget: 2000,
        });

        expect(determineCalorieStatus(log)).toBe('SURPLUS');
    });

    it('should return ON_TARGET when netCalories equals target', () => {
        const log = createMockDailyLog({
            netCalories: 2000,
            manualCalorieTarget: 2000,
        });

        expect(determineCalorieStatus(log)).toBe('ON_TARGET');
    });

    it('should return ON_TARGET for very small differences (<1)', () => {
        const log = createMockDailyLog({
            netCalories: 2000.5,
            manualCalorieTarget: 2000,
        });

        expect(determineCalorieStatus(log)).toBe('ON_TARGET');
    });
});

describe('getStatusLabel', () => {
    it('should return correct labels for each status', () => {
        expect(getStatusLabel('DEFICIT')).toBe('Deficit');
        expect(getStatusLabel('SURPLUS')).toBe('Surplus');
        expect(getStatusLabel('ON_TARGET')).toBe('On Target');
        expect(getStatusLabel('NO_TARGET')).toBe('No Target');
    });
});

describe('getStatusTone', () => {
    it('should return green tone for DEFICIT', () => {
        expect(getStatusTone('DEFICIT')).toContain('green');
    });

    it('should return red tone for SURPLUS', () => {
        expect(getStatusTone('SURPLUS')).toContain('red');
    });

    it('should return amber tone for ON_TARGET', () => {
        expect(getStatusTone('ON_TARGET')).toContain('amber');
    });

    it('should return neutral tone for NO_TARGET', () => {
        expect(getStatusTone('NO_TARGET')).toContain('neutral');
    });
});
