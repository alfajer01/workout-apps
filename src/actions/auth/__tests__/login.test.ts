import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { login } from '../login';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
        },
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        compare: vi.fn(),
    },
}));

vi.mock('next/headers', () => ({
    cookies: vi.fn(() => ({
        set: vi.fn(),
        get: vi.fn(),
    })),
}));

vi.mock('jose', () => {
    return {
        SignJWT: class {
            setProtectedHeader() { return this; }
            setExpirationTime() { return this; }
            async sign() { return 'mock-jwt-token'; }
        },
    };
});

// Helper to create FormData
function createFormData(data: Record<string, string>): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });
    return formData;
}

describe('login action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('validation errors', () => {
        it('should return error for username less than 3 characters', async () => {
            const formData = createFormData({
                username: 'ab',
                password: 'password123',
            });

            const result = await login(formData);

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        });

        it('should return error for password less than 6 characters', async () => {
            const formData = createFormData({
                username: 'validuser',
                password: '12345',
            });

            const result = await login(formData);

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        });
    });

    describe('user not found', () => {
        it('should return 404 when username does not exist', async () => {
            (prisma.user.findUnique as Mock).mockResolvedValue(null);

            const formData = createFormData({
                username: 'nonexistent',
                password: 'password123',
            });

            const result = await login(formData);

            expect(result.success).toBe(false);
            expect(result.status).toBe(404);
            expect(result.message).toBe('Username not found.');
        });
    });

    describe('invalid password', () => {
        it('should return 401 when password is incorrect', async () => {
            (prisma.user.findUnique as Mock).mockResolvedValue({
                id: '1',
                username: 'testuser',
                password: 'hashed_password',
            });
            (bcrypt.compare as Mock).mockResolvedValue(false);

            const formData = createFormData({
                username: 'testuser',
                password: 'wrongpassword',
            });

            const result = await login(formData);

            expect(result.success).toBe(false);
            expect(result.status).toBe(401);
            expect(result.message).toBe('Incorrect password.');
        });
    });

    describe('successful login', () => {
        it('should return success when credentials are valid', async () => {
            (prisma.user.findUnique as Mock).mockResolvedValue({
                id: '1',
                username: 'testuser',
                name: 'Test User',
                password: 'hashed_password',
            });
            (bcrypt.compare as Mock).mockResolvedValue(true);

            const formData = createFormData({
                username: 'testuser',
                password: 'correctpassword',
            });

            const result = await login(formData);

            expect(result.success).toBe(true);
            expect(result.status).toBe(200);
            expect(result.message).toBe('Login successful!');
        });
    });
});
