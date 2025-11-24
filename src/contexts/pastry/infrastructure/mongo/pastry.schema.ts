import { Schema, model, Document } from 'mongoose';

export interface PastryDoc extends Document {
    _id: string;
    category: string;
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
    confectionerId: string;
    createdAt: Date;
    updatedAt: Date;
}

const PastrySchema = new Schema<PastryDoc>({
    _id: { type: String, required: true },
    category: { type: String, required: true },
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
    confectionerId: { type: String, required: true, ref: 'User' }
}, { timestamps: true });

export const PastryModel = model<PastryDoc>('Pastry', PastrySchema);