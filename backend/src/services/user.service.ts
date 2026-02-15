import { User, IUser } from '../models/user.model';
import { QueryBuilder } from './queryBuilder';

export const createUser = async (userData: Partial<IUser>) => {
    return await User.create(userData);
};

export const getAllUsers = async (query: Record<string, any>) => {
    const usersQuery = new QueryBuilder(User.find(), query)
        .search(['name', 'email'])
        .filter()
        .sort()
        .paginate()
        .limitFields();

    const users = await usersQuery.modelQuery;
    const total = await User.countDocuments(usersQuery.modelQuery.getFilter());

    return { users, total };
};

export const getUserById = async (id: string) => {
    return await User.findById(id);
};

export const updateUser = async (id: string, updateData: Partial<IUser>) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
};
