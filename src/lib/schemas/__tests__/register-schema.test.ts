import { describe, it, expect } from 'vitest';
import { registerSchema } from '../register-schema';

describe('registerSchema', () => {
    const validData = {
        name: 'John Doe',
        age: 25,
        username: 'johndoe',
        password: 'password123',
        bodyWeight: 70,
        height: 175,
        fitnessGoal: 'MAINTAIN',
    };

    describe('valid inputs', () => {
        it('should accept valid registration data', () => {
            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should accept minimum valid values', () => {
            const result = registerSchema.safeParse({
                name: 'Jo',
                age: 13,
                username: 'abc',
                password: '123456',
                bodyWeight: 30,
                height: 100,
                fitnessGoal: 'LOSE_WEIGHT',
            });
            expect(result.success).toBe(true);
        });

        it('should accept maximum valid values', () => {
            const result = registerSchema.safeParse({
                name: 'A'.repeat(50),
                age: 100,
                username: 'A'.repeat(20),
                password: 'password',
                bodyWeight: 299,
                height: 249,
                fitnessGoal: 'GAIN_WEIGHT',
            });
            expect(result.success).toBe(true);
        });
    });

    describe('name validation', () => {
        it('should reject name shorter than 2 characters', () => {
            const result = registerSchema.safeParse({ ...validData, name: 'J' });
            expect(result.success).toBe(false);
        });

        it('should reject name longer than 50 characters', () => {
            const result = registerSchema.safeParse({ ...validData, name: 'A'.repeat(51) });
            expect(result.success).toBe(false);
        });
    });

    describe('age validation', () => {
        it('should reject age below 13', () => {
            const result = registerSchema.safeParse({ ...validData, age: 12 });
            expect(result.success).toBe(false);
        });

        it('should reject age above 100', () => {
            const result = registerSchema.safeParse({ ...validData, age: 101 });
            expect(result.success).toBe(false);
        });

        it('should coerce string age to number', () => {
            const result = registerSchema.safeParse({ ...validData, age: '25' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.age).toBe(25);
            }
        });
    });

    describe('username validation', () => {
        it('should reject username shorter than 3 characters', () => {
            const result = registerSchema.safeParse({ ...validData, username: 'ab' });
            expect(result.success).toBe(false);
        });

        it('should reject username longer than 20 characters', () => {
            const result = registerSchema.safeParse({ ...validData, username: 'A'.repeat(21) });
            expect(result.success).toBe(false);
        });
    });

    describe('bodyWeight validation', () => {
        it('should reject bodyWeight below 30', () => {
            const result = registerSchema.safeParse({ ...validData, bodyWeight: 29 });
            expect(result.success).toBe(false);
        });

        it('should reject bodyWeight above 300', () => {
            const result = registerSchema.safeParse({ ...validData, bodyWeight: 301 });
            expect(result.success).toBe(false);
        });

        it('should coerce string bodyWeight to number', () => {
            const result = registerSchema.safeParse({ ...validData, bodyWeight: '70' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.bodyWeight).toBe(70);
            }
        });
    });

    describe('height validation', () => {
        it('should reject height below 100', () => {
            const result = registerSchema.safeParse({ ...validData, height: 99 });
            expect(result.success).toBe(false);
        });

        it('should reject height above 250', () => {
            const result = registerSchema.safeParse({ ...validData, height: 251 });
            expect(result.success).toBe(false);
        });
    });

    describe('fitnessGoal validation', () => {
        it('should reject empty fitnessGoal', () => {
            const result = registerSchema.safeParse({ ...validData, fitnessGoal: '' });
            expect(result.success).toBe(false);
        });
    });
});
