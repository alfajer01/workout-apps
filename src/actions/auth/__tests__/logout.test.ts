import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { logout } from '../logout';

// Mock next/headers cookies
const mockCookiesSet = vi.fn();
vi.mock('next/headers', () => ({
    cookies: vi.fn(() => ({
        set: mockCookiesSet,
    })),
}));

describe('logout action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('successful logout', () => {
        it('should return success on successful logout', async () => {
            const result = await logout();

            expect(result.success).toBe(true);
            expect(result.status).toBe(200);
            expect(result.message).toBe('Logged out successfully.');
        });

        it('should clear the token cookie', async () => {
            await logout();

            expect(mockCookiesSet).toHaveBeenCalledWith('token', '', {
                httpOnly: true,
                secure: expect.any(Boolean),
                path: '/',
                maxAge: 0,
            });
        });
    });
});
