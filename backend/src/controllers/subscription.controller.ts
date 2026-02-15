import { Request, Response, NextFunction } from 'express';
import * as subscriptionService from '../services/subscription.service';
import { NotFoundError } from '../middlewares/errors';

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = await subscriptionService.createSubscription(req.body);
        res.status(201).json({ status: 'success', data: subscription });
    } catch (error) {
        next(error);
    }
};

export const getAllSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subscriptions, total } = await subscriptionService.getAllSubscriptions(req.query);
        res.status(200).json({ status: 'success', total, data: subscriptions });
    } catch (error) {
        next(error);
    }
};

export const getSubscriptionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = await subscriptionService.getSubscriptionById(req.params.id as string);
        if (!subscription) throw new NotFoundError('Subscription not found');
        res.status(200).json({ status: 'success', data: subscription });
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = await subscriptionService.updateSubscription(req.params.id as string, req.body);
        if (!subscription) throw new NotFoundError('Subscription not found');
        res.status(200).json({ status: 'success', data: subscription });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = await subscriptionService.deleteSubscription(req.params.id as string);
        if (!subscription) throw new NotFoundError('Subscription not found');
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};
