import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['admin', 'user']).optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const userSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').optional(),
        email: z.string().email('Invalid email').optional(),
        role: z.enum(['admin', 'user']).optional(),
    }),
});

export const planSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Plan name is required'),
        price: z.number().positive('Price must be positive'),
        duration: z.number().int().positive('Duration must be a positive integer'),
    }),
});

export const subscriptionSchema = z.object({
    body: z.object({
        user: z.string().min(1, 'User ID is required'),
        plan: z.string().min(1, 'Plan ID is required'),
        status: z.enum(['active', 'cancelled', 'expired']).optional(),
        startDate: z.string().optional(),
    }),
});
