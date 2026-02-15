import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { BadRequestError } from '../middlewares/errors';

const signToken = (id: string) => {
    const options: SignOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN as any,
    };
    return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

export const register = async (userData: Partial<IUser>) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new BadRequestError('User already exists');

    const user = await User.create(userData);
    const token = signToken((user._id as any).toString());

    return { user, token };
};

export const login = async (credentials: { email: string; password?: string }) => {
    const { email, password } = credentials;

    if (!email || !password) throw new BadRequestError('Please provide email and password');

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new BadRequestError('Incorrect email or password');
    }

    const token = signToken((user._id as any).toString());
    return { user, token };
};
