import { describe, it, expect } from 'vitest';
import { loginSchema } from '../login-schema';

describe('loginSchema', () => {
    describe('valid inputs', () => {
        it('should accept valid username and password', () => {
            const result = loginSchema.safeParse({
                username: 'john_doe',
                password: 'password123',
            });
            expect(result.success).toBe(true);
        });

        it('should accept minimum length credentials', () => {
            const result = loginSchema.safeParse({
                username: 'abc',
                password: '123456',
            });
            expect(result.success).toBe(true);
        });
    });

    describe('invalid inputs', () => {
        it('should reject username shorter than 3 characters', () => {
            const result = loginSchema.safeParse({
                username: 'ab',
                password: 'password123',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.username).toBeDefined();
            }
        });

        it('should reject password shorter than 6 characters', () => {
            const result = loginSchema.safeParse({
                username: 'john_doe',
                password: '12345',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.password).toBeDefined();
            }
        });

        it('should reject empty username', () => {
            const result = loginSchema.safeParse({
                username: '',
                password: 'password123',
            });
            if (!result.success) {
                console.log('Errors:', result.error.flatten().fieldErrors);
            }

            expect(result.success).toBe(false);
        });

        it('should reject empty password', () => {
            const result = loginSchema.safeParse({
                username: 'john_doe',
                password: '',
            });
            expect(result.success).toBe(false);
        });
    });
});
