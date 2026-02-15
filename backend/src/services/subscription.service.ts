import { Subscription, ISubscription } from '../models/subscription.model';
import { Plan } from '../models/plan.model';
import { User } from '../models/user.model';
import { QueryBuilder } from './queryBuilder';
import { NotFoundError } from '../middlewares/errors';

export const createSubscription = async (subscriptionData: any) => {
    const plan = await Plan.findById(subscriptionData.plan);
    if (!plan) throw new NotFoundError('Plan not found');

    // Calculate end date based on plan duration
    const startDate = subscriptionData.startDate ? new Date(subscriptionData.startDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + plan.duration);

    const newSubscription = await Subscription.create({
        ...subscriptionData,
        endDate,
    });

    return newSubscription;
};

export const getAllSubscriptions = async (query: Record<string, any>) => {
    let baseQuery = Subscription.find().populate('user').populate('plan');

    if (query.search) {
        const searchTerm = query.search as string;
        const matchingUsers = await User.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        }).select('_id');
        const userIds = matchingUsers.map(u => u._id);
        baseQuery = baseQuery.find({ user: { $in: userIds } });
    }

    const subscriptionQuery = new QueryBuilder(baseQuery, query)
        .filter()
        .sort()
        .paginate()
        .limitFields();

    const subscriptions = await subscriptionQuery.modelQuery;
    const total = await Subscription.countDocuments(subscriptionQuery.modelQuery.getFilter());

    return { subscriptions, total };
};

export const getSubscriptionById = async (id: string) => {
    return await Subscription.findById(id).populate('user').populate('plan');
};

export const updateSubscription = async (id: string, updateData: any) => {
    if (updateData.plan || updateData.startDate) {
        const sub = await Subscription.findById(id);
        if (!sub) throw new NotFoundError('Subscription not found');

        const planId = updateData.plan || sub.plan;
        const plan = await Plan.findById(planId);
        if (!plan) throw new NotFoundError('Plan not found');

        const startDate = updateData.startDate ? new Date(updateData.startDate) : sub.startDate;
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.duration);
        updateData.endDate = endDate;
    }
    return await Subscription.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteSubscription = async (id: string) => {
    return await Subscription.findByIdAndDelete(id);
};
