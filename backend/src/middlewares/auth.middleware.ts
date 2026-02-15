import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { AppError } from './errors';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new AppError('You are not logged in! Please log in to get access.', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            throw new AppError('The user belonging to this token no longer exists.', 401);
        }

        req.user = currentUser;
        next();
    } catch (error) {
        next(error);
    }
};

export const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AppError('You do not have permission to perform this action', 403);
        }
        next();
    };
};
