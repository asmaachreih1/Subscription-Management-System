import { Schema, model, Document } from 'mongoose';

export interface IPlan extends Document {
    name: string;
    price: number;
    duration: number; // in months
    createdAt: Date;
    updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        duration: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

export const Plan = model<IPlan>('Plan', planSchema);
