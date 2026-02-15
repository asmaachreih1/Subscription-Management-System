import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { NotFoundError } from '../middlewares/errors';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { users, total } = await userService.getAllUsers(req.query);
        res.status(200).json({ status: 'success', total, data: users });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(req.params.id as string);
        if (!user) throw new NotFoundError('User not found');
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.updateUser(req.params.id as string, req.body);
        if (!user) throw new NotFoundError('User not found');
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.deleteUser(req.params.id as string);
        if (!user) throw new NotFoundError('User not found');
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};
