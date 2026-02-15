import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors';

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: err.message,
        });
    }

    // Mongoose duplicate key error
    if ((err as any).code === 11000) {
        return res.status(400).json({
            status: 'error',
            message: 'Duplicate field value entered',
        });
    }

    // Internal Server Error
    console.error('ERROR 💥', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
};
