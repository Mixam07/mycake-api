import { Schema, model, Document } from 'mongoose';

export type UserRole = 'Buyer' | 'Seller';

export interface IUser {
    id: string; 
    name: string;
    email: string;
    role: UserRole;
    sellerProfile?: ISellerProfile;
}

export interface IUserCreateData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface ISellerProfile {
    description: string;
    address: string;
    phone: string;
    deliveryInfo: string;
    paymentInfo: string;
    socialMedia?: {
        instagram?: string;
        facebook?: string;
        youtube?: string;
    };
}

export type IUpdateSellerProfileData = Partial<ISellerProfile>;

interface IUserDocument extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    sellerProfile?: ISellerProfile;
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

const userSchema = new Schema<IUserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['Buyer', 'Seller'] },
    sellerProfile: { type: sellerProfileSchema, required: false },
}, {
    timestamps: true,
    
    toJSON: {
        transform: (doc: any, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.passwordHash;
            return ret;
        }
    },
    toObject: {
        transform: (doc: any, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.passwordHash;
            return ret;
        }
    }
});

export const UserModel = model<IUserDocument>('User', userSchema);