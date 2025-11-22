import { Schema, model, Document } from 'mongoose';

export interface AuthDoc extends Document {
    _id: string;
    email: string;
    passwordHash: string;
}

const AuthSchema = new Schema<AuthDoc>({
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
}, { 
    timestamps: true,
    collection: 'auth_credentials'
});

export const AuthModel = model<AuthDoc>('Auth', AuthSchema);