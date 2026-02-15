import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
    user: Types.ObjectId;
    plan: Types.ObjectId;
    status: 'active' | 'cancelled' | 'expired';
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired'],
            default: 'active',
        },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
