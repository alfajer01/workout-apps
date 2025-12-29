import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { registerUser } from '../register';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
    default: {
        user: {
            findFirst: vi.fn(),
            create: vi.fn(),
        },
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn().mockResolvedValue('hashed_password'),
    },
}));

// Helper to create FormData
function createFormData(data: Record<string, string | number>): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
    });
    return formData;
}

const validUserData = {
    name: 'John Doe',
    age: 25,
    username: 'johndoe',
    password: 'password123',
    bodyWeight: 70,
    height: 175,
    fitnessGoal: 'MAINTAIN',
};

describe('registerUser action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('validation errors', () => {
        it('should return error for name less than 2 characters', async () => {
            const formData = createFormData({ ...validUserData, name: 'J' });

            const result = await registerUser(formData);

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        });

        it('should return error for age below 13', async () => {
            const formData = createFormData({ ...validUserData, age: 12 });

            const result = await registerUser(formData);

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        });

        it('should return error for bodyWeight below 30', async () => {
            const formData = createFormData({ ...validUserData, bodyWeight: 29 });

            const result = await registerUser(formData);

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        });

        it('should return error for height below 100', async () => {
            const formData = createFormData({ ...validUserData, height: 99 });

            const result = await registerUser(formData);

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        });
    });

    describe('username already exists', () => {
        it('should return 409 when username is taken', async () => {
            (prisma.user.findFirst as Mock).mockResolvedValue({
                id: '1',
                username: 'johndoe',
            });

            const formData = createFormData(validUserData);

            const result = await registerUser(formData);

            expect(result.success).toBe(false);
            expect(result.status).toBe(409);
            expect(result.message).toBe('Username already exists');
        });
    });

    describe('successful registration', () => {
        it('should return success when registration is valid', async () => {
            (prisma.user.findFirst as Mock).mockResolvedValue(null);
            (prisma.user.create as Mock).mockResolvedValue({
                id: '1',
                ...validUserData,
            });

            const formData = createFormData(validUserData);

            const result = await registerUser(formData);

            expect(result.success).toBe(true);
            expect(result.status).toBe(201);
            expect(result.message).toBe('Registration successful');
        });

        it('should hash password before storing', async () => {
            (prisma.user.findFirst as Mock).mockResolvedValue(null);
            (prisma.user.create as Mock).mockResolvedValue({ id: '1' });

            const formData = createFormData(validUserData);

            await registerUser(formData);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        });

        it('should call prisma.user.create with correct data', async () => {
            (prisma.user.findFirst as Mock).mockResolvedValue(null);
            (prisma.user.create as Mock).mockResolvedValue({ id: '1' });

            const formData = createFormData(validUserData);

            await registerUser(formData);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    name: 'John Doe',
                    age: 25,
                    username: 'johndoe',
                    password: 'hashed_password',
                    bodyWeight: 70,
                    height: 175,
                    fitnessGoal: 'MAINTAIN',
                }),
            });
        });
    });

    describe('error handling', () => {
        it('should return 500 on unexpected error', async () => {
            (prisma.user.findFirst as Mock).mockRejectedValue(new Error('DB error'));

            const formData = createFormData(validUserData);

            const result = await registerUser(formData);

            expect(result.success).toBe(false);
            expect(result.status).toBe(500);
            expect(result.message).toBe('Internal server error');
        });
    });
});
