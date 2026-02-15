import { Plan, IPlan } from '../models/plan.model';
import { QueryBuilder } from './queryBuilder';

export const createPlan = async (planData: Partial<IPlan>) => {
    return await Plan.create(planData);
};

export const getAllPlans = async (query: Record<string, any>) => {
    const plansQuery = new QueryBuilder(Plan.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .limitFields();

    const plans = await plansQuery.modelQuery;
    const total = await Plan.countDocuments(plansQuery.modelQuery.getFilter());

    return { plans, total };
};

export const getPlanById = async (id: string) => {
    return await Plan.findById(id);
};

export const updatePlan = async (id: string, updateData: Partial<IPlan>) => {
    return await Plan.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deletePlan = async (id: string) => {
    return await Plan.findByIdAndDelete(id);
};
