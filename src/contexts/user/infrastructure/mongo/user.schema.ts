import { Schema, model, Document } from 'mongoose';

export interface UserDoc extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    avatarUrl?: string;
    sellerProfile?: any;
}

const UserSchema = new Schema<UserDoc>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['Buyer', 'Seller'] },
    avatarUrl: { type: String },
    sellerProfile: { type: Object },
}, { timestamps: true });

export const UserModel = model<UserDoc>('User', UserSchema);