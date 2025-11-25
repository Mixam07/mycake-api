import { Schema, model, Document } from 'mongoose';

export interface CategoryDoc extends Document {
    name: string;
    slug: string;
    pastries: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDoc>({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    pastries: [{ type: String, ref: 'Pastry', default: [] }]
}, { timestamps: true });

export const CategoryModel = model<CategoryDoc>('Category', CategorySchema);