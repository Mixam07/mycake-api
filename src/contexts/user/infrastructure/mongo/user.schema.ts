import { Schema, model, Document } from 'mongoose';
import { ISellerProfile } from '../../domain/entities/user.type';

export interface UserDoc extends Document {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    sellerProfile?: ISellerProfile;
    pastryIds: string[];
    reviewIds: string[];
    createdAt: Date;
    updatedAt: Date;
}

const sellerProfileSchema = new Schema<ISellerProfile>({
    description: { type: String },
    address: { type: String },
    phone: { type: String },
    deliveryInfo: { type: String },
    paymentInfo: { type: String },
    socialMedia: {
        instagram: { type: String },
        facebook: { type: String },
        youtube: { type: String },
    }
}, { _id: false });

const UserSchema = new Schema<UserDoc>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['Buyer', 'Seller'] },
    avatarUrl: { type: String },
    sellerProfile: { type: sellerProfileSchema, required: false },
    pastryIds: [{ type: String, required: true, ref: 'Pastry', }],
    reviewIds: { type: [String], required: true, ref: 'Review' },
}, { timestamps: true });

export const UserModel = model<UserDoc>('User', UserSchema);