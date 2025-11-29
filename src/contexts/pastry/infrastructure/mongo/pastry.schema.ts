import { Schema, model, Document } from 'mongoose';
import { Category } from '../../../category/domain/entities/category.entity';
import { User } from '../../../user/domain/entities/user.entity';

export interface PastryDoc extends Document {
    _id: string;
    status: string;
    images: string[];
    name: string;
    price: number;
    description: string;
    tags: string[];
    weight: number;
    fillings: string[];
    additionalServices: string[];
    minWeight: number;
    maxWeight: number;
    reviewIds: string[];
    categoryId: string;
    sellerId: string;
    category: Category | null;
    seller: User | null;
    createdAt: Date;
    updatedAt: Date;
}

const PastrySchema = new Schema<PastryDoc>({
    _id: { type: String, required: true },
    status: { type: String, required: true },
    images: { type: [String], default: [] },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    weight: { type: Number, required: true },
    fillings: { type: [String], default: [] },
    additionalServices: { type: [String], default: [] },
    minWeight: { type: Number, required: true },
    maxWeight: { type: Number, required: true },
    reviewIds: { type: [String], required: true, ref: 'Review' },
    categoryId: { type: String, required: true, ref: 'Category' },
    sellerId: { type: String, required: true, ref: 'User' }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

PastrySchema.virtual('category', {
    ref: 'Category',
    localField: 'categoryId',
    foreignField: '_id',
    justOne: true
});

PastrySchema.virtual('seller', {
    ref: 'User',
    localField: 'sellerId',
    foreignField: '_id',
    justOne: true
});

export const PastryModel = model<PastryDoc>('Pastry', PastrySchema);