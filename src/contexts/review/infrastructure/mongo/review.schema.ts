import { Schema, model, Document } from 'mongoose';
import { User } from '../../../user/domain/entities/user.entity';
import { Pastry } from '../../../pastry/domain/entities/pastry.entity';

export interface ReviewDoc extends Document {
    rating: number;
    text: string;
    userId: string;
    user: User;
    confectionerId: string;
    confectioner: User;
    pastryId: string;
    pastry: Pastry;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<ReviewDoc>({
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    pastryId: { type: String, required: true, ref: 'Pastry' },
    confectionerId: { type: String, required: true, ref: 'User' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ReviewSchema.index({ confectionerId: 1 });

ReviewSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

ReviewSchema.virtual('pastry', {
    ref: 'Pastry',
    localField: 'pastryId',
    foreignField: '_id',
    justOne: true
});

ReviewSchema.virtual('confectioner', {
    ref: 'User',
    localField: 'confectionerId',
    foreignField: '_id',
    justOne: true
});

export const ReviewModel = model<ReviewDoc>('Review', ReviewSchema);