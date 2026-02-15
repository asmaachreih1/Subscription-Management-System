import { Request, Response, NextFunction } from 'express';
import * as planService from '../services/plan.service';
import { NotFoundError } from '../middlewares/errors';

export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plan = await planService.createPlan(req.body);
        res.status(201).json({ status: 'success', data: plan });
    } catch (error) {
        next(error);
    }
};

export const getAllPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { plans, total } = await planService.getAllPlans(req.query);
        res.status(200).json({ status: 'success', total, data: plans });
    } catch (error) {
        next(error);
    }
};

export const getPlanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plan = await planService.getPlanById(req.params.id as string);
        if (!plan) throw new NotFoundError('Plan not found');
        res.status(200).json({ status: 'success', data: plan });
    } catch (error) {
        next(error);
    }
};

export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plan = await planService.updatePlan(req.params.id as string, req.body);
        if (!plan) throw new NotFoundError('Plan not found');
        res.status(200).json({ status: 'success', data: plan });
    } catch (error) {
        next(error);
    }
};

export const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plan = await planService.deletePlan(req.params.id as string);
        if (!plan) throw new NotFoundError('Plan not found');
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};
