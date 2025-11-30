'use client';

import { generateMotivationAction } from '@/actions/dashboard/generate-motivation';
import { useEffect, useState } from 'react';

interface MotivationSectionProps {
    userId: number;
    userName: string;
    workoutsToday: number;
    streak: number;
    caloriesBurned: number;
}

export default function MotivationSection({
    userId,
    userName,
    workoutsToday,
    streak,
    caloriesBurned,
}: MotivationSectionProps) {
    const [motivation, setMotivation] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMotivation = async () => {
            const today = new Date().toISOString().split('T')[0];
            const storageKey = `motivation_${userId}_${today}`;
            const cached = localStorage.getItem(storageKey);

            // Cleanup old cache
            if (typeof window !== 'undefined') {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(`motivation_${userId}_`) && key !== storageKey) {
                        localStorage.removeItem(key);
                    }
                }
            }

            if (cached) {
                setMotivation(cached);
                setLoading(false);
                return;
            }

            try {
                const text = await generateMotivationAction({
                    name: userName,
                    workoutsToday,
                    streak,
                    caloriesBurned,
                });
                setMotivation(text);
                localStorage.setItem(storageKey, text);
            } catch (error) {
                console.error('Error fetching motivation:', error);
                setMotivation("Ready to crush your goals today? You're doing great!");
            } finally {
                setLoading(false);
            }
        };

        fetchMotivation();
    }, [userId, userName, workoutsToday, streak, caloriesBurned]);

    return (
        <div className='text-indigo-100 text-lg mb-8 min-h-[28px]'>
            {loading ? (
                <div className='h-7 w-3/4 bg-indigo-200/20 rounded animate-pulse' />
            ) : (
                <p>{motivation}</p>
            )}
        </div>
    );
}
