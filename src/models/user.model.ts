import mongoose, { Schema, Document } from "mongoose";

// 1. Define an interface for TypeScript
export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create Schema
const userSchema: Schema<IUser> = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    address: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // automatically creates createdAt and updatedAt
);

// 3. Export model
export default mongoose.model<IUser>("User", userSchema);
